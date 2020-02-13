import { Injectable } from '@angular/core';
import {
  ISearchable,
  ISearchProvider,
  ISearchOptions
} from './amazing-search-definitions';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { flatten } from './shared-utils';
import uniqBy from 'lodash.uniqby';

function UniqueKeyFilter(items: ISearchable[]): ISearchable[] {
  return uniqBy(items, 'key');
}

function FlattenFilter(items: Array<ISearchable[]>): ISearchable[] {
  return flatten(items);
}

@Injectable({
  providedIn: 'root'
})
export class AmazingSearchService {
  private searchProviders: ISearchProvider[] = [];

  // Raw class (not instances)
  private providers: any[] = [];

  private options: ISearchOptions;

  public SearchResult: BehaviorSubject<ISearchable[]> = new BehaviorSubject([]);

  constructor() {}

  public SetSearchTerms(items: ISearchable[], options: ISearchOptions) {
    this.options = options;
    console.log(this.providers);
    for (const provider of this.providers) {
      this.searchProviders.push(new provider(items));
    }
    const sources = this.searchProviders.map(t => t.ResultProvider);
    combineLatest(sources).subscribe((result: any) => {
      result = FlattenFilter(result);
      if (this.options.unifyProvidersByKey) {
        result = UniqueKeyFilter(result);
      }
      this.SearchResult.next(result);
    });
  }

  public Search(term: string) {
    this.searchProviders.forEach(provider => provider.Search(term));
  }

  public SetProviders(providers: Array<any>) {
    this.providers = providers;
  }

  public Dismiss() {
    this.SearchResult.next([]);
  }
}
