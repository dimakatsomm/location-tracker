export const toSeconds = (timeExpr: string): number => {
  const timePeriod = new Map([
    ['d', 86400],
    ['h', 3600],
    ['m', 60],
    ['s', 1],
  ]);
  const formattedTime = timeExpr.toLowerCase().matchAll(/(\d+)([dhms])/gim);

  return [...formattedTime].reduce<number>((t, [, v, u]) => t + (timePeriod.get(u) || 0) * parseInt(v), 0);
};
