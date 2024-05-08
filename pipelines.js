const fs = require("fs");
const csv = require("csvtojson");
const { Transform, pipeline } = require("stream");

const readStream = fs.createReadStream("./import2.csv");

const dataTransform = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    // Convert each chunk to a user object with the specified properties
    const user = {
      name: chunk?.name,
      email: chunk?.email?.toLowerCase(),
      age: Number(chunk?.age),
      salary: Number(chunk?.salary),
      isActive: chunk?.isActive === "true" ,
    };
    callback(null, user);
  },
});

const filterTransform = new Transform({
  objectMode: true,
  transform(user, encoding, callback) {
    // Filter users based on isActive and age criteria
    if (!user.isActive || user.age > 20) {
      callback(null); // Filter out inactive users or those over age 20
      return;
    }
    console.log("User:", user);
    callback(null, user);
  },
});

// Define the pipeline
pipeline(
  readStream, // Read CSV file as input
  csv({ delimiter: ";" }, { objectMode: true }), // Convert CSV to JSON with semicolon delimiter
  dataTransform, // Transform the data
  filterTransform, // Filter the data
  (err) => {
    // Callback function for pipeline completion and error handling
    if (err) {
      console.error("Error in stream pipeline:", err);
    } else {
      console.log("Pipeline completed successfully.");
    }
  }
);
