import { Injectable } from '@angular/core';
import { ISearchable } from './amazing-search-definitions';
import lunr from 'lunr';

@Injectable({
  providedIn: 'root'
})
export class AmazingSearchService {
  private indexes: any = [];
  constructor() {}

  /**
   * @description reindexes lunr search based on new terms
   */
  public reindex(terms: ISearchable[]) {
    this.indexes = lunr(function() {
      this.field('title');
      this.field('description');
      this.field('keywords');
      terms.forEach(x => this.add(x));
    });
  }

  public get Indexes() {
    return this.indexes;
  }
}
