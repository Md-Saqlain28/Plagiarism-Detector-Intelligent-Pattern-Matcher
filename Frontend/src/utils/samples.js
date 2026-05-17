export const sampleDocuments = [
  {
    id: 'legal',
    name: 'Legal Contract Snippet',
    content: `Terms and Conditions: This agreement ("Agreement") is entered into as of the date of acceptance. 
The Service Provider shall provide the Services to the Customer in accordance with the specifications.
The Customer shall pay the Service Provider the fees set forth in the Order Form.
Confidential Information means any and all information disclosed by one party to the other party.
Neither party shall be liable for any indirect, incidental, special, or consequential damages.
This Agreement shall be governed by and construed in accordance with the laws of the State of California.`
  },
  {
    id: 'essay',
    name: 'Academic Essay Snippet',
    content: `The impact of artificial intelligence on modern society is a subject of intense debate. 
Advancements in machine learning and neural networks have revolutionized various industries.
From healthcare to finance, the applications of AI are vast and diverse.
However, ethical considerations regarding privacy and job displacement remain significant concerns.
Researchers are continuously exploring new algorithms to improve efficiency and accuracy.
Future developments in AI will likely shape the course of human history in ways we cannot yet fully predict.`
  },
  {
    id: 'lorem',
    name: 'Lorem Ipsum',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`
  },
  {
    id: 'code',
    name: 'JavaScript Code Snippet',
    content: `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

const unsortedArray = [5, 3, 8, 1, 2, 7];
const sortedArray = quickSort(unsortedArray);
console.log(sortedArray);`
  }
];
