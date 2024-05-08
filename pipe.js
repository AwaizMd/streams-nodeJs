const fs = require("fs");
const csv = require("csvtojson");
const { Transform } = require("stream");

const readStream = fs.createReadStream("./data/import2.csv");

const dataTransform = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    // Transform the data
    const user = {
      name: chunk.name,
      email: chunk.email.toLowerCase(),
      age: Number(chunk.age),
      salary: Number(chunk.salary),
      isActive: chunk.isActive.toLowerCase() === "true", // Convert to boolean
    };
    callback(null, user);
  },
});

const filterTransform = new Transform({
  objectMode: true,
  transform(user, encoding, callback) {
    // Filter based on 'isActive'
    if (!user.isActive || user.age > 20) {
      callback(); // Filter out the inactive users
      return;
    }
    
    callback(null, user);
  },
});

// note:- you should add error handling after each pipe to handle errors.
readStream
  .pipe(csv({ delimiter: ";" }, { objectMode: true })) // Parse CSV with the specified delimiter
  .on("error", (error) => {
    console.error("Error in stream:", error);
  })
  .pipe(dataTransform) // Transform the data
  .on("error", (error) => {
    console.error("Error in stream:", error);
  })
  .pipe(filterTransform) // Filter the data
  .on("error", (error) => {
    console.error("Error in stream:", error);
  })
  .on("data", (data) => {
    console.log("data:", data);
  })
  .on("error", (error) => {
    console.error("Error in stream:", error);
  })
  .on("end", () => {
    console.log("Stream ended.");
  });
