import { IContentScannerPlugin, IScanParameters } from '../../ContentScanner';
import CATWikiPageSearchResults from '../../database/CATWikiPageSearchResults';

function fakeAsync() {
    console.log('TODO: implement async scanner');
    return Promise.resolve();
}

class AmazonUKPageScanner implements IContentScannerPlugin {
    metaInfo(): string {
        return 'amazon.co.uk';
    }

    canScanContent(params: IScanParameters): boolean {
        return params.mainDomain === 'amazon' && params.domain.endsWith('co.uk');
    }

    async scan(params: IScanParameters): Promise<CATWikiPageSearchResults> {
        console.log(`Amazon UK Scanner: ${params.domain} - ${params.mainDomain}`);
        await fakeAsync();
        return new CATWikiPageSearchResults();
    }
}

export default AmazonUKPageScanner;
