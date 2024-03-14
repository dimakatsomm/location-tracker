export const toSeconds = (timeExpr: string): number => {
  const timePeriod = new Map([
    ['d', 86400],
    ['h', 3600],
    ['m', 60],
    ['s', 1],
  ]);
  const formattedTime = timeExpr.toLowerCase().matchAll(/(\d+)([dhms])/gim);
  return [...formattedTime].reduce<number>((t = 0, [, v, u]) => timePeriod.get(u) || 0 * parseInt(v) + t, 0);
};
