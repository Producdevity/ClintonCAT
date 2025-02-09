import Preferences from './Preferences';
import { StorageCache } from './storagecache';
import { DomainTools } from './domaintools';
import { ContentScanner } from './contentscanner';
import ChromeSyncStorage from './storage/ChromeSyncStorage';
import PagesDB from './database/PagesDB';
import CATWikiPageSearchResults from './database/CATWikiPageSearchResults';

export interface IMainMessage {
    badgeText: string;
    domain: string;
    url: string;
}

export class Main {
    storageCache: StorageCache;
    pagesDatabase: PagesDB;
    domainTools: DomainTools;
    contentScanner: ContentScanner;

    constructor() {
        // TODO: need a ChromeLocalStorage for pages db
        Preferences.setBackingStores(new ChromeSyncStorage(), new ChromeSyncStorage());
        this.pagesDatabase = new PagesDB();
        this.storageCache = new StorageCache(this.pagesDatabase);
        this.domainTools = new DomainTools();
        this.contentScanner = new ContentScanner();
    }

    indicateStatus() {
        void chrome.action.setBadgeText({
            text: Preferences.isEnabled.value ? 'on' : 'off',
        });
    }

    /**
     * Display how many pages were found by updating the badge text
     */
    indicateCATPages(pages: CATWikiPageSearchResults): void {
        // Update badge text with total pages found
        void chrome.action.setBadgeText({ text: pages.totalPagesFound.toString() });
        console.log(pages);

        // Example: show a notification about the found pages
        // NOTE: Requires "notifications" permission in your manifest.json
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon48.png', // TODO: Use a proper icon
            title: 'CAT Pages Found',
            message: `Found ${pages.totalPagesFound.toString()} page(s).`,
        });
    }

    /**
     * Called when the extension wants to change the action badge text manually.
     */
    onBadgeTextUpdate(text: string): void {
        void chrome.action.setBadgeText({ text: text });
    }

    checkDomainIsExcluded(domain: string): boolean {
        return this.domainTools.isDomainExcluded(Preferences.domainExclusions.value, domain);
    }

    /**
     * Called when a page (tab) has finished loading.
     * Scans the domain and in-page contents, merges results,
     * and indicates how many CAT pages were found.
     */
    async onPageLoaded(domain: string, url: string): Promise<void> {
        const mainDomain = this.domainTools.extractMainDomain(domain);
        console.log('Main domain:', mainDomain);

        if (this.checkDomainIsExcluded(mainDomain)) {
            console.log('Excluded domain:', mainDomain);
            return;
        }

        // Fetch existing domain results (if any) from the PagesDB
        const domainResults = this.pagesDatabase.getPagesForDomain(mainDomain);

        // Scan the current page’s content for new page entries
        const inPageResults = await this.contentScanner.checkPageContents(domain, mainDomain, url, this.pagesDatabase);

        // Merge any newly found page entries
        domainResults.addPageEntries(inPageResults.pageEntries);

        this.indicateCATPages(domainResults);
    }

    /**
     * Called when the extension is installed.
     * Initializes default settings and indicates current status.
     */
    onBrowserExtensionInstalled(): void {
        console.log('ClintonCAT Extension Installed');
        Preferences.initDefaults().then(() => {
            Preferences.dump();
            this.indicateStatus();
        });
    }

    /**
     * Called when we receive a message from elsewhere in the extension
     * (e.g., content script or popup).
     */
    onBrowserExtensionMessage(
        message: IMainMessage,
        _sender: chrome.runtime.MessageSender,
        _sendResponse: VoidFunction
    ): void {
        void (async () => {
            await Preferences.refresh();
            Preferences.dump();

            if (message.badgeText) {
                this.onBadgeTextUpdate(message.badgeText);
            } else if (!Preferences.isEnabled.value) {
                this.indicateStatus();
            } else if (message.domain) {
                await this.onPageLoaded(message.domain, message.url);
            }
        })();
    }
}
