const Util = require("./util");
const MP3Cutter = require("./cutter");
const fs = require("fs");

let arg = process.argv[2];
if (arg == "-v") {
  return console.log(`v${Util.getVersion()}`);
}

const params = {
  src: null,
  out: null,
};

for (let i = 2; i < process.argv.length; i++) {
  let arg = (process.argv[i] || "").replace(/-/g, "");
  if (typeof params[arg] !== "undefined") {
    params[arg] = process.argv[i + 1];
  }
}

try {
  if (!params.src) {
    throw "Invalid source.";
  }

  if (!params.out) {
    throw "Invalid target.";
  }

  // load the audio file
  const rawsrc = fs.readFileSync(params.src);
  const srcjson = JSON.parse(rawsrc);
  const mp3FilePath = params.src.replace(".json", ".mp3");
  const name = params.src.split("/").pop().split(".")[0];

  fs.mkdirSync(`${params.out}/${name}`, { recursive: true });

  const spritejson = srcjson.sprite;
  for (const key in spritejson) {
    if (Object.hasOwnProperty.call(spritejson, key)) {
      const element = spritejson[key];

      MP3Cutter.cut({
        src: mp3FilePath,
        target: `${params.out}/${name}/${key}.mp3`,
        start: element[0] * 0.001,
        end: (element[0] + element[1]) * 0.001,
      });
    }
  }
} catch (err) {
  console.error(`\x1b[31m${err}\x1b[0m`);
  process.exit(-1);
}
