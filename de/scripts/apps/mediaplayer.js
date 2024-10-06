// mediaplayer.js
import { createWindow } from '../lib/windowManager.js';

function launchMediaPlayer() {
    // Create content area for the media player
    let contentArea = createWindow("Media Player", '700px', '500px');
    contentArea.innerHTML = "Now playing: sample.mp4";

    // Create "Select a file" button
    const selectFileButton = document.createElement("button");
    selectFileButton.textContent = "Select a file";
    selectFileButton.style.marginLeft = "10px";

    // Handle file selection on mouseup
    selectFileButton.addEventListener('mouseup', function () {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'video/*';

        fileInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    videoSource.src = e.target.result;
                    videoPlayer.load();
                    videoPlayer.loop = true;
                    videoPlayer.play();
                    contentArea.innerHTML = `Now playing: ${file.name}`;
                    contentArea.appendChild(selectFileButton);
                    contentArea.appendChild(videoPlayer);
                };
                reader.readAsDataURL(file);
            }
        });

        fileInput.click();
    });

    // Append the "Select a file" button to the content area
    contentArea.appendChild(selectFileButton);

    // Create the video player element
    const videoPlayer = document.createElement('video');
    videoPlayer.style.marginTop = "10px";
    videoPlayer.style.width = '100%';
    videoPlayer.style.height = '90%';
    videoPlayer.controls = true;
    videoPlayer.loop = true;

    // Create and configure the video source
    const videoSource = document.createElement('source');
    videoSource.src = './assets/sample.mp4'; // Default sample video
    videoSource.type = 'video/mp4';

    videoPlayer.appendChild(videoSource);

    // Append the video player to the content area
    contentArea.appendChild(videoPlayer);
}

export { launchMediaPlayer };