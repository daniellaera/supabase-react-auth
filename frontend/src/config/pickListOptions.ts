export const pickListOptions = [
  { value: 'python', label: 'Python', color: '' },
  { value: 'typescript', label: 'TypeScript', color: '' },
  { value: 'html', label: 'HTML', color: '' },
  { value: 'css', label: 'CSS', color: '' },
  { value: 'javascript', label: 'JavaScript', color: '' },
  { value: 'ruby', label: 'Ruby', color: '' },
  { value: 'java', label: 'Java', color: '' },
  { value: 'php', label: 'PHP', color: '' },
  { value: 'golang', label: 'GoLang', color: '' },
];

pickListOptions.forEach(obj => {
  let letters = ['red', 'green', 'blue', 'orange', 'yellow', 'purple', 'pink'];
  let color = '';
  for (let i = 0; i < 6; i++) {
    color = letters[Math.floor(Math.random() * letters.length)];
  }
  obj.color = color;
});
