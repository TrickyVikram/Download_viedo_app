document.getElementById('downloadForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const videoUrl = document.getElementById('videoUrl').value;
    const progressBar = document.getElementById('progressBar');
    const messageDiv = document.getElementById('message');

    fetch('/api/videos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl }),
    })
    .then(response => {
        if (response.ok) {
            const reader = response.body.getReader();
            const contentLength = +response.headers.get('Content-Length');

            let receivedLength = 0;
            let chunks = [];

            reader.read().then(function processText({ done, value }) {
                if (done) {
                    // Combine chunks and process the file
                    const blob = new Blob(chunks);
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'video.mp4';
                    a.click();
                    URL.revokeObjectURL(url);
                    messageDiv.textContent = 'Download complete!';
                    return;
                }

                receivedLength += value.length;
                chunks.push(value);

                // Update progress bar
                const progress = (receivedLength / contentLength) * 100;
                progressBar.style.width = `${progress}%`;
                progressBar.textContent = `${Math.round(progress)}%`;

                return reader.read().then(processText);
            });
        } else {
            messageDiv.textContent = 'Error downloading video';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        messageDiv.textContent = 'Error downloading video';
    });
});
