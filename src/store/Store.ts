import {
  makeObservable,
  isObservableProp,
  observable,
  action,
  autorun,
  reaction
} from 'mobx';

class Store {
  storeInitializing = false;
  storeReady = false;
  storeKey: string | null;
  storeInclude: Array<string> | null;
  storeExclude: Array<string> | null;
  storeSaveDelayMs: number | null;
  storeSaveTimeout: number | null = null;
  storeLastSaveTime: Date | null = null;
  storeVerbose = true;

  constructor(options: StoreOptions) {
    const {
      key,
      include,
      exclude,
      saveDelayMs
    } = options;

    this.storeKey = key || null;
    this.storeInclude = include || null;
    this.storeExclude = exclude || null;
    this.storeSaveDelayMs = saveDelayMs || null;

    makeObservable(this, {
      storeReady: observable,
      triggerReady: action
    });
  }

  async init(): Promise<StoreData> {
    if (!this.storeInitializing) {
      this.storeInitializing = true;

      const storable = this.storeKey !== null;

      try {
        if (storable) {
          await this.load();
        }

        autorun(async() => {
          const data = this.getObservableData();
          if (this.storeReady) {
            if (storable) {
              await this.save(data);
            }
            return;
          }
          if (this.storeVerbose) {
            console.log(`Store${storable ? ` "${this.storeKey}"` : ''} is ready.`);
          }
          this.triggerReady();
        });
      }
      catch (e) {
        if (this.storeVerbose) {
          console.error(e);
        }
        return Promise.reject(`Unable to initialize store${storable ? ` "${this.storeKey}"` : ''}.`);
      }
    }

    return new Promise(resolve => {
      if (this.storeReady) {
        resolve(this.getObservableData());
        return;
      }
      reaction(() => this.storeReady, (storeReady, prevStoreReady, reaction) => {
        if (storeReady) {
          reaction.dispose();
          resolve(this.getObservableData());
        }
      });
    });
  }

  triggerReady(): void {
    this.storeReady = true;
  }

  getObservableData(): StoreData {
    const data: StoreData = {};
    Object.entries(this).forEach(([key, value]) => {
      if (
        key === 'storeReady' ||
        !isObservableProp(this, key) ||
        (Array.isArray(this.storeInclude) && !this.storeInclude.includes(key)) ||
        (Array.isArray(this.storeExclude) && this.storeExclude.includes(key))
      ) {
        return;
      }
      data[key] = value;
    });
    return data;
  }

  async load(): Promise<StoreData> {
    if (this.storeKey === null) {
      return Promise.reject('Unable to load data for non-storable store.');
    }

    const dataItem = localStorage.getItem(this.storeKey);
    if (dataItem === null) {
      return {};
    }

    try {
      const parsedData = JSON.parse(dataItem);
      const data = this.getObservableData();
      const names = Object.keys(data);
      names.forEach((name) => {
        const value = restoreValue(parsedData[name]);
        if (value === undefined) {
          return;
        }
        (this as any)[name] = value;
      });
    }
    catch (e) {
      if (this.storeVerbose) {
        console.error(e);
      }
      return Promise.reject('Unable to load data from the storage.');
    }

    const data = this.getObservableData();
    if (this.storeVerbose) {
      console.log(`Data for store "${this.storeKey}" is loaded:`);
      console.log(data);
    }
    return data;
  }

  async save(data: StoreData): Promise<void> {
    if (this.storeKey === null) {
      return Promise.reject('Unable to save data for non-storable store.');
    }

    if (this.storeSaveTimeout !== null) {
      window.clearTimeout(this.storeSaveTimeout);
      this.storeSaveTimeout = null;
    }

    if (this.storeSaveDelayMs !== null && this.storeLastSaveTime !== null) {
      if (new Date().getTime() - this.storeLastSaveTime.getTime() < this.storeSaveDelayMs) {
        this.storeSaveTimeout = window.setTimeout(() => {
          this.save(data).catch(e => {
            if (this.storeVerbose) {
              console.error(e);
            }
          });
        }, this.storeSaveDelayMs);
        return;
      }
    }

    try {
      localStorage.setItem(this.storeKey, JSON.stringify(data));
      this.storeLastSaveTime = new Date();
      if (this.storeVerbose) {
        console.log(`Data of store "${this.storeKey}" is saved.`);
      }
    }
    catch (e) {
      if (this.storeVerbose) {
        console.error(e);
      }
    }
  }
}

const regExpIso8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

function restoreValue(value: any): any {
  if (typeof value === 'string' && regExpIso8601.test(value)) {
    return new Date(value);
  }
  return value;
}

export default Store;
