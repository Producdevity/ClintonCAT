import { IContentScannerPlugin, IScanParameters } from '../../ContentScanner';
import CATWikiPageSearchResults from '../../database/CATWikiPageSearchResults';

function fakeAsync() {
    console.log('TODO: implement async scanner');
    return Promise.resolve();
}

class AmazonUSPageScanner implements IContentScannerPlugin {
    metaInfo(): string {
        return 'amazon.com';
    }

    canScanContent(params: IScanParameters): boolean {
        return params.mainDomain === 'amazon' && params.domain.endsWith('com');
    }

    async scan(params: IScanParameters): Promise<CATWikiPageSearchResults> {
        console.log(`Amazon US Scanner: ${params.domain} - ${params.mainDomain}`);
        await fakeAsync();
        return new CATWikiPageSearchResults();
    }
}

export default AmazonUSPageScanner;
