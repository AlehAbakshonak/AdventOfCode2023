let session = "*YOUR COOKIE LOGIN SESSION AT https://adventofcode.com/2023/day/1/input*";
let data = [];

let numbers = [
   {value: 1, name: "one", step: 2},
   {value: 2, name: "two", step: 2},
   {value: 3, name: "three", step: 4},
   {value: 4, name: "four", step: 4},
   {value: 5, name: "five", step: 3},
   {value: 6, name: "six", step: 3},
   {value: 7, name: "seven", step: 4},
   {value: 8, name: "eight", step: 4},
   {value: 9, name: "nine", step: 3}
]

function matchNumbersAtStrPos(str, pos) {
   if (pos >= str.length - 2) return -1;
   for (const number of numbers) {
      let equal = true;
      for (let i = 0; i < number.name.length; i++) {
         if (str[pos + i] !== number.name[i]) {
            equal = false;
            break;
         }
      }
      if (equal) return number;
   }
   return -1;
}

function parseText(text) {
   text = text.split("\n");
   if (text.at(-1).length === 0) text.pop();
   for (const str of text) {
      parseString(str);
   }
}

function parseString(str) {
   let l = str.length;
   let firstMet = false;
   let firstVal = '', lastVal = '';
   for (let pos = 0; pos < l; pos++) {

      let assignVal = (val) => {
         if (!firstMet) {
            firstMet = true;
            firstVal = val;
            return;
         }
         lastVal = val;
      }

      let char = str[pos];
      let stringNumber = matchNumbersAtStrPos(str, pos);
      if (stringNumber !== -1) {
         assignVal(stringNumber.value);
         pos += stringNumber.step - 1;
         continue;
      }

      if (char < 10) {
         assignVal(char);
      }
   }
   if (lastVal === '') lastVal = firstVal;
   data.push(parseInt(firstVal + '' + lastVal));
}

function getData() {
   return fetch('https://adventofcode.com/2023/day/1/input', {
      headers: {Cookie: `session=${session}`},
   })
      .then(response => response.text())
      .then(text => parseText(text));
}

async function init() {
   await getData();
   console.log(data.reduce((a, b) => a + b, 0));
}

init();