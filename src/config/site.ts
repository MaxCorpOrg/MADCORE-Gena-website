const DEFAULT_SITE_DOMAIN = "madcore.site";

export const siteContent = {
  productName: "MADCORE 2.0",
  siteDomain: DEFAULT_SITE_DOMAIN,
  displayDomainLabel: "madcore.site",
  heroImagePath: "/images/hero-metallic-premium-v1.png",
  siteTitle: "MADCORE 2.0 - консультация и заказ на Северном Кавказе",
  siteDescription:
    "MADCORE 2.0. Консультация, актуальная информация по продукту и заказ через Telegram или WhatsApp.",
  ogDescription:
    "Мощное локальное жиросжигание. Сильнейшее системое жиросжигание. Рост сухой мышечной мыссы.",
  heroEyebrowLines: ["Премиальный продукт", "Аналогов нет во всем мире"],
  heroFeatures: [
    ["Мощное локальное", "жиросжигание"],
    ["Сильнейшее системое", "жиросжигание"],
    ["Рост сухой мышечной", "мыссы"],
  ],
  heroStatFormatLabel: "Формат",
  heroStatFormatValue: "1 флакон / 5 мл",
  benefitsTitle: "Что вы получаете применяя MADCORE",
  benefitsItems: [
    "Мощное локальное жиросжигание (в местах введения)",
    "Эффективное системное жиросжигание (по всему телу)",
    "Рост качественной сухой мышечной массы (при тренировках с отягощением)",
    "Повышение силовых показателей",
    "Восстановление после тренировок",
    "Улучшает качество сна",
    "Оказывает положительное влияние на опорно-двигательный аппарат",
    "Улучшает качество кожи, волос и ногтей",
  ],
  officialBandText: "Мы являемся официальным представителем",
  officeTitle: "",
  officeAddress: "",
  stepsTitle: "Как сделать заказ",
  steps: [
    "Напишите в Telegram или WhatsApp.",
    "Или оформите заявку на консультацию",
    "Менеджер свяжется с вами.",
  ],
  formTitle: "Получить консультацию",
  formDescription:
    "Оставьте данные - подскажем актуальную информацию по продукту, наличию и способу связи.",
  formTrustHint: "",
  formConsent:
    "Нажимая кнопку, вы соглашаетесь на обработку данных для обратной связи и консультации.",
  productTitle: "Продукт",
  productDescription:
    "MADCORE 2.0 - инновационный продукт, который изменит ваш взгляд на процесс сжигания жира и улучшение физической формы.",
  thanksTitle: "Заявка принята",
  thanksDescription: "Спасибо. Мы получили вашу заявку. Менеджер свяжется с вами.",
  privacyTitle: "Политика конфиденциальности",
  safeTitle: "Информационная страница",
  safeDescription: "Информационная страница временно недоступна.",
} as const;

function toDialPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits ? `+${digits}` : "+79042440444";
}

export function getSiteRuntimeConfig() {
  const productName = process.env.PRODUCT_NAME || siteContent.productName;
  const publicPrice = Number(process.env.PUBLIC_PRICE || "14000").toLocaleString("ru-RU");
  const publicPhone = process.env.PUBLIC_PHONE || "+7-904-244-04-44";
  const dialPhone = toDialPhone(publicPhone);
  const publicAddress = process.env.PUBLIC_ADDRESS || siteContent.officeAddress;
  const siteDomain = process.env.SITE_DOMAIN || siteContent.siteDomain;
  const displayDomain = process.env.SITE_DISPLAY_DOMAIN || siteContent.displayDomainLabel || siteDomain;

  return {
    productName,
    publicPrice,
    siteDomain,
    displayDomain,
    publicBaseUrl: process.env.PUBLIC_BASE_URL || `https://${siteDomain}`,
    telegramUrl: process.env.TELEGRAM_GROUP_URL || "https://t.me/vorgesar",
    telegramChatUrl: process.env.TELEGRAM_CHAT_URL || "https://t.me/MadCoreChat",
    whatsappUrl: process.env.WHATSAPP_URL || "https://wa.me/79042440444",
    maxUrl:
      process.env.MAX_URL ||
      "https://max.ru/u/f9LHodD0cOIXADxaRo9U9W_VHmDuRL5fMKsJO5O9YAs5rg0iZYqYmXKw0dw",
    maxChatUrl:
      process.env.MAX_CHAT_URL ||
      "https://max.ru/join/gkeLUFOdvn5QYSNerv59YDPCxDSK388EPyAb7zxc6cw",
    publicPhone,
    dialPhone,
    publicAddress,
    callUrl: `tel:${dialPhone}`,
  };
}
