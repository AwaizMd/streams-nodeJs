const fs = require("fs");

const readStream = fs.createReadStream("./import2.csv");

const writeStream = fs.createWriteStream("./export.csv");

readStream.on("data", (buffer) => {
  console.log("buffer: ", buffer);
  writeStream.write(buffer);
});

readStream.on("end", () => {
  console.log("Read Stream ended.");
  writeStream.end();
});
