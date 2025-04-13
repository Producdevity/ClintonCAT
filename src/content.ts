import DOMMessenger from '@/content-scanners/helpers/dom-messenger';

DOMMessenger.registerMessageListener();

void chrome.runtime.sendMessage({
    domain: window.location.hostname,
    url: window.location.href,
});
