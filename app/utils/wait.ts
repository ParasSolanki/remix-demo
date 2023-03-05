export function wait(ms = 500) {
  return new Promise((rs) => setTimeout(rs, ms));
}
