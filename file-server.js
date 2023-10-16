// Load the necessary modules and define a port
const app = require('express')();
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;

// Route to check if server's up
app.get('/', (req, res) => {
    console.log('GET request to /');
    res.status(200).send(`Server up and running`);
});

app.get('/check_download_speed', (req, res) => {
    console.log('POST request to /check_download_speed');
    
    const file = `${__dirname}/image.jpg`;
    res.download(file);
});

const uploadFile = (req, filePath) => {
    return new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(filePath);

        stream.on('open', () => {
            console.log('Stream opened');
            req.pipe(stream);
        });

        // stream.on('drain', () => {
        //     const written = parseInt(stream.bytesWritten);
        //     const total = parseInt(req.headers['content-length']);
        //     const pWritten = ((written / total) * 100).toFixed(2);
        //     console.log(`Processing  ...  ${pWritten}% done`);
        // });

        stream.on('close', () => {
            console.log('Stream processing done');
            resolve(filePath);
        });

        stream.on('error', err => {
            console.error(err);
            reject(err);
        });
    });
};

// Add a route to accept incoming post requests for the fileupload.
// Also, attach two callback functions to handle the response.
app.post('/check_upload_speed', (req, res) => {
    console.log('POST request to /check_upload_speed');
    const filePath = path.join(__dirname, `/up_image.jpg`);
    uploadFile(req, filePath)
    .then(path => res.send({ status: 'success', path }))
    .catch(err => res.send({ status: 'error', err }));
});

// Mount the app to a port
app.listen(port, () => {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});
