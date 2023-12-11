//let session = "*YOUR COOKIE LOGIN SESSION AT https://adventofcode.com/2023/day/4/input*";
let session = "53616c7465645f5fbd80d9316fe2bc6cf3315d22a0d3f7f6342cce875e6acd3554fa3b9053106dd6c79b93855a0c8ff680cf25c279b11a76c50996b3ee24b740";

function parseText(text) {
   let lines = text.split("\n");
   if (lines.at(-1).length === 0) lines.pop();
   return lines;
}

function extractValues(line, from, to, splitWith = ' ') {
   let toIndex;
   let toIsChar;
   if (isNaN(parseInt(from))) from = line.indexOf(from) + 1;
   if (isNaN(parseInt(to))) {
      toIsChar = true;
      toIndex = line.length;
   }
   else {
      toIsChar = false;
      toIndex = (to === -1 ? line.length : to);
   }

   let currentVal = "";
   let values = [];
   let i = from;
   for (i; i < toIndex; i++) {
      let char = line[i];

      if (char !== splitWith) currentVal += char;

      if ((char === splitWith || i === toIndex - 1) && currentVal !== "") {
         values.push(parseInt(currentVal));
         currentVal = "";
      }

      if (toIsChar && char === to) break;
   }
   return [values, ++i];
}

function extractWinning(line) {
   return extractValues(line, ':', '|', ' ');
}

function extractHaving(line, startPos = -1) {
   return extractValues(line, startPos, -1, ' ');
}

function sortedIndexOf(arr, target) {
   for (let i = 0; i < arr.length; i++) {
      if (arr[i] === target) return i;
      if (arr[i] > target) return -1;
   }
   return -1;
}

function compareWinsAndHaves(winning, having, part) {
   let winPoints = 0;
   let arr = []
   for (const have of having) {
      let result = sortedIndexOf(winning, have);
      if (result > -1) {
         arr.push(have);
         if (part === 1) {
            if (winPoints === 0) {
               winPoints = 1
            }
            else winPoints *= 2;
         }
         else winPoints++;

      }
   }
   return winPoints;
}

function parseLine(line, part = 1) {
   let [winning, winningEndPos] = extractWinning(line);
   winning.sort((a, b) => a - b);
   let [having] = extractHaving(line, winningEndPos);
   return compareWinsAndHaves(winning, having, part);
}

function solvePartOne(lines) {
   let sum = 0;
   for (const line of lines) {
      sum += parseLine(line, 1);
   }
   return sum;
}

function solvePartTwo(lines) {
   let cardAmount = 0;
   lines = lines.map((line, i) => ({id: i, text: line.toString(), points: -1}));
   for (let line of lines) {
      if (line.points === -1) {
         line.points = parseLine(line.text, 2);
      }
      let copies = [];
      if (line.points > 0) {
         copies = lines.slice(line.id + 1, line.id + line.points + 1);
         lines.push(...copies);
      }
      cardAmount++;
   }
   return cardAmount;
}

function getDataAsText() {
   return fetch('https://adventofcode.com/2023/day/4/input', {
      headers: {Cookie: `session=${session}`},
   })
      .then(response => {
         if (response.ok) {
            return response.text();
         }
         else {
            response.text().then(console.error);
            throw new Error("Some fetch error happened, check if session have valid session cookie");
         }
      })
}

async function init() {
   let text = await getDataAsText();
   let lines = parseText(text);
   let partOneSum = solvePartOne(lines);
   let partTwoSum = solvePartTwo(lines);
   console.log(`Sum of winning numbers = ${partOneSum}\nAmount of cards = ${partTwoSum}`);
}

init();