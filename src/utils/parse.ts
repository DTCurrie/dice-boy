export const getNextSymbolOrSpace = (toSearch: string): number => {
  const search = toSearch.search(/[A-Z\s]/i);
  return search >= 0 ? search : toSearch.length;
};
