export function toJsonSafe<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(value, (_key, current) => {
      if (typeof current === "bigint") return current.toString();
      if (current instanceof Date) return current.toISOString();
      if (typeof current === "number" && !Number.isFinite(current)) return null;
      if (
        typeof current === "undefined" ||
        typeof current === "function" ||
        typeof current === "symbol"
      ) {
        return null;
      }
      return current;
    }),
  ) as T;
}
