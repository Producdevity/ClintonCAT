import { IMainMessage, Main } from './main';

const main = new Main();

chrome.runtime.onInstalled.addListener(() => {
    main.onBrowserExtensionInstalled();
});

chrome.runtime.onMessage.addListener(
    (message: IMainMessage, sender: chrome.runtime.MessageSender, sendResponse: VoidFunction) => {
        main.onBrowserExtensionMessage(message, sender, sendResponse);
    }
);
