let day = 11;

//let session = `*YOUR COOKIE LOGIN SESSION AT https://adventofcode.com/2023/day/${day}/input*`;

class Connection {
   static connectID = 0;
   static connects = [];

   constructor(from, to) {
      this.ID = Connection.connectID++;
      this.to = to;
      this.from = from;
      this.length = 0;
      this.calcLength();
      Connection.connects.push(this);
   }

   calcLength() {
      let to = this.to;
      let from = this.from;
      let deltaX = Math.abs(to.x - from.x);
      let deltaY = Math.abs(to.y - from.y);
      this.length = deltaX + deltaY;
   }

   toString() {
      return `Conn #${this.ID} from ${this.from.ID + 1} to ${this.to.ID + 1}. Length = ${this.length}\n`
   }
}

class Galaxy {
   static galaxies = [];
   static GalaxyID = 0;
   static sumLength = 0;

   constructor(x, y) {
      this.ID = Galaxy.GalaxyID++;
      this.x = x;
      this.y = y;
      this.connects = [];
      this.connectsSumLength = 0;
   }

   static init() {
      Galaxy.galaxies = [];
      Galaxy.GalaxyID = 0;
      Galaxy.sumLength = 0;
      Connection.connects = [];
      Connection.connectID = 0;
   }

   static connectGalaxies() {
      let galaxies = Galaxy.galaxies;
      for (const galaxy of galaxies) {
         galaxy.fillConnects();
         Galaxy.sumLength += galaxy.connectsSumLength;
      }
      Galaxy.sumLength /= 2;
   }

   fillConnects() {
      for (let i = this.ID + 1; i < Galaxy.galaxies.length; i++) {
         let galaxy = Galaxy.galaxies[i];
         let connect = new Connection(this, galaxy);

         this.connects.push(connect);
         galaxy.connects.push(connect);

         this.connectsSumLength += connect.length;
         galaxy.connectsSumLength += connect.length;
      }
   }

   toString() {
      return `Galaxy ${this.ID + 1} at (${this.x}, ${this.y})\n` +
             `  Connections summary length = ${this.connectsSumLength}\n` +
             `  Connections:\n` +
             `    ${this.connects.map(connect => connect.toString()).join('    ')}`
   }
}

function parseText(text) {
   let lines = text.split("\n");
   if (lines.at(-1).length === 0) lines.pop();
   return lines;
}

function parseLine(line) {
   let empty = true;
   for (let i = 0; i < line.length; i++) {
      let char = line[i];
      if (char === '#') {
         emptyCols[i] = false;
         empty = false;
      }
   }
   if (empty) return -1;
   return 0;
}

function expandLine(line, lineIndex, expandSize, spawnGalaxies) {
   let offset = 0;
   for (let i = 0; i < line.length; i++) {
      let char = line[i];
      let colIsEmpty = emptyCols[i];

      if (colIsEmpty) offset += expandSize - 1;

      if (spawnGalaxies && char === '#') Galaxy.galaxies.push(new Galaxy(i + offset, lineIndex + offsetsY[lineIndex]));
   }
}

let offsetsY;

function expandGalaxy(lines, expandSize = 1) {
   emptyCols = new Array(lines[0].length).fill(true);
   offsetsY = new Array(lines.length).fill(0);
   let offsetY = 0;
   for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      let result = parseLine(line);
      offsetsY[i] = offsetY;
      if (result === -1) offsetY += expandSize - 1;
   }

   for (let i = 0; i < lines.length; i++) {
      expandLine(lines[i], i, expandSize, true);
   }

   Galaxy.connectGalaxies();
}

let emptyCols;

function solvePartOne(lines) {
   Galaxy.init();
   expandGalaxy(lines, 2);


   return Galaxy.sumLength;
}

function solvePartTwo(lines) {
   Galaxy.init();
   expandGalaxy(lines, 1000000);
   return Galaxy.sumLength;
}

function getDataAsText() {
   return fetch(`https://adventofcode.com/2023/day/${day}/input`, {
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
   console.log(
      `Sum of path length between galaxies on x2 expand = ${partOneSum}\n` +
      `Sum of path length between galaxies on x100000 expand = ${partTwoSum}`);
}

init();