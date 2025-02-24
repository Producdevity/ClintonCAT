// The 'require.context' feature depends on WebPack (@types/webpack)
import CATWikiPageSearchResults from '../database/CATWikiPageSearchResults';
import PagesDB from '../database/PagesDB';

import { IDOMHelperInterface, DOMHelperMessageType } from '../DOMHelper';

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
