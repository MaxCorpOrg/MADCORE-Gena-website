const RU_PHONE_DIGITS = 11;

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function normalizeRuDigits(value: string) {
  const digits = digitsOnly(value);
  if (!digits) return "";

  if (digits.length === RU_PHONE_DIGITS && digits.startsWith("8")) {
    return `7${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    return `7${digits}`;
  }

  return digits;
}

export function normalizePhone(value: string) {
  const digits = normalizeRuDigits(value);

  if (digits.length < 11 || digits.length > 15) {
    return null;
  }

  return `+${digits}`;
}

export function formatPhoneInput(value: string) {
  const digits = normalizeRuDigits(value).slice(0, RU_PHONE_DIGITS);

  if (!digits) return "";

  const prefix = digits.startsWith("7") ? "+7" : `+${digits[0]}`;
  const rest = digits.startsWith("7") ? digits.slice(1) : digits.slice(1);

  if (!rest) return prefix;
  if (rest.length <= 3) return `${prefix} ${rest}`;
  if (rest.length <= 6) return `${prefix} ${rest.slice(0, 3)} ${rest.slice(3)}`;
  if (rest.length <= 8) {
    return `${prefix} ${rest.slice(0, 3)} ${rest.slice(3, 6)}-${rest.slice(6)}`;
  }

  return `${prefix} ${rest.slice(0, 3)} ${rest.slice(3, 6)}-${rest.slice(6, 8)}-${rest.slice(8, 10)}`;
}
