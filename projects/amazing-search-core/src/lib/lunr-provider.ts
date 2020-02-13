import {
  ISearchProvider,
  ISearchable,
  ILunrDocument
} from './amazing-search-definitions';
import { BehaviorSubject } from 'rxjs';

import lunr from 'lunr';

export class LunrSearchProvider implements ISearchProvider {
  private indexes;
  public ResultProvider: BehaviorSubject<ISearchable[]> = new BehaviorSubject(
    []
  );
  constructor(private terms: ISearchable[]) {
    this.indexTermsToLunr(terms);
  }

  public Search(keyword: string) {
    this.ResultProvider.next(this.performSearch(this.terms, keyword));
  }

  private performSearch(terms: ISearchable[], keyword: string): ISearchable[] {
    const result: ILunrDocument<ISearchable>[] = this.indexes.search(keyword);
    return result.map(x => this.terms.find(y => y.id === x.ref));
  }

  private indexTermsToLunr(terms: ISearchable[]) {
    this.indexes = lunr(function() {
      this.field('title');
      this.field('description');
      this.field('keywords');
      terms.forEach(x => this.add(x));
    });
  }
}
