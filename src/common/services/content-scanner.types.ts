import { DOMMessengerAction, IDOMMessengerInterface } from '@/content-scanners/helpers/dom-messenger.types';
import { CATWikiPageSearchResults, PagesDB } from '@/database';

export interface IContentScannerPlugin {
    metaInfo(): string;
    canScanContent(params: IScanParameters): boolean;
    scan(params: IScanParameters): Promise<boolean>;
}

export interface IScanParameters {
    domain: string;
    mainDomain: string;
    url: string;
    pagesDb: PagesDB;
    dom: IDOMMessengerInterface;
    notify: (result: CATWikiPageSearchResults) => void;
}

// TODO: break this up into per DOMQuery types?
export interface IContentScanMessage {
    action: DOMMessengerAction;
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
