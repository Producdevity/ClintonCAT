import DOMHelper from './DOMHelper';

DOMHelper.registerMessageListener();

void chrome.runtime.sendMessage({
    domain: window.location.hostname,
    url: window.location.href,
});
