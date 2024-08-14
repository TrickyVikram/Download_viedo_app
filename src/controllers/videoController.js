const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.downloadVideo = (req, res) => {
    const videoUrl = req.body.url;
    if (!videoUrl) {
        return res.status(400).send('URL is required');
    }

    const filePath = path.join(__dirname, '../downloads', 'video.mp4');
    const tempFilePath = path.join(__dirname, '../downloads', 'temp.mp4');

    const ytDlpProcess = spawn('yt-dlp', ['-o', tempFilePath, videoUrl]);

    ytDlpProcess.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
        // You can parse progress information from stderr if yt-dlp provides it
    });

    ytDlpProcess.on('close', (code) => {
        if (code === 0) {
            fs.rename(tempFilePath, filePath, (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                    return res.status(500).send('Error processing video');
                }

                res.download(filePath, 'video.mp4', (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                        return res.status(500).send('Error sending file');
                    }

                    console.log('Video successfully downloaded');
                });
            });
        } else {
            console.error('Error downloading video');
            res.status(500).send('Error downloading video');
        }
    });
};
