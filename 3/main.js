let session = "*YOUR COOKIE LOGIN SESSION AT https://adventofcode.com/2023/day/3/input*";

function parseText(text) {
   let lines = text.split("\n");
   if (lines.at(-1).length === 0) lines.pop();
   return lines;
}

function getDataAsText() {
   return fetch('https://adventofcode.com/2023/day/3/input', {
      headers: {Cookie: `session=${session}`},
   })
      .then(response => {
         if (response.ok) return response.text();
         else {
            response.text().then(console.error);
            throw new Error("Some fetch error happened, check if session have valid session cookie");
         }
      })
}

parseLine.symbolRegex = RegExp("[^0-9.]");
parseLine.notNumberRegex = RegExp("[^0-9]");

function parseLine(line, prevLine, nextLine) {
   let symbolPresent = false;
   let currentVal = "";
   let currentValValid = false;
   let lineSum = 0;
   for (let i = 0; i < line.length; i++) {
      let regex = parseLine.symbolRegex;
      let notNumberRegex = parseLine.notNumberRegex;
      let char = line[i];
      let prevI = Math.max(i - 1, 0);
      if (char < 10) {
         if (!currentValValid) {
            let thisChars = line.slice(prevI, i + 2).search(regex);
            let topChars = (prevLine === undefined ? -1 : prevLine.slice(prevI, i + 2).search(regex));
            let botChars = (nextLine === undefined ? -1 : nextLine.slice(prevI, i + 2).search(regex));
            symbolPresent = thisChars >= 0 || topChars >= 0 || botChars >= 0;
         }
         if (symbolPresent) currentValValid = true;
         currentVal += char;
      }
      if ((char.search(notNumberRegex) >= 0 || i === line.length - 1) && currentVal !== "") {
         if (currentValValid) lineSum += parseInt(currentVal);
         currentVal = "";
         currentValValid = false;
         symbolPresent = false;
      }
   }
   return lineSum;
}

async function init() {
   let text = await getDataAsText();

   let lines = parseText(text);
   let sum = 0;
   for (let i = 0; i < lines.length; i++) {
      sum += parseLine(lines[i], lines[i - 1], lines[i + 1]);
   }
   console.log(`Sum of valid numbers = ${sum}`);
}

init();