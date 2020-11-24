declare interface StoreData {
  [key: string]: any;
}

declare interface StoreOptions {
  key?: string;
  include?: Array<string>;
  exclude?: Array<string>;
  saveDelayMs?: number;
}
