import Link from "next/link";
import { LeadStatus } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { LEAD_STATUS_VALUES, getLeadStatusLabel, toPublicLeadStatus } from "@/lib/lead-status";

type AdminLeadsPageProps = {
  searchParams: Promise<{
    days?: string;
    status?: string;
    src?: string;
    cmp?: string;
  }>;
};

function parseDays(raw?: string) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return 7;
  return Math.min(parsed, 90);
}

function parseStatus(raw?: string): LeadStatus | undefined {
  switch (raw) {
    case "new":
      return LeadStatus.NEW;
    case "in_progress":
      return LeadStatus.IN_PROGRESS;
    case "qualified":
      return LeadStatus.QUALIFIED;
    case "bad":
      return LeadStatus.BAD;
    case "duplicate":
      return LeadStatus.DUPLICATE;
    case "sale":
      return LeadStatus.SALE;
    default:
      return undefined;
  }
}

function getDefaultSummary() {
  return {
    clicksDay: 0,
    clicks7Days: 0,
    suspiciousClicks7Days: 0,
    avgScoreIn7Days: 0,
    leadsDay: 0,
    leads7Days: 0,
    qualifiedLeads7Days: 0,
    badLeads7Days: 0,
    sales7Days: 0,
  };
}

export default async function AdminLeadsPage({ searchParams }: AdminLeadsPageProps) {
  noStore();

  const params = await searchParams;
  const days = parseDays(params.days);
  const status = parseStatus(params.status);
  const src = params.src?.trim() || undefined;
  const cmp = params.cmp?.trim() || undefined;

  if (!prisma) {
    return (
      <main className="page-shell">
        <section className="container py-14">
          <div className="card admin-shell">
            <h1 className="section-title">Служебная страница лидов</h1>
            <p className="section-copy">
              Эта страница работает только в режиме PostgreSQL. Локальный файловый режим не поддерживает
              служебный интерфейс лидов.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const now = Date.now();
  const dayStart = new Date(now - 24 * 60 * 60 * 1000);
  const since = new Date(now - days * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

  const leadWhere = {
    createdAt: { gte: since },
    ...(status ? { leadStatus: status } : {}),
    ...(src ? { src } : {}),
    ...(cmp ? { cmp } : {}),
  };

  const [leads, summary, sourceQuality] = await Promise.all([
    prisma.lead.findMany({
      where: leadWhere,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        phone: true,
        city: true,
        contactMethod: true,
        productInterest: true,
        leadStatus: true,
        scoreOut: true,
        saleAmount: true,
        managerComment: true,
        src: true,
        cmp: true,
        cr: true,
        clickId: true,
        clientId: true,
        yclid: true,
        utmSource: true,
        utmCampaign: true,
        utmContent: true,
        utmTerm: true,
      },
    }),
    Promise.all([
      prisma.click.count({ where: { createdAt: { gte: dayStart } } }),
      prisma.click.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.click.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
          isSuspicious: true,
        },
      }),
      prisma.click.aggregate({
        where: { createdAt: { gte: sevenDaysAgo } },
        _avg: { scoreIn: true },
      }),
      prisma.lead.count({ where: { createdAt: { gte: dayStart } } }),
      prisma.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.lead.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
          leadStatus: LeadStatus.QUALIFIED,
        },
      }),
      prisma.lead.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
          leadStatus: LeadStatus.BAD,
        },
      }),
      prisma.lead.count({
        where: {
          createdAt: { gte: sevenDaysAgo },
          leadStatus: LeadStatus.SALE,
        },
      }),
    ]).then(
      ([
        clicksDay,
        clicks7Days,
        suspiciousClicks7Days,
        avgScoreIn7Days,
        leadsDay,
        leads7Days,
        qualifiedLeads7Days,
        badLeads7Days,
        sales7Days,
      ]) => ({
        clicksDay,
        clicks7Days,
        suspiciousClicks7Days,
        avgScoreIn7Days: avgScoreIn7Days._avg.scoreIn ?? 0,
        leadsDay,
        leads7Days,
        qualifiedLeads7Days,
        badLeads7Days,
        sales7Days,
      }),
    ),
    prisma.trafficSourceQuality.findMany({
      orderBy: [{ qualifiedLeads: "desc" }, { leads: "desc" }, { clicks: "desc" }],
      take: 20,
    }),
  ]);

  const metrics = summary || getDefaultSummary();

  return (
    <main className="page-shell">
      <section className="container py-14">
        <div className="admin-shell">
          <div className="admin-header">
            <div>
              <h1 className="section-title">Служебная страница лидов</h1>
              <p className="section-copy">
                Здесь оператор видит клики, лиды, оценки качества, кампании и может менять статус лида.
              </p>
            </div>
            <Link href="/api/admin/reports/traffic-quality" className="btn btn-secondary admin-report-link">
              JSON-отчет по источникам
            </Link>
          </div>

          <form className="card admin-filters" method="get">
            <label className="field-group" htmlFor="days">
              <span className="field-label">Период, дней</span>
              <input id="days" name="days" className="field" defaultValue={String(days)} />
            </label>
            <label className="field-group" htmlFor="status">
              <span className="field-label">Статус</span>
              <select id="status" name="status" className="field" defaultValue={params.status || ""}>
                <option value="">Все</option>
                {LEAD_STATUS_VALUES.map((value) => (
                  <option key={value} value={value}>
                    {getLeadStatusLabel(value)}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-group" htmlFor="src">
              <span className="field-label">Источник</span>
              <input id="src" name="src" className="field" defaultValue={src} placeholder="yandex" />
            </label>
            <label className="field-group" htmlFor="cmp">
              <span className="field-label">Кампания</span>
              <input id="cmp" name="cmp" className="field" defaultValue={cmp} placeholder="cmp" />
            </label>
            <button type="submit" className="btn btn-primary admin-submit">
              Применить
            </button>
          </form>

          <div className="admin-summary-grid">
            <article className="card admin-summary-card">
              <span className="stat-key">Клики за день</span>
              <span className="stat-value">{metrics.clicksDay}</span>
            </article>
            <article className="card admin-summary-card">
              <span className="stat-key">Клики за 7 дней</span>
              <span className="stat-value">{metrics.clicks7Days}</span>
            </article>
            <article className="card admin-summary-card">
              <span className="stat-key">Подозрительные клики</span>
              <span className="stat-value">{metrics.suspiciousClicks7Days}</span>
            </article>
            <article className="card admin-summary-card">
              <span className="stat-key">Средняя входная оценка</span>
              <span className="stat-value">{metrics.avgScoreIn7Days.toFixed(1)}</span>
            </article>
            <article className="card admin-summary-card">
              <span className="stat-key">Лиды за день</span>
              <span className="stat-value">{metrics.leadsDay}</span>
            </article>
            <article className="card admin-summary-card">
              <span className="stat-key">Лиды за 7 дней</span>
              <span className="stat-value">{metrics.leads7Days}</span>
            </article>
            <article className="card admin-summary-card">
              <span className="stat-key">Качественные лиды</span>
              <span className="stat-value">{metrics.qualifiedLeads7Days}</span>
            </article>
            <article className="card admin-summary-card">
              <span className="stat-key">Плохие лиды</span>
              <span className="stat-value">{metrics.badLeads7Days}</span>
            </article>
            <article className="card admin-summary-card">
              <span className="stat-key">Продажи</span>
              <span className="stat-value">{metrics.sales7Days}</span>
            </article>
          </div>

          <div className="card admin-table-shell">
            <h2 className="section-title admin-section-title">Последние лиды</h2>
            <div className="admin-table">
              {leads.map((lead) => (
                <article className="admin-lead-row" key={lead.id.toString()}>
                  <div className="admin-lead-main">
                    <div className="admin-lead-head">
                      <strong>{lead.name}</strong>
                      <span className="admin-status-pill">{getLeadStatusLabel(toPublicLeadStatus(lead.leadStatus))}</span>
                    </div>
                    <p className="section-copy">
                      {lead.phone} · {lead.city} · {lead.contactMethod}
                    </p>
                    <p className="admin-lead-meta">
                      ID лида: {lead.id.toString()} · Оценка качества: {lead.scoreOut} · Сумма продажи:{" "}
                      {lead.saleAmount ?? 0}
                    </p>
                    <p className="admin-lead-meta">
                      Источник: {lead.src || "—"} · Кампания: {lead.cmp || "—"} · Креатив: {lead.cr || "—"} · Click ID:{" "}
                      {lead.clickId || "—"} · YCLID: {lead.yclid || "—"} · ClientID: {lead.clientId || "—"}
                    </p>
                    <p className="admin-lead-meta">
                      UTM: {lead.utmSource || "—"} / {lead.utmCampaign || "—"} / {lead.utmContent || "—"} /{" "}
                      {lead.utmTerm || "—"}
                    </p>
                  </div>

                  <form
                    className="admin-lead-form"
                    action={`/api/admin/leads/${lead.id.toString()}`}
                    method="post"
                  >
                    <input type="hidden" name="lead_id" value={lead.id.toString()} />
                    <label className="field-group" htmlFor={`status-${lead.id.toString()}`}>
                      <span className="field-label">Статус</span>
                      <select
                        id={`status-${lead.id.toString()}`}
                        name="lead_status"
                        className="field"
                        defaultValue={toPublicLeadStatus(lead.leadStatus)}
                      >
                        {LEAD_STATUS_VALUES.map((value) => (
                          <option key={value} value={value}>
                            {getLeadStatusLabel(value)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="field-group" htmlFor={`comment-${lead.id.toString()}`}>
                      <span className="field-label">Комментарий менеджера</span>
                      <textarea
                        id={`comment-${lead.id.toString()}`}
                        name="manager_comment"
                        className="field admin-comment-field"
                        defaultValue={lead.managerComment || ""}
                      />
                    </label>
                    <label className="field-group" htmlFor={`sale-${lead.id.toString()}`}>
                      <span className="field-label">Сумма продажи</span>
                      <input
                        id={`sale-${lead.id.toString()}`}
                        name="sale_amount"
                        className="field"
                        inputMode="numeric"
                        defaultValue={lead.saleAmount?.toString() || ""}
                      />
                    </label>
                    <button type="submit" className="btn btn-primary">
                      Сохранить статус
                    </button>
                  </form>
                </article>
              ))}
            </div>
          </div>

          <div className="card admin-table-shell">
            <h2 className="section-title admin-section-title">Качество источников</h2>
            {sourceQuality.length === 0 ? (
              <p className="section-copy">
                Таблица `traffic_sources_quality` пока не заполнена. Сначала нужно выполнить серверный скрипт
                обновления отчета по качеству источников.
              </p>
            ) : (
              <div className="admin-source-grid">
                {sourceQuality.map((row) => (
                  <article className="admin-source-card" key={row.id.toString()}>
                    <p className="admin-lead-meta">
                      Кампания: {row.utmCampaign || "—"} · Объявление: {row.utmContent || "—"}
                    </p>
                    <p className="admin-lead-meta">
                      Ключ: {row.utmTerm || "—"} · Клики: {row.clicks} · Лиды: {row.leads}
                    </p>
                    <p className="admin-lead-meta">
                      Качественные лиды: {row.qualifiedLeads} · Продажи: {row.sales}
                    </p>
                    <p className="admin-lead-meta">
                      Средняя входная оценка: {row.avgScoreIn.toFixed(1)} · Средняя оценка лида:{" "}
                      {row.avgScoreOut.toFixed(1)}
                    </p>
                    <p className="section-copy">Рекомендация: {row.recommendation || "проверить вручную"}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
