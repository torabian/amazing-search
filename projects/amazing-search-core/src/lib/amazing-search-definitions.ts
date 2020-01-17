export interface ISearchOptions {
  staticHint?: string;
}
export interface ILunrDocument<T> {
  ref: string;
  score: number;
  matchData: {
    metadata: T;
  };
}
/**
 * Represents an entity whom can be searched. All incoming definitions
 * should implement this.
 */
export interface ISearchable {
  id: any;

  /**
   * @description When user search appears, this will be shown. This field will be indexed
   */
  title: ((term: string) => string) | string;
  /**
   * @description Add keywords separated with comma. It helps the search. This fields will
   * be indexed
   */
  keywords: string;
  /**
   * @description describe this search result. This field can be indexed.
   */
  description: string;
  /**
   * @description when user selects this search result, it will use routerLink
   * to change the window location
   */
  navigatesByUri?: string;
  /**
   * @description When user selects this result, this script will be called
   */
  onSelect?: () => void;
}
