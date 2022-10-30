export const truncate = (str: string) => {
  return str.length > 1 ? str.substring(0, 1) + '' : str;
};