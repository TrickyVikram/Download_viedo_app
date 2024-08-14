const { exec } = require('child_process');
const path = require('path');

exports.downloadVideo = (req, res) => {
    const videoUrl = req.body.url;
    const quality = req.body.quality || 'best';

    if (!videoUrl) {
        return res.status(400).send('URL is required');
    }

    // Map the quality options to yt-dlp format codes
    const formatMapping = {
        '360p': '18', // Small
        '720p': '22', // HD
        '1080p': '137+140', // Full HD (video + audio)
        '1440p': '271+140' // Quad HD (video + audio)
    };

    // Determine the format to use, defaulting to 'best' if not specified
    const selectedFormat = formatMapping[quality] || 'best';

    // Specify the output file path
    const filePath = path.join(__dirname, '../../downloads', 'video.mp4');

    // Construct the yt-dlp command with the selected format and URL
    const cmd = `yt-dlp -f "${selectedFormat}" -o "${filePath}" ${videoUrl}`;

    // Execute the command
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Error downloading video');
        }

        if (stderr) {
            console.error(`Stderr: ${stderr}`);
        }

        console.log('Video downloaded successfully');
        
        // Serve the downloaded file to the user
        res.download(filePath, 'video.mp4', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                return res.status(500).send('Error sending file');
            }

            console.log('Video successfully sent to user');
        });
    });
};
