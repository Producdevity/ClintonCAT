import escapeRegex from '../utils/escapeRegex';
import { IPageEntry } from './PageEntry';
import CATWikiPageSearchResults from './CATWikiPageSearchResults';

class PagesDB {
    private pagesList: IPageEntry[] = []; // keep another local copy.

    public setPages(pages: IPageEntry[]) {
        // console.log('setPages', pages);
        this.pagesList = pages;
    }

    public getPagesForDomain(domain: string): CATWikiPageSearchResults {
        return this.fuzzySearch(domain);
    }

    public simpleSearch(query: string): CATWikiPageSearchResults {
        const lowerQuery = query.toLowerCase();
        const results = new CATWikiPageSearchResults();
        for (const pageEntry of this.pagesList) {
            if (pageEntry.pageTitle.toLowerCase().includes(lowerQuery)) {
                results.addPageEntry(pageEntry);
            }
        }
        return results;
    }

    public fuzzySearch(query: string, matchAllWords: boolean = false): CATWikiPageSearchResults {
        const lowerQueryWords = query.toLowerCase().split(/\s+/);
        const results = new CATWikiPageSearchResults();

        const pageEntries = this.pagesList
            .map((pageEntry) => {
                const lowerTitle = pageEntry.pageTitle.toLowerCase();
                let matchCount = 0;
                for (const word of lowerQueryWords) {
                    // Use word boundaries to reduce false positives
                    // and escape special regex characters to handle queries like "(test)".
                    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, 'i');
                    if (regex.test(lowerTitle)) {
                        matchCount++;
                    }
                }
                return { pageEntry, matchCount };
            })
            .filter(({ matchCount }) => (matchAllWords ? matchCount === lowerQueryWords.length : matchCount > 0))
            .sort((a, b) => b.matchCount - a.matchCount)
            .map(({ pageEntry }) => pageEntry);

        results.addPageEntries(pageEntries);
        return results;
    }
}

export default PagesDB;
