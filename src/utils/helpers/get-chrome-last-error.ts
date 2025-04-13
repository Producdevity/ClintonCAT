/**
 * Get the last error from the Chrome runtime.
 */
function getChromeLastError(): Error {
    return chrome.runtime.lastError instanceof Error ? chrome.runtime.lastError : new Error('Unknown error');
}

export default getChromeLastError;
