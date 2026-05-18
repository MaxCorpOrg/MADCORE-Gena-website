import geoip from "geoip-lite";

export type GeoLocation = {
  region?: string;
  city?: string;
};

export function lookupGeoLocation(ip: string): GeoLocation {
  if (!ip || ip === "0.0.0.0" || ip === "::1" || ip === "127.0.0.1") {
    return {};
  }

  const found = geoip.lookup(ip);
  if (!found) return {};

  return {
    region: found.region || undefined,
    city: found.city || undefined,
  };
}
