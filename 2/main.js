let session = "*YOUR COOKIE LOGIN SESSION AT https://adventofcode.com/2023/day/2/input*";
let limits = {r: 12, g: 13, b: 14};

function parseText(text) {
   let lines = text.split("\n");
   if (lines.at(-1).length === 0) lines.pop();
   return lines;
}

parseLine.gameTemplate = {r: 0, g: 0, b: 0};
parseLine.signs = ",:;rgb";
parseLine.colorStep = {r: 1, g: 3, b: 2};

function parseLine(line) {
   let gameWordLen = 5;
   let ID = 0,
      minimums = {r: 0, g: 0, b: 0},
      games = [{...parseLine.gameTemplate}],
      cur = '';
   for (let i = gameWordLen; i < line.length; i++) {
      let char = line[i];
      if (char === " ") continue;
      let sign = parseLine.signs.indexOf(char);
      if (sign === 1) ID = parseInt(cur);
      if (sign === 2) games.push({...parseLine.gameTemplate});
      if (sign >= 3) {
         let number = parseInt(cur);
         games.at(-1)[char] = number;
         minimums[char] = Math.max(minimums[char], number);
         if (number > limits[char]) ID = 0;
         i += parseLine.colorStep[char];
      }
      sign >= 0 ? cur = "" : cur += char;

   }
   let power = minimums.r * minimums.g * minimums.b;
   return [ID, power];
}

function getDataAsText() {
   return fetch('https://adventofcode.com/2023/day/2/input', {
      headers: {Cookie: `session=${session}`},
   })
      .then(response => response.text());
}

async function init() {
   let text = await getDataAsText();
   let lines = parseText(text);
   let sumOfValidID = 0;
   let sumOfPowers = 0;
   for (const line of lines) {
      let [ID, power] = parseLine(line);
      sumOfValidID += ID;
      sumOfPowers += power;
   }
   console.log(`Sum of valid ID's = ${sumOfValidID}\nSum of powers = ${sumOfPowers}`);
}

init();