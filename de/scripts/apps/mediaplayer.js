// mediaplayer.js
import { createWindow } from '../lib/windowManager.js';

function launchMediaPlayer() {
    let contentArea = createWindow("Media Player", '700px', '500px');

    contentArea.innerHTML = "Now playing sample.mp4";

    const YayButton = document.createElement("button");
    YayButton.innerHTML = "Select a file";
    YayButton.style.marginLeft = "5px";
    YayButton.onclick = function () {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'video/*';
        fileInput.onchange = function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    source.src = e.target.result;
                    video.load();
                    video.loop = true;
                    video.play();
                    contentArea.innerHTML = `Now playing ${file.name}`;
                    contentArea.appendChild(YayButton);
                    contentArea.appendChild(video);
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    };
    contentArea.appendChild(YayButton);

    const video = document.createElement('video');
    video.style.marginTop = "10px";
    video.style.width = '100%';
    video.style.height = '90%';
    video.controls = true;
    video.loop = true;
    const source = document.createElement('source');
    source.src = './assets/sample.mp4';
    source.type = 'video/mp4';

    video.appendChild(source);

    contentArea.appendChild(video);
}

export { launchMediaPlayer };