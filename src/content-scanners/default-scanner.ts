import { IContentScannerPlugin, IScanParameters } from '@/common/services/content-scanner.types';
import { CATWikiPageSearchResults } from '@/database';

class DefaultScanner implements IContentScannerPlugin {
    metaInfo(): string {
        return 'default scanner';
    }

    canScanContent(_params: IScanParameters): boolean {
        // skipped in plugin search, explicitly called if no other plugins can handle the params
        return false;
    }

    async scan(params: IScanParameters): Promise<boolean> {
        console.log(`Default Scanner: ${params.domain} - ${params.mainDomain}`);
        const results = new CATWikiPageSearchResults();
        console.log(results);
        const domainResults = params.pagesDb.getPagesForDomain(params.mainDomain);
        results.addPageEntries(domainResults.pageEntries);

        // TODO:
        // const pText = await params.dom.querySelectorAllAsText('p');
        // const pageResults = params.pagesDb.findConsecutiveWords(pText);
        // results.addPageEntries(pageResults.pageEntries);

        params.notify(results);
        return Promise.resolve(true);
    }
}

export default DefaultScanner;
