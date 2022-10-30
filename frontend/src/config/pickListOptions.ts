export const pickListOptions = [
  { value: 'python', label: 'Python', color: '' },
  { value: 'typescript', label: 'TypeScript', color: '' },
  { value: 'javascript', label: 'JavaScript', color: '' },
  { value: 'ruby', label: 'Ruby', color: '' },
  { value: 'java', label: 'Java', color: '' },
  { value: 'php', label: 'PHP', color: '' },
  { value: 'golang', label: 'GoLang', color: '' },
  { value: 'c++', label: 'C++', color: '' },
  { value: 'c#', label: 'C#', color: '' },
  { value: 'clojure', label: 'Clojure', color: '' },
  { value: 'scala', label: 'Scala', color: '' },
  { value: 'kotlin', label: 'Kotlin', color: '' },
  { value: 'solidity', label: 'Solidity', color: '' },
  { value: 'rust', label: 'Rust', color: '' },
  { value: '.net', label: '.NET', color: '' }
];

pickListOptions.forEach(obj => {
  let letters = ['red', 'green', 'blue', 'orange', 'yellow', 'purple', 'pink', 'cyan'];
  let color = '';
  for (let i = 0; i < 8; i++) {
    color = letters[Math.floor(Math.random() * letters.length)];
  }
  obj.color = color;
});
