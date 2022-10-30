export const truncate = (str: string) => {
  return str.length > 1 ? str.substring(0, 1) + '' : str;
};

export const getRandomColor = (): string => {
  let letters = ['red', 'green', 'blue', 'orange', 'yellow', 'purple', 'pink', 'cyan'];
  let color = '';
  for (let i = 0; i < 8; i++) {
    color = letters[Math.floor(Math.random() * letters.length)];
  }
  return color
}