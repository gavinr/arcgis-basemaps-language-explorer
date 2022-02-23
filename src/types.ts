export interface LanguageInfo {
  id: string;
  label: string;
  group_id: string;
  group_url: string;
  maps: { [key: string]: any[] };
}

export interface StyleInfo {
  id: string;
  label: string;
  selected?: boolean;
}

export interface LanguageDataJson {
  styles: {
    [key: string]: StyleInfo;
  };
  languages: {
    [key: string]: LanguageInfo;
  };
}