import { ISearchProvider, ISearchable } from './amazing-search-definitions';
import { BehaviorSubject } from 'rxjs';
import { RemoveAccent } from './shared-utils';

export class SimpleRegexSearch implements ISearchProvider {
  public ResultProvider: BehaviorSubject<ISearchable[]> = new BehaviorSubject(
    []
  );
  constructor(private terms: ISearchable[]) {}

  public Search(keyword: string) {
    this.ResultProvider.next(this.performSearch(this.terms, keyword));
  }

  private performSearch(terms: ISearchable[], keyword: string): ISearchable[] {
    let items = [];
    if (!keyword) {
      return [];
    }
    keyword = RemoveAccent(keyword.toLowerCase());
    items = terms.filter(term => {
      const title = RemoveAccent((term.title as string) || '').toLowerCase();
      const description = RemoveAccent(
        (term.description as string) || ''
      ).toLowerCase();
      const keywords = RemoveAccent(
        (term.keywords as string) || ''
      ).toLowerCase();

      if (
        title.indexOf(keyword) > -1 ||
        description.indexOf(keyword) > -1 ||
        keywords.indexOf(keyword) > -1
      ) {
        return true;
      }
      return false;
    });
    return items;
  }
}
