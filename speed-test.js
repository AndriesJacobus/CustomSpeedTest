const NetworkSpeed = require('network-speed');  // ES5
const testNetworkSpeed = new NetworkSpeed();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Now create new writer to csv
const csvWriter = createCsvWriter({
    path: 'speed-test-log.csv',
    append: true,
    header: [
        {id: 'date', title: 'DATE'},
        {id: 'downloadSpeed', title: 'DOWNLOAD'},
        {id: 'uploadSpeed', title: 'UPLOAD'},
    ]
});

const speedTestInterval = 5 * 1000; // x * 1000 where x is desired seconds
let currentAverageDownloadSpeed = 0;
let currentAverageUploadSpeed = 0;

async function getNetworkDownloadSpeed() {
  console.log("Getting network download speed...");

  const baseUrl = 'http://127.0.0.1:3000/check_download_speed';
  const fileSizeInBytes = 10000000;
  const speed = await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSizeInBytes);

  console.log("Network download speed: ", speed);
  return speed;
}

async function getNetworkUploadSpeed() {
    console.log("Getting network upload speed...");

    const fileSizeInBytes = 10000100;
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/check_upload_speed',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': fileSizeInBytes,
        },
    };
    const speed = await testNetworkSpeed.checkUploadSpeed(options, fileSizeInBytes);

    console.log("Network upload speed: ", speed);
    return speed;
}

async function getSpeed() {
    const downSpeed = await getNetworkDownloadSpeed();
    const upSpeed = await getNetworkUploadSpeed();

    const records = [
        // ...csvResult,
        {date: new Date(new Date().toLocaleString('en', {timeZone: 'Africa/Johannesburg'})).toString(), downloadSpeed: downSpeed.mbps + " mbps", uploadSpeed: upSpeed.mbps + " mbps"},
    ];
    
    console.log('Speed tested: ', records[0]);
    csvWriter.writeRecords(records)
    .then(() => {
        console.log('Test speed save to log file.');
    });

    // Set averages
    if (currentAverageDownloadSpeed == 0) {
        // First time
        currentAverageDownloadSpeed = parseFloat(downSpeed.mbps);
    }
    else {
        currentAverageDownloadSpeed = (currentAverageDownloadSpeed + parseFloat(downSpeed.mbps)) / 2;
    }

    // Set averages
    if (currentAverageUploadSpeed == 0) {
        // First time
        currentAverageUploadSpeed = parseFloat(upSpeed.mbps);
    }
    else {
        currentAverageUploadSpeed = (currentAverageUploadSpeed + parseFloat(upSpeed.mbps)) / 2;
    }

    console.log("\nCurrent Averages - Download: " + currentAverageDownloadSpeed.toFixed(2) + " mbps, Upload: " + currentAverageUploadSpeed.toFixed(2) + " mbps.");
}

// Run speed checker periodically
setInterval(getSpeed, speedTestInterval);