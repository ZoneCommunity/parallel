// misc.js

function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "";
    let os = "Unknown";
    if (ua.indexOf("Win") != -1) os = "Windows";
    else if (ua.indexOf("Mac") != -1) os = "macOS";
    else if (ua.indexOf("Linux") != -1) os = "Linux";
    else if (ua.indexOf("Android") != -1) os = "Android";
    else if (ua.indexOf("like Mac") != -1) os = "iOS";
    if (ua.indexOf("Firefox") != -1) {
      browserName = "Firefox";
      browserVersion = ua.match(/Firefox\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf("Chrome") != -1) {
      browserName = "Chrome";
      browserVersion = ua.match(/Chrome\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf("Safari") != -1) {
      browserName = "Safari";
      browserVersion = ua.match(/Version\/(\d+\.\d+)/)[1];
    } else if (ua.indexOf("MSIE") != -1 || ua.indexOf("Trident/") != -1) {
      browserName = "Internet Explorer";
      browserVersion = ua.match(/(MSIE\s|rv:)(\d+\.\d+)/)[2];
    }
    return `${os} with ${browserName} ${browserVersion}`;
}

export { getBrowserInfo };
