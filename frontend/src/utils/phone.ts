export function formatPhone10(digits: string) {
  const d = digits.replace(/\D/g, "").slice(0, 10);
  if (d.length !== 10) return digits;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
