export interface IPageEntry {
    pageTitle: string;
    popupText: string;
    category: string;
}

class PageEntry implements IPageEntry {
    static readonly WIKI_URL: string = 'https://wiki.rossmanngroup.com/wiki';

    private _pageTitle: string;
    private _popupText: string;
    private _category: string;

    constructor(pageEntry: IPageEntry) {
        this._pageTitle = pageEntry.pageTitle;
        this._popupText = pageEntry.popupText;
        this._category = pageEntry.category;
    }

    get pageTitle(): string {
        return this._pageTitle;
    }

    set pageTitle(value: string) {
        this._pageTitle = value;
    }

    get popupText(): string {
        return this._popupText;
    }

    set popupText(value: string) {
        this._popupText = value;
    }

    get category(): string {
        return this._category;
    }

    set category(value: string) {
        this._category = value;
    }

    public url(): string {
        return `${PageEntry.WIKI_URL}/${encodeURIComponent(this.pageTitle)}`;
    }
}

export default PageEntry;
