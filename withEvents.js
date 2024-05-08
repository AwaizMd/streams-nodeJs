const fs = require("fs");

const readStream = fs.createReadStream("./data/import2.csv");

const writeStream = fs.createWriteStream("./data/export.csv");

readStream.on("data", (buffer) => {
  console.log("buffer: ", buffer);
  writeStream.write(buffer);
});

readStream.on("end", () => {
  console.log("Read Stream ended.");
  writeStream.end();
});
