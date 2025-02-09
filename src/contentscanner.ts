// The 'require.context' feature depends on WebPack (@types/webpack)
import CATWikiPageSearchResults from './database/CATWikiPageSearchResults';

const context: __WebpackModuleApi.RequireContext = require.context('./contentscanners', true, /\.ts$/, 'sync');
import { DefaultScanner } from './contentscanners/default';
import { IDOMHelperInterface, DOMHelper, DOMHelperMessageType } from './domhelper';
import PagesDB from './database/PagesDB';

export interface IContentScannerPlugin {
    metaInfo(): string;

    canScanContent(params: IScanParameters): boolean;

    scan(params: IScanParameters): Promise<CATWikiPageSearchResults>;
}

export interface IScanParameters {
    domain: string;
    mainDomain: string;
    url: string;
    pagesDb: PagesDB;
    dom: IDOMHelperInterface;
}

// TODO: break this up into per DOMQuery types?
export interface IContentScanMessage {
    action: DOMHelperMessageType;
    id?: string;
    selector?: string;
    element?: string;
    html?: string;
}

export interface IElementData {
    tag: string;
    id: string;
    className: string;
    innerText: string;
    // innerHtml: string;  // can be a bit weighty
}

export class ContentScanner {
    private scannerPlugins: IContentScannerPlugin[] = [];
    private defaultScannerPlugin: IContentScannerPlugin = new DefaultScanner();
    private domHelper: IDOMHelperInterface = new DOMHelper();
    private scanCache: Map<string, Promise<CATWikiPageSearchResults>> = new Map();

    constructor() {
        this.findScannerPlugins();
    }

    public async checkPageContents(
        domain: string,
        mainDomain: string,
        url: string,
        pagesDb: PagesDB
    ): Promise<CATWikiPageSearchResults> {
        const cacheKey = `${domain}_${url}`;

        const cachedResult = this.scanCache.get(cacheKey);
        if (cachedResult) return cachedResult;

        const scannerParameters: IScanParameters = {
            domain: domain.toLowerCase(),
            mainDomain: mainDomain.toLowerCase(),
            url,
            pagesDb,
            dom: this.domHelper,
        };

        const matchingPlugins = this.scannerPlugins.filter((plugin) => plugin.canScanContent(scannerParameters));
        if (matchingPlugins.length > 0) {
            console.log(
                `Found ${matchingPlugins.length.toString()} plugin(s) that can handle request: ${scannerParameters.domain}`
            );

            // Execute all matching plugins in parallel
            const scanPromise = Promise.all(matchingPlugins.map((plugin) => plugin.scan(scannerParameters))).then(
                (results) => results.reduce((combined, current) => combined.merge(current))
            );

            // Cache the promise
            this.scanCache.set(cacheKey, scanPromise);
            return scanPromise;
        }
        console.log('Using default content scanner');
        const defaultScanPromise = this.defaultScannerPlugin.scan(scannerParameters);
        this.scanCache.set(cacheKey, defaultScanPromise);
        return defaultScanPromise;

        // for (const plugin of this.scannerPlugins) {
        //     // TODO: memoize the result ?
        //     if (plugin.canScanContent(scannerParameters)) {
        //         console.log(`Found a plugin that can handle request: ${scannerParameters.domain}`);
        //         // TODO: allow multiple handlers ?
        //         return await plugin.scan(scannerParameters);
        //     }
        // }
        // console.log('Using default content scanner');
        // return await this.defaultScannerPlugin.scan(scannerParameters);
    }

    private findScannerPlugins(): void {
        context.keys().map((key) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const module = context(key);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const className = Object.keys(module)[0];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const Class = module[className];
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            const obj: IContentScannerPlugin = new Class();
            this.scannerPlugins.push(obj);
            console.log('Added content scanner plugin: ', className, ' metainfo: ', obj.metaInfo());
        });
    }
}
