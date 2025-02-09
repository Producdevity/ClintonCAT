import PageEntry, { IPageEntry } from './PageEntry';

class CATWikiPageSearchResults {
    private _pageEntries: IPageEntry[] = [];

    constructor(pageEntries: IPageEntry[] = []) {
        this.addPageEntries(pageEntries);
    }

    public addPageEntry(pageEntry: IPageEntry): void {
        this._pageEntries = [...this._pageEntries, new PageEntry(pageEntry)];
    }

    public addPageEntries(pageEntries: readonly IPageEntry[]): void {
        for (const pageEntry of pageEntries) {
            this.addPageEntry(pageEntry);
        }
    }

    public merge(other: CATWikiPageSearchResults): CATWikiPageSearchResults {
        // Create a new instance with current entries
        const merged = new CATWikiPageSearchResults(this._pageEntries);

        // Add entries from the other instance, avoiding duplicates based on pageTitle
        // since that's what determines the URL
        const existingTitles = new Set(this._pageEntries.map((entry) => entry.pageTitle));

        other.pageEntries.forEach((entry) => {
            if (!existingTitles.has(entry.pageTitle)) {
                merged.addPageEntry(entry);
            } else {
                // If entry exists, we might want to merge additional information
                // like combining categories or extending popup text if they differ
                const existingEntry = this._pageEntries.find((e) => e.pageTitle === entry.pageTitle);
                if (existingEntry) {
                    if (existingEntry.category !== entry.category) {
                        existingEntry.category = `${existingEntry.category}, ${entry.category}`;
                    }
                    if (existingEntry.popupText !== entry.popupText) {
                        existingEntry.popupText = `${existingEntry.popupText}\n${entry.popupText}`;
                    }
                }
            }
        });

        return merged;
    }

    get totalPagesFound(): number {
        return this._pageEntries.length;
    }

    get pageEntries(): readonly IPageEntry[] {
        return this._pageEntries;
    }
}

export default CATWikiPageSearchResults;
