export function normalizeFiles(files) {
  const normalized = {};
  for (const [path, value] of Object.entries(files || {})) {
    if (typeof value === "string") {
      normalized[path] = { code: value };
    } else if (value && typeof value.code === "string") {
      normalized[path] = { code: value.code };
    } else {
      console.warn(`Invalid file: ${path}`, value);
      normalized[path] = { code: "" };
    }
  }
  return normalized;
}