export const pluralize = (text: string, value: number): string =>
  `${text}${value > 1 ? "s" : ""}`;
