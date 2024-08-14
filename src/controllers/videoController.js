const { exec } = require('child_process');
const path = require('path');

exports.downloadVideo = (req, res) => {
    const videoUrl = req.body.url;
    const quality = req.body.quality;

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

    // Get the selected format based on the user's choice
    const selectedFormat = formatMapping[quality] || '';

    // Fetch video title using yt-dlp
    const getTitleCmd = `yt-dlp --get-title ${videoUrl}`;

    exec(getTitleCmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error fetching video title: ${error.message}`);
            return res.status(500).send('Error fetching video title');
        }

        const videoTitle = stdout.trim().replace(/[<>:"/\\|?*]+/g, ''); // Sanitize the filename

        // Specify the output file path using the fetched title
        const filePath = path.join(__dirname, '../../downloads', `${videoTitle}.mp4`);

        // Construct the yt-dlp command for downloading the video
        const downloadCmd = `yt-dlp ${selectedFormat ? `-f "${selectedFormat}"` : ''} -o "${filePath}" ${videoUrl}`;

        // Execute the command to download the video
        exec(downloadCmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error downloading video: ${error.message}`);
                return res.status(500).send('Error downloading video');
            }

            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }

            console.log('Video downloaded successfully');
            
            // Serve the downloaded file to the user
            res.download(filePath, `${videoTitle}.mp4`, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    return res.status(500).send('Error sending file');
                }

                console.log('Video successfully sent to user');
            });
        });
    });
};
