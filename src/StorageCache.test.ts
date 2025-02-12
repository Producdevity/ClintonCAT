import chrome from 'sinon-chrome';
import PagesDB from './database/PagesDB';
import StorageCache from './StorageCache';

beforeEach(() => {
    // @ts-expect-error("browser api mocking")
    global.chrome = chrome as unknown as typeof chrome;
});

test.skip('should create storage cache and pages db', () => {
    chrome.storage.local.get
        .withArgs(StorageCache.CACHE_TIMESTAMP_KEY)
        .callsArgWith(1, { [StorageCache.CACHE_TIMESTAMP_KEY]: 0 });

    // TODO: needs fixing
    chrome.alarms.onAlarm.addListener.withArgs([StorageCache.UPDATE_ALARM_NAME, StorageCache.FETCH_INTERVAL_MS]);

    const pagesDb = new PagesDB();
    const storageCache = new StorageCache(pagesDb);
    console.log('storageCache', storageCache);
});
