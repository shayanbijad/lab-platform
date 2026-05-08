export function formatOrderId(id) {
  if (!id || typeof id !== "string") return "ORD-??????";
  const compact = id.replace(/-/g, "").toUpperCase();
  return `ORD-${compact.slice(0, 8)}`;
}
