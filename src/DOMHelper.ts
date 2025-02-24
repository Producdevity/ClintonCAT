import { IContentScanMessage, IElementData } from './ContentScanner';

export interface IDOMHelperInterface {
    querySelectorAll(selector: string): Promise<IElementData[]>;
    querySelector(selector: string): Promise<IElementData | undefined | null>;
    querySelectorByParentId(id: string, selector: string): Promise<IElementData | undefined | null>;
    querySelectorAllAsText(selector: string): Promise<string>;
    createElement(parentId: string, element: string, html: string): Promise<void>;
}

export enum DOMHelperMessageType {
    DOM_QUERY_SELECTOR_ALL = 'DOM_QUERY_SELECTOR_ALL',
    DOM_QUERY_SELECTOR_ALL_AS_TEXT = 'DOM_QUERY_SELECTOR_ALL_AS_TEXT',
    DOM_QUERY_SELECTOR = 'DOM_QUERY_SELECTOR',
    DOM_QUERY_SELECTOR_BY_PARENT_ID = 'DOM_QUERY_SELECTOR_BY_PARENT_ID',
    DOM_CREATE_ELEMENT = 'DOM_CREATE_ELEMENT',
}

class DOMHelper implements IDOMHelperInterface {
    public async querySelectorAll(selector: string): Promise<IElementData[]> {
        console.log('querySelectorAll: ', selector);
        return (await this.sendMessageToCurrentTab({
            action: DOMHelperMessageType.DOM_QUERY_SELECTOR_ALL,
            selector: selector,
        })) as IElementData[];
    }

    // TODO: fix case when using id, e.g. '#product1 .h2' becomes ''# .h2' in the browser
    public async querySelector(selector: string): Promise<IElementData | null> {
        console.log('querySelector: ', selector);
        return (await this.sendMessageToCurrentTab({
            action: DOMHelperMessageType.DOM_QUERY_SELECTOR,
            selector: selector,
        })) as IElementData;
    }

    public async querySelectorByParentId(id: string, selector: string): Promise<IElementData | undefined | null> {
        console.log('querySelectorById: ', id, selector);
        return (await this.sendMessageToCurrentTab({
            action: DOMHelperMessageType.DOM_QUERY_SELECTOR_BY_PARENT_ID,
            id: id,
            selector: selector,
        })) as IElementData;
    }

    public async querySelectorAllAsText(selector: string): Promise<string> {
        console.log('querySelectorAll (as text): ', selector);
        return (await this.sendMessageToCurrentTab({
            action: DOMHelperMessageType.DOM_QUERY_SELECTOR_ALL_AS_TEXT,
            selector: selector,
        })) as string;
    }

    public async createElement(parentId: string, element: string, html: string): Promise<void> {
        console.log('createElement (id, element, html): ', parentId, element, html);
        await this.sendMessageToCurrentTab({
            action: DOMHelperMessageType.DOM_CREATE_ELEMENT,
            id: parentId,
            element: element,
            html: html,
        });
    }

    // TODO: createElementWithChildSelector ?
    // public async createElementWithChildSelector(
    //     parentId: string,
    //     selector: string,
    //     newElement: string,
    //     html: string
    // ): Promise<void> {}

    // TODO: Exwcute JS?
    // see: https://developer.chrome.com/docs/extensions/reference/api/scripting
    // see:https://stackoverflow.com/questions/69348933/execute-javascript-in-a-new-tab-using-chrome-extension
    // see: https://developer.chrome.com/docs/extensions/reference/api/scripting

    // public async executeJSHelper() {
    //     const getTabId = () => {
    //         return this.getCurrentTab();
    //     };
    //     function getUserColor() {
    //         return 'green';
    //     }
    //     function changeBackgroundColor(backgroundColor: string) {
    //         document.body.style.backgroundColor = backgroundColor;
    //     }
    //
    //     chrome.scripting
    //         .executeScript({
    //             target: { xtabId: getTabId() },
    //             func: changeBackgroundColor,
    //             args: [getUserColor()],
    //             world: 'MAIN',
    //         })
    //         .then(() => console.log('injected a function'));
    // }

    // ---

    private async sendMessageToCurrentTab(message: IContentScanMessage): Promise<unknown> {
        const tab = await this.getCurrentTab();

        if (!tab?.id) {
            throw new Error('No active tab found');
        }

        return new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tab.id ?? -1, message, (response) => {
                if (chrome.runtime.lastError instanceof Error) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });
    }

    private async getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
        return new Promise((resolve) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                resolve(tabs[0]);
            });
        });
    }

    private static elementDataFromNode(element: HTMLElement | null | undefined): IElementData | undefined {
        if (!element) {
            return undefined;
        } else {
            return {
                tag: element.tagName,
                id: element.id,
                className: element.className,
                innerText: element.innerText,
            } as IElementData;
        }
    }

    private static elementDataFromNodes(nodes: NodeListOf<HTMLElement>): (IElementData | undefined | null)[] {
        return Array.from(nodes).map((node) => DOMHelper.elementDataFromNode(node));
    }

    public static registerMessageListener() {
        chrome.runtime.onMessage.addListener((message: IContentScanMessage, _sender, sendResponse) => {
            switch (message.action) {
                case DOMHelperMessageType.DOM_QUERY_SELECTOR_ALL: {
                    if (!message.selector) {
                        throw new Error(`DOM_QUERY_SELECTOR_ALL requires a selector`);
                    }
                    const nodes: NodeListOf<HTMLElement> = document.querySelectorAll(message.selector);
                    const elementData = DOMHelper.elementDataFromNodes(nodes);
                    // It doesn't seem possible to send a NodeList (as-is, cloned or deep copied) via `sendResponse`
                    sendResponse(elementData);
                    break;
                }

                case DOMHelperMessageType.DOM_QUERY_SELECTOR: {
                    if (!message.selector) {
                        throw new Error(`DOM_QUERY_SELECTOR requires a selector`);
                    }
                    const element: HTMLElement | null = document.querySelector(message.selector);
                    sendResponse(DOMHelper.elementDataFromNode(element));
                    break;
                }

                case DOMHelperMessageType.DOM_QUERY_SELECTOR_BY_PARENT_ID: {
                    if (!message.selector) {
                        throw new Error(`DOM_QUERY_SELECTOR_BY_PARENT_ID requires a selector`);
                    }
                    if (!message.id) {
                        throw new Error(`DOM_QUERY_SELECTOR_BY_PARENT_ID requires an id`);
                    }
                    const parent = document.getElementById(message.id);
                    const element: HTMLElement | null | undefined = parent?.querySelector(message.selector);
                    sendResponse(DOMHelper.elementDataFromNode(element));
                    break;
                }

                case DOMHelperMessageType.DOM_QUERY_SELECTOR_ALL_AS_TEXT: {
                    if (!message.selector) {
                        throw new Error(`DOM_QUERY_SELECTOR_ALL_AS_TEXT requires a selector`);
                    }
                    const nodes: NodeListOf<HTMLElement> = document.querySelectorAll(message.selector);
                    const text = Array.from(nodes)
                        .map((node) => (node.textContent ?? '') + node.innerText)
                        .join('\n');
                    sendResponse(text);
                    break;
                }

                case DOMHelperMessageType.DOM_CREATE_ELEMENT: {
                    if (!message.id) {
                        throw new Error(`DOM_CREATE_ELEMENT requires an id`);
                    }
                    if (!message.element) {
                        throw new Error(`DOM_CREATE_ELEMENT requires an element`);
                    }
                    if (!message.html) {
                        throw new Error(`DOM_CREATE_ELEMENT requires html`);
                    }
                    const parent = document.getElementById(message.id);
                    if (parent) {
                        const newElement = document.createElement(message.element);
                        console.log('DOM_CREATE_ELEMENT html: ', message.html);

                        newElement.innerHTML = message.html ?? '';
                        try {
                            parent.appendChild(newElement);
                        } catch (error) {
                            console.log('DOM_CREATE_ELEMENT failed ', error);
                        }
                    }

                    break;
                }

                default:
                    break;
            }
        });
    }
}

export default DOMHelper;
