#!/usr/bin/env node

import { readFileSync } from "fs";
import { resolve } from "path";

function parseCampaignSpec(rawValue) {
  const value = rawValue.trim();
  if (!value) return null;

  const [labelPart, idPart] = value.split(":");
  const label = labelPart?.trim();
  const id = Number(idPart?.trim());

  if (!label || !Number.isInteger(id) || id <= 0) {
    throw new Error(`invalid_campaign_spec:${rawValue}`);
  }

  return { label, id };
}

function parseCampaignList(rawValue) {
  if (!rawValue) return [];

  return rawValue
    .split(",")
    .map((item) => parseCampaignSpec(item))
    .filter(Boolean);
}

function parseArgs(argv) {
  const options = {
    apply: false,
    tokenFile: null,
    clientLogin: process.env.YANDEX_DIRECT_CLIENT_LOGIN || "Max.Corp.Org",
    sourceFile: resolve("docs/archive-origin/direct-import/yandex-minus-words-common.txt"),
    campaigns: parseCampaignList(process.env.YANDEX_DIRECT_CAMPAIGNS || ""),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (current === "--apply") {
      options.apply = true;
      continue;
    }

    if (current === "--token-file") {
      options.tokenFile = argv[index + 1] ?? null;
      index += 1;
      continue;
    }

    if (current === "--client-login") {
      options.clientLogin = argv[index + 1] ?? options.clientLogin;
      index += 1;
      continue;
    }

    if (current === "--campaign") {
      const campaign = parseCampaignSpec(argv[index + 1] ?? "");
      if (campaign) {
        options.campaigns.push(campaign);
      }
      index += 1;
      continue;
    }

    if (current === "--source-file") {
      options.sourceFile = resolve(argv[index + 1] ?? options.sourceFile);
      index += 1;
      continue;
    }

    throw new Error(`unknown_argument:${current}`);
  }

  return options;
}

function getToken(options) {
  const inlineToken = process.env.YANDEX_DIRECT_TOKEN?.trim();
  if (inlineToken) return inlineToken;

  if (options.tokenFile) {
    return readFileSync(options.tokenFile, "utf8").trim();
  }

  throw new Error("missing_yandex_direct_token");
}

function loadBaseNegativeKeywords(sourceFile) {
  const raw = readFileSync(sourceFile, "utf8");
  return raw
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && !item.startsWith("#"));
}

function normalizeNegativeKeywordKey(value) {
  return value
    .toLowerCase()
    .replace(/!/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function mergeNegativeKeywords(existingItems, baseItems) {
  const merged = [];
  const seen = new Set();

  for (const value of [...existingItems, ...baseItems]) {
    const normalized = value.trim();
    if (!normalized) continue;
    const key = normalizeNegativeKeywordKey(normalized);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(normalized);
  }

  return merged;
}

async function callDirect({ token, clientLogin, service, method, params }) {
  const response = await fetch(`https://api.direct.yandex.com/json/v5/${service}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Accept-Language": "ru",
      "Client-Login": clientLogin,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ method, params }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.error) {
    throw new Error(
      `yandex_direct_error:${response.status}:${body.error?.error_code ?? "unknown"}:${body.error?.error_string ?? "request_failed"}`,
    );
  }

  return {
    result: body.result,
    units: response.headers.get("Units") ?? null,
  };
}

async function getCampaigns(token, clientLogin, campaigns) {
  const response = await callDirect({
    token,
    clientLogin,
    service: "campaigns",
    method: "get",
    params: {
      SelectionCriteria: { Ids: campaigns.map((campaign) => campaign.id) },
      FieldNames: ["Id", "Name", "Type", "State", "Status", "NegativeKeywords"],
    },
  });

  return response;
}

async function updateCampaigns(token, clientLogin, campaigns) {
  return callDirect({
    token,
    clientLogin,
    service: "campaigns",
    method: "update",
    params: {
      Campaigns: campaigns.map((campaign) => ({
        Id: campaign.Id,
        NegativeKeywords: {
          Items: campaign.nextNegativeKeywords,
        },
      })),
    },
  });
}

function prepareCampaigns(configuredCampaigns, liveCampaigns, baseNegativeKeywords) {
  const liveById = new Map(liveCampaigns.map((campaign) => [campaign.Id, campaign]));

  return configuredCampaigns.map(({ id, label }) => {
    const campaign = liveById.get(id);
    if (!campaign) {
      throw new Error(`campaign_not_found:${id}`);
    }

    if (campaign.Type !== "TEXT_CAMPAIGN") {
      throw new Error(`unsupported_campaign_type:${id}:${campaign.Type}`);
    }

    const currentItems = campaign.NegativeKeywords?.Items ?? [];
    const nextItems = mergeNegativeKeywords(currentItems, baseNegativeKeywords);
    const currentKeys = new Set(currentItems.map((item) => normalizeNegativeKeywordKey(item)));

    return {
      ...campaign,
      label,
      currentNegativeKeywords: currentItems,
      nextNegativeKeywords: nextItems,
      addedItems: nextItems.filter(
        (item) => !currentKeys.has(normalizeNegativeKeywordKey(item)),
      ),
    };
  });
}

function printPlan(preparedCampaigns, applyMode) {
  console.log(
    JSON.stringify(
      {
        mode: applyMode ? "apply" : "dry-run",
        campaigns: preparedCampaigns.map((campaign) => ({
          id: campaign.Id,
          name: campaign.Name,
          type: campaign.Type,
          state: campaign.State,
          status: campaign.Status,
          current_negative_keywords: campaign.currentNegativeKeywords.length,
          next_negative_keywords: campaign.nextNegativeKeywords.length,
          added_negative_keywords: campaign.addedItems.length,
          added_items_preview: campaign.addedItems.slice(0, 10),
        })),
      },
      null,
      2,
    ),
  );
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const token = getToken(options);
  const baseNegativeKeywords = loadBaseNegativeKeywords(options.sourceFile);

  if (baseNegativeKeywords.length === 0) {
    throw new Error("negative_keywords_source_is_empty");
  }

  if (options.campaigns.length === 0) {
    throw new Error("missing_yandex_direct_campaigns");
  }

  const before = await getCampaigns(token, options.clientLogin, options.campaigns);
  const preparedCampaigns = prepareCampaigns(
    options.campaigns,
    before.result.Campaigns ?? [],
    baseNegativeKeywords,
  );
  printPlan(preparedCampaigns, options.apply);

  if (!options.apply) {
    console.log(`campaigns_get_units=${before.units ?? "n/a"}`);
    return;
  }

  const changedCampaigns = preparedCampaigns.filter(
    (campaign) => campaign.addedItems.length > 0,
  );

  if (changedCampaigns.length === 0) {
    console.log("No campaign changes needed.");
    console.log(`campaigns_get_units=${before.units ?? "n/a"}`);
    return;
  }

  const update = await updateCampaigns(token, options.clientLogin, changedCampaigns);
  console.log(`campaigns_get_units=${before.units ?? "n/a"}`);
  console.log(`campaigns_update_units=${update.units ?? "n/a"}`);
  console.log(JSON.stringify(update.result, null, 2));

  const after = await getCampaigns(token, options.clientLogin, options.campaigns);
  const verifiedCampaigns = prepareCampaigns(
    options.campaigns,
    after.result.Campaigns ?? [],
    baseNegativeKeywords,
  );
  console.log(
    JSON.stringify(
      {
        verification: verifiedCampaigns.map((campaign) => ({
          id: campaign.Id,
          current_negative_keywords: campaign.currentNegativeKeywords.length,
          still_missing: campaign.addedItems.length,
        })),
      },
      null,
      2,
    ),
  );
  console.log(`campaigns_verify_units=${after.units ?? "n/a"}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
