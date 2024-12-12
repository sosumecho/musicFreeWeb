interface MusicPluginInstance {
  platform: string;
  author: string;
  version: string;
  appVersion?: string; // 可选字段
  srcUrl: string;
  cacheControl: string;
  hints: {
    importMusicSheet: string[];
  };
  supportedSearchType: ('music' | 'album' | 'sheet' | 'artist' | 'lyric')[];
  primaryKey?: string[]; // 可选字段
  description?: string; // 可选字段
}

export interface MusicPlugin {
  name: string;
  hash: string;
  instance: MusicPluginInstance;
  path: string;
}
