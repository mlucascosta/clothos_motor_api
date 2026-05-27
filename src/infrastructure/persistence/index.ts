import { MongoRawResultStore } from './MongoRawResultStore.js';

export { MongoRawResultStore };
export type { RawResultDoc } from './RawResultDoc.js';

export const rawStore = new MongoRawResultStore();
