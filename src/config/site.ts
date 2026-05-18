const PREVIEW_SITE_DOMAIN = "gena.madcore-kavkaz.ru";

export const siteContent = {
  productName: "MADCORE Gena",
  siteDomain: PREVIEW_SITE_DOMAIN,
  heroImagePath: "/images/hero-gena-silver-v1.svg",
  siteTitle: "MADCORE Gena - консультация и сопровождение по РФ",
  siteDescription:
    "MADCORE Gena. Серебряная версия сайта консультаций и сопровождения с отдельной рекламной и аналитической инфраструктурой.",
  ogDescription:
    "MADCORE Gena. Отдельный региональный контур с быстрым переходом в Telegram, WhatsApp и MaX.",
  heroEyebrowLines: ["Серебряная версия MADCORE", "Консультация и сопровождение по РФ"],
  heroFeatures: [
    ["Быстрый выход", "в мессенджер"],
    ["Отдельная аналитика", "и рекламный учет"],
    ["Персональное сопровождение", "по заявке"],
  ],
  heroStatFormatLabel: "Формат",
  heroStatFormatValue: "1 флакон / 5 мл",
  benefitsTitle: "Почему выбирают MADCORE Gena",
  benefitsItems: [
    "Отдельный региональный сайт без пересечения с основным контуром MADCORE",
    "Самостоятельные UTM-метки, цели и события для рекламного трафика",
    "Быстрый переход в Telegram, WhatsApp и MaX без лишних шагов",
    "Отдельный Telegram-бот для приема заявок и уведомлений менеджеру",
    "Та же проверенная логика фильтрации трафика и антифрода",
    "Отдельный контур заявок, событий и контроля качества лидов",
    "Серебряный визуальный стиль без вмешательства в основной золотой сайт",
    "Подготовленная база для отдельного домена и развертывания на том же сервере",
  ],
  officialBandText:
    "MADCORE Gena работает как самостоятельный сайт: отдельный брендовый контур, отдельная аналитика и отдельный прием заявок.",
  officeTitle: "Как проходит сопровождение",
  officeAddress:
    "Работаем по заявке: помогаем выбрать удобный канал связи, уточняем детали и передаем клиента менеджеру в Telegram, WhatsApp или MaX.",
  stepsTitle: "Как оформить заявку",
  steps: [
    "Напишите в Telegram, WhatsApp или MaX.",
    "Или оставьте заявку на консультацию.",
    "Менеджер свяжется с вами в выбранном канале.",
  ],
  formTitle: "Получить консультацию",
  formDescription:
    "Оставьте данные. Подскажем актуальную информацию по продукту, наличию и сразу перейдем в удобный канал связи.",
  formTrustHint: "",
  formConsent:
    "Нажимая кнопку, вы соглашаетесь на обработку данных для обратной связи и консультации.",
  productTitle: "Продукт",
  productDescription:
    "MADCORE Gena - отдельная серебряная версия сайта консультаций по продукту с тем же проверенным lead-flow, рекламной фильтрацией и аналитической инфраструктурой.",
  thanksTitle: "Заявка принята",
  thanksDescription: "Спасибо. Мы получили заявку по проекту MADCORE Gena. Менеджер свяжется с вами.",
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

  return {
    productName,
    publicPrice,
    siteDomain,
    publicBaseUrl: process.env.PUBLIC_BASE_URL || `https://${siteDomain}`,
    telegramUrl: process.env.TELEGRAM_GROUP_URL || "https://t.me/vorgesar",
    whatsappUrl: process.env.WHATSAPP_URL || "https://wa.me/79042440444",
    maxUrl:
      process.env.MAX_URL ||
      "https://max.ru/u/f9LHodD0cOIXADxaRo9U9W_VHmDuRL5fMKsJO5O9YAs5rg0iZYqYmXKw0dw",
    publicPhone,
    dialPhone,
    publicAddress,
    callUrl: `tel:${dialPhone}`,
  };
}
