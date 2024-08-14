document.getElementById('videoUrl').addEventListener('input', function() {
    const url = this.value;
    if (url) {
        fetch(`https://noembed.com/embed?url=${url}`)
            .then(response => response.json())
            .then(data => {
                const thumbnail = data.thumbnail_url;
                const thumbnailElement = document.getElementById('videoThumbnail');
                if (thumbnail) {
                    thumbnailElement.src = thumbnail;
                    thumbnailElement.style.display = 'block';
                }
            });
    }
});

document.getElementById('downloadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const videoUrl = document.getElementById('videoUrl').value;
    const quality = document.getElementById('quality').value;

    fetch('/api/videos/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: videoUrl, quality: quality })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to download video');
        }
        return response.blob();
    })
    .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'video.mp4';
        link.click();
    })
    .catch(error => console.error('Error:', error));
});
