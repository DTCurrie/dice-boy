const firstLetterToUppercase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const capitalizeBySymbol = (value: string, symbol: string) =>
  value.split(symbol).map(firstLetterToUppercase).join(symbol);

export const capitalize = (value: string): string =>
  [" ", "-"].reduce((val, symbol) => capitalizeBySymbol(val, symbol), value);
