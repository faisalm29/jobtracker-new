export function fillMonthGaps(
  rows: { period: string; count: number }[],
  months: number = 12
): { period: string; count: number }[] {
  const map = Object.fromEntries(rows.map((r) => [r.period, r.count]));
  const filled: { period: string; count: number }[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - i);

    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    filled.push({ period, count: map[period] ?? 0 });
  }

  return filled;
}
