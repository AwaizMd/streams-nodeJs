# Streams in Node.js

Node.js provides a built-in fs module that allows you to read and write files on your local file system. When dealing with large files, using streams in Node.js can be a more efficient way to access and manipulate the data than reading the entire file into memory at once.

In Node.js, streams allow you to handle reading and writing data continuously and efficiently. Streams are collections of data that might not be available all at once but rather in small chunks or pieces. Rather than waiting for all the data to be available, streams allow us to work with it as soon as it becomes available and to process it incrementally.

## Node.js provides four types of streams:

**Readable Streams:** Readable streams are used for reading data from a source, such as a file or network socket. They emit a "data" event when new data is available, and an "end" event when there is no more data to be read.

```javascript

const readStream = fs.createReadStream("./data/import.csv");
/* 
`.on('data', callback): This event is triggered whenever there is a chunk of data available to be read from the stream. The callback function receives the data chunk as its argument.
*/
readStream.on('data', (chunk) => {
    console.log(`Received chunk: ${chunk}`);
});

/* 
.on('end', callback): This event is triggered when the stream has reached the end of the file and there is no more data to be read.
*/
readStream.on('end', () => {
    console.log('Stream ended');
});

/* 
.on('error', callback): This event is triggered if there is an error while reading the file or during the stream's operation.
*/
readStream.on('error', (error) => {
    console.error(`Error: ${error.message}`);
}); 
/* .pause() .resume() and .destroy(): These methods can be used to control the flow of data in the stream. pause() stops the stream from emitting data events, while resume() resumes the flow of data and destroy() forcibly closes the stream when you wanna close it like in case of errors. */

readStream.pause();
// Do something while the stream is paused
readStream.resume();
readStream.destroy();

```

**Writable Streams:** Writable streams are used for writing data to a destination, such as a file or network socket. They have a "write" method for writing data and an "end" method to signal the end of the data.


``` javascript

const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Hello, world!\n');
writeStream.write('Another line of text.\n');

// .write(chunk, [encoding], [callback]): This method is used to write data to the stream. The chunk parameter is the data you want to write, and encoding specifies the encoding of the chunk (default is 'utf8'). You can also provide an optional callback function to execute once the write operation is complete.

writeStream.write('Hello, world!\n');
writeStream.write('Another line of text.\n');

// .end([chunk], [encoding], [callback]): This method is used to signal the end of the writable stream and optionally write a final chunk of data before closing the stream. Once you call end(), the stream will emit a finish event once all data has been flushed.

writeStream.end('Final line of text.', 'utf8', () => {
    console.log('Stream finished.');
});

// .on('finish', callback): This event is triggered when all data has been flushed to the stream, and the stream has been closed. The callback function is executed when the finish event is emitted.

writeStream.on('finish', () => {
    console.log('Stream has finished writing.');
});

// .on('error', callback): This event is triggered if there is an error during the stream's operation. The callback function receives the error as its argument.

writeStream.on('error', (error) => {
    console.error(`Error: ${error.message}`);
});

// .cork() and .uncork(): These methods are used to buffer writes. When you call cork(), it prevents data from being written immediately and buffers it instead. Calling uncork() will flush the buffered data to the stream.


writeStream.cork();
writeStream.write('Buffered data');
writeStream.uncork(); // Flushes the buffer and writes the data

// .destroy([error]): This method forcibly closes the writable stream, optionally providing an error as an argument. It can be used to handle errors or release resources.

writeStream.destroy(new Error('An error occurred.'));


```

**Duplex Streams:** Duplex streams are used for bidirectional communication, where data can be both read and written. They combine the functionality of both readable and writable streams.

``` javascript

const { Duplex } = require('stream');

class MyDuplexStream extends Duplex {
    constructor(options) {
        super(options);
    }

    _read(size) {
        // Implement the logic to read data and push it to the stream
        this.push('data');
    }

    _write(chunk, encoding, callback) {
        // Implement the logic to handle the written data
        console.log(`Received data: ${chunk}`);
        callback();
    }
}

const myDuplexStream = new MyDuplexStream();
```

*The _read method is responsible for reading data from the source and pushing it to the stream, while the _write method handles data written to the stream.*

### Common Methods and Events
```javascript

// .pipe(destinationStream): This method is used to pipe data from the duplex stream to another writable stream (such as a file or network stream). It simplifies data flow and is commonly used in networking applications.

myDuplexStream.pipe(writeStream);

1. .unpipe(destinationStream): This method is used to remove a pipe connection between the duplex stream and a writable stream.

myDuplexStream.unpipe(writeStream);

2. .end([chunk], [encoding], [callback]): This method is used to signal the end of the writable part of the duplex stream and optionally write a final chunk of data before closing the stream.

3. .on('data', callback): This event is triggered whenever there is a chunk of data available to be read from the stream. The callback function receives the data chunk as its argument.

4. .on('finish', callback): This event is triggered when all data has been flushed to the writable part of the stream, and the stream has been closed.

5. .on('error', callback): This event is triggered if there is an error during the operation of the stream. The callback function receives the error as its argument.


```
### Usage Examples

**Duplex streams are useful in various scenarios, including:**

**Network Connections:** For example, a TCP connection can be represented as a duplex stream because data can be read from and written to the connection simultaneously.

**Transformations:** You can use duplex streams to perform data transformations, such as compressing data before sending it to a writable stream or decompressing data before sending it to a readable stream.

By implementing the stream.Duplex class and handling the _read and _write methods, you can create custom duplex streams for a variety of use cases in Node.js.


# **Transform Streams:** 
 Transform streams are a special type of duplex stream that can modify or transform the data as it passes through. They are often used for data processing, such as compression or encryption.

```javascript

const { Transform } = require('stream');

class MyTransformStream extends Transform {
    constructor(options) {
        super(options);
    }

    _transform(chunk, encoding, callback) {
        // Transform the chunk of data
        const transformedData = chunk.toString().toUpperCase();

        // Push the transformed data to the writable side of the stream
        this.push(transformedData);

        // Call the callback function when done
        callback();
    }

}

const myTransformStream = new MyTransformStream();

    // In the _transform method, you receive a chunk of data and an encoding (if the data is a string). You can perform your desired transformations on the data and then push the transformed data to the writable side of the stream using the this.push() method. Finally, you call the provided callback function to indicate that you have completed processing the current chunk.

```

### Common Methods and Events

1. .end([chunk], [encoding], [callback]): This method is used to signal the end of the writable part of the stream and optionally write a final chunk of data before closing the stream.

2. .on('data', callback): This event is triggered whenever there is a chunk of data available to be read from the stream. The callback function receives the data chunk as its argument.

3. .on('finish', callback): This event is triggered when all data has been flushed to the writable side of the stream, and the stream has been closed.

4. .on('error', callback): This event is triggered if there is an error during the operation of the stream. The callback function receives the error as its argument.


### Usage Examples
*** Transform streams can be used in a variety of scenarios, including: ***

1. Data Compression/Decompression: For example, you can use zlib.createGzip() and zlib.createGunzip() to create transform streams that compress and decompress data, respectively.

2. Data Encryption/Decryption: You can use transform streams with modules like crypto to encrypt or decrypt data as it flows through the stream.

3. Data Conversion: Transform streams can be used to convert data from one format to another, such as converting CSV data to JSON.

```javascript

const fs = require('fs');
const myTransformStream = new MyTransformStream();

const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(myTransformStream).pipe(writeStream);

//in this example, data from input.txt is read through the readable stream, transformed using myTransformStream, and written to output.txt through the writable stream. This is a common pattern for using transform streams to manipulate data as it flows through a stream pipeline.
```


*Streams in Node.js are designed to be memory-efficient and to handle large amounts of data effectively. They use buffer and pipe mechanisms to manage the flow of data between different streams and to avoid overloading memory.*
