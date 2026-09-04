export function fillWeekGaps(
  rows: { period: string; count: number }[],
  weeks: number = 12
): { period: string; count: number }[] {
  const filled: { period: string; count: number }[] = [];
  const map = Object.fromEntries(rows.map((r) => [r.period, r.count]));

  for (let i = weeks - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i * 7);

    const year = date.getFullYear();
    // ISO week number
    const startOfYear = new Date(year, 0, 1);
    const week = Math.ceil(
      ((date.getTime() - startOfYear.getTime()) / 86400000 +
        startOfYear.getDay() +
        1) /
        7
    );
    const period = `${year}-W${String(week).padStart(2, "0")}`;

    filled.push({ period, count: map[period] ?? 0 });
  }

  return filled;
}
