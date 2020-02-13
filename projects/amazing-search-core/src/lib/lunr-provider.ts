import {
  ISearchProvider,
  ISearchable,
  ILunrDocument
} from './amazing-search-definitions';
import { BehaviorSubject } from 'rxjs';

import lunr from 'lunr';
import { RemoveAccent } from './shared-utils';

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

  private generateMetaFields(terms: ISearchable[]) {
    return terms.map(term => {
      return {
        ...term,
        $title: RemoveAccent(term.title),
        $keywords: RemoveAccent(term.keywords),
        $description: RemoveAccent(term.description)
      };
    });
  }

  private indexTermsToLunr(terms: ISearchable[]) {
    terms = this.generateMetaFields(terms);
    this.indexes = lunr(function() {
      this.field('$title');
      this.field('$description');
      this.field('$keywords');
      terms.forEach(x => this.add(x));
    });
  }
}
