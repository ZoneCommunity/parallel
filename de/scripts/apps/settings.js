// settings.js\
import { createWindow } from '../lib/windowManager.js';

import { pm, vfs } from '../core.js';
import { unfocusAll, focusWindow, closeWindow, openWindows } from '../lib/windowManager.js'
import { launchSetup } from '../core.js';


function launchSettings() {
    let contentArea = createWindow("System Settings", '700px', '500px');
    contentArea.style.padding = "0";
    contentArea.style.width = "100%";
    contentArea.style.height = "calc(100% - 50px)";
    
    // Create layout with sidebar and content
    contentArea.innerHTML = `
        <div class="settings-container" style="display: flex; height: 100%;">
            <div class="sidebar" style="width: 200px; background-color:rgba(255, 255, 255, 0.4); border-right: 1px solid #ccc; border-top: 1px solid #ccc; padding: 20px 0; border-top-right-radius: 10px;">
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li class="menu-item" style="padding: 10px 20px; margin-bottom: 5px;" onclick="showSection('general')">General</li>
                    <li class="menu-item" style="padding: 10px 20px; margin-bottom: 5px;" onclick="showSection('appearance')">Appearance</li>
                    <li class="menu-item" style="padding: 10px 20px; margin-bottom: 5px;" onclick="showSection('system')">System</li>
                </ul>
            </div>
            <div class="content" style="flex: 1; padding: 20px;">
                <div id="general-section">
                    <h2>General Settings</h2>
                    <p>Configure general system settings here.</p>
                </div>
                <div id="appearance-section" style="display: none;">
                    <h2>Appearance Settings</h2>
                    <p>Customize the look and feel of your system.</p>
                </div>
                <div id="system-section" style="display: none;">
                    <h2>System Settings</h2>
                    <p>Adjust core system features, and access other utilities.</p>

                    <div style="margin-bottom: -20px; margin-top: -10px; padding: 10px 0;">
                        <h4>Reset parallel</h4>
                        <button style="margin-top: -10px;" id="reset-button">Reset</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    function closeAllWindows() {
        let windows = document.querySelectorAll(".window");
        if (windows) {
          let curZIndex = [];
          for (let i = 0; i < windows.length; i++) {
            closeWindow(windows[i]);
          }
        }
    }

    const resetButton = contentArea.querySelector('#reset-button');
    resetButton.addEventListener('mouseup', function () {
        vfs.reset(); 
        closeAllWindows();
        location.reload();
    });

    // Add function to toggle between sections
    window.showSection = function(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content > div').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show the selected section
        document.getElementById(sectionName + '-section').style.display = 'block';
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.style.backgroundColor = '';
            item.style.fontWeight = 'normal';
        });
        
        // Highlight the clicked menu item
        event.target.style.backgroundColor = 'rgba(0, 102, 255, 0.2)';
        event.target.style.fontWeight = '600';
    };
    
    // Set the first menu item as active by default
    const firstMenuItem = contentArea.querySelector('.menu-item');
    if (firstMenuItem) {
        firstMenuItem.style.backgroundColor = 'rgba(0, 102, 255, 0.2)';
        firstMenuItem.style.fontWeight = '600';
    }
}

export { launchSettings };