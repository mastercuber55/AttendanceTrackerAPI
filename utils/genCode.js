export default function genCode(prefix = "ERR") {
  const random = Math.random().toString(36).substring(2, 7); // 5 chars: a-z, 0-9
  const timestamp = Date.now().toString(36).slice(-3); // 3 chars from timestamp
  return `${prefix}-${random}${timestamp}`.toUpperCase(); // e.g., ERR-A1Z9KRD
}
