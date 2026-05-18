type DirectUnits = {
  spent: number;
  remaining: number;
  dailyLimit: number;
};

type DirectApiOptions = {
  service: string;
  method: string;
  params?: Record<string, unknown>;
};

type DirectCampaign = {
  Id: number;
  Name: string;
  State?: string;
  Status?: string;
  DailyBudget?: { Amount?: number; Mode?: string };
};

type DirectAdGroup = {
  Id: number;
  CampaignId: number;
  Name: string;
  Status?: string;
};

type DirectAd = {
  Id: number;
  AdGroupId: number;
  CampaignId?: number;
  State?: string;
  Status?: string;
};

type RecommendationInput = {
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  clicks: number;
  leads: number;
  qualifiedLeads: number;
  sales: number;
  avgScoreIn: number;
  avgScoreOut: number;
  spend?: number | null;
};

function getDirectConfig() {
  return {
    token: process.env.YANDEX_DIRECT_TOKEN ?? "",
    clientLogin: process.env.YANDEX_DIRECT_CLIENT_LOGIN ?? "",
    agencyLogin: process.env.YANDEX_DIRECT_AGENCY_LOGIN ?? "",
    apiUrl: "https://api.direct.yandex.com/json/v5",
    reportsUrl: "https://api.direct.yandex.com/json/v5/reports",
  };
}

function parseUnitsHeader(value: string | null): DirectUnits | null {
  if (!value) return null;
  const [spent, remaining, dailyLimit] = value.split("/").map((item) => Number(item));
  if (![spent, remaining, dailyLimit].every(Number.isFinite)) {
    return null;
  }

  return { spent, remaining, dailyLimit };
}

function createDirectHeaders() {
  const { token, clientLogin, agencyLogin } = getDirectConfig();
  if (!token || !clientLogin) {
    throw new Error("missing_yandex_direct_config");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Accept-Language": "ru",
    "Client-Login": clientLogin,
    ...(agencyLogin ? { "Use-Operator-Units": "true", "Operator-Login": agencyLogin } : {}),
    "Content-Type": "application/json; charset=utf-8",
  };
}

export async function callYandexDirectApi<T>(options: DirectApiOptions) {
  const { apiUrl } = getDirectConfig();
  const response = await fetch(`${apiUrl}/${options.service}`, {
    method: "POST",
    headers: createDirectHeaders(),
    body: JSON.stringify({
      method: options.method,
      params: options.params ?? {},
    }),
    cache: "no-store",
  });

  const units = parseUnitsHeader(response.headers.get("Units"));
  const body = await response.json().catch(() => ({}));

  if (!response.ok || body.error) {
    throw new Error(
      `yandex_direct_error:${response.status}:${body.error?.error_code ?? "unknown"}:${body.error?.error_string ?? "request_failed"}`,
    );
  }

  return {
    result: body.result as T,
    units,
  };
}

export async function getDirectCampaigns() {
  return callYandexDirectApi<{ Campaigns: DirectCampaign[] }>({
    service: "campaigns",
    method: "get",
    params: {
      SelectionCriteria: {},
      FieldNames: ["Id", "Name", "State", "Status", "DailyBudget"],
    },
  });
}

export async function getDirectAdGroups(campaignIds: number[]) {
  return callYandexDirectApi<{ AdGroups: DirectAdGroup[] }>({
    service: "adgroups",
    method: "get",
    params: {
      SelectionCriteria: campaignIds.length ? { CampaignIds: campaignIds } : {},
      FieldNames: ["Id", "CampaignId", "Name", "Status"],
    },
  });
}

export async function getDirectAds(campaignIds: number[]) {
  return callYandexDirectApi<{ Ads: DirectAd[] }>({
    service: "ads",
    method: "get",
    params: {
      SelectionCriteria: campaignIds.length ? { CampaignIds: campaignIds } : {},
      FieldNames: ["Id", "AdGroupId", "CampaignId", "State", "Status"],
    },
  });
}

export async function getDirectReportTSV(params: Record<string, unknown>) {
  const { reportsUrl } = getDirectConfig();
  const response = await fetch(reportsUrl, {
    method: "POST",
    headers: {
      ...createDirectHeaders(),
      processingMode: "auto",
      returnMoneyInMicros: "false",
      skipReportHeader: "true",
      skipColumnHeader: "false",
      skipReportSummary: "true",
    },
    body: JSON.stringify(params),
    cache: "no-store",
  });

  const units = parseUnitsHeader(response.headers.get("Units"));
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`yandex_direct_report_error:${response.status}:${text.slice(0, 256)}`);
  }

  return {
    text,
    units,
  };
}

export function buildTrafficRecommendation(input: RecommendationInput) {
  if (input.sales > 0) return "усилить";
  if (input.qualifiedLeads >= 3 && input.avgScoreOut >= 60) return "усилить";
  if (input.clicks >= 20 && input.leads === 0) return "отключить";
  if (input.clicks >= 20 && input.qualifiedLeads === 0 && input.avgScoreIn < 45) return "снизить";
  if (input.leads > 0 && input.qualifiedLeads === 0) return "проверить вручную";
  if (input.avgScoreIn >= 70 && input.avgScoreOut >= 40) return "оставить";
  return "проверить вручную";
}
