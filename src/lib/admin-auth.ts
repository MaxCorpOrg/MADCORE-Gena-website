export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
  };
}

function decodeBase64Utf8(value: string) {
  if (typeof atob === "function") {
    try {
      const binary = atob(value);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch {
      return null;
    }
  }

  try {
    return Buffer.from(value, "base64").toString("utf8");
  } catch {
    return null;
  }
}

export function isAdminAuthorizationValid(authorizationHeader: string | null) {
  const { username, password } = getAdminCredentials();
  if (!username || !password) {
    return false;
  }

  if (!authorizationHeader?.startsWith("Basic ")) {
    return false;
  }

  const raw = decodeBase64Utf8(authorizationHeader.slice(6));
  if (!raw) return false;

  const separatorIndex = raw.indexOf(":");
  if (separatorIndex === -1) return false;

  const incomingUsername = raw.slice(0, separatorIndex);
  const incomingPassword = raw.slice(separatorIndex + 1);

  return incomingUsername === username && incomingPassword === password;
}
