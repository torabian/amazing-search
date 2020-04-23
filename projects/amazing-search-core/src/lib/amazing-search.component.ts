import {
  Component,
  OnInit,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { ISearchOptions, ISearchable } from './amazing-search-definitions';
import { Router } from '@angular/router';
import { AmazingSearchService } from './amazing-search.service';
import { LunrSearchProvider } from './lunr-provider';
import { SimpleRegexSearch } from './simple-regex-provider';

import {
  KeyboardNavigateInArray,
  KEY_UP,
  KEY_DOWN,
  ENTER_KEY,
  ESCAPE_KEY,
  StoreInSearchHistory,
  IsMobileOrTablet,
} from './shared-utils';

const SearchHistory = new BehaviorSubject([]);

const defaultOptions: ISearchOptions = {
  unifyProvidersByKey: true,
};

@Component({
  /* tslint:disable */
  selector: 'amazing-search',
  /* tslint:enable */
  templateUrl: './amazing-search.component.html',
  styleUrls: ['./amazing-search.component.scss'],
})
export class AmazingSearchComponent implements OnInit {
  public searchTerm = '';

  // Items that will be shown to the user
  public searchFinalResults: ISearchable[] = [];

  // Maximum amount of items that dropdown will show to user.
  public maximumResults = 5;

  @Input() public options: ISearchOptions = defaultOptions;
  @Input() public providers: Array<any> = [
    LunrSearchProvider,
    SimpleRegexSearch,
  ];

  @Input() public set terms(terms: ISearchable[]) {
    if (!terms || !terms.length) {
      return;
    }

    this.searchService.SetProviders(this.providers);
    this.searchService.SetSearchTerms(terms, this.options);
  }

  public keyUp = new Subject<string>();
  public searchResult = new Subject<ISearchable[]>();
  public visibleSuggestions = false;
  public selectedIndex = 0;

  constructor(
    private router: Router,
    public searchService: AmazingSearchService
  ) {}

  @ViewChild('searchboxInput', { static: false }) public searchboxInput;
  @HostListener('window:keyup', ['$event']) public onKeyDown(event) {
    const $event = document.all ? window.event : event;
    if (!/^(?:input|textarea|select|button)$/i.test($event.target.tagName)) {
      if (event.key === 's') {
        this.searchboxInput.nativeElement.focus();
      }
    }
  }

  public onSearchBoxFocus() {
    this.searchFinalResults = SearchHistory.value;
    this.visibleSuggestions = true;
  }

  /**
   * @description Handles all events related to search text input, including enter, escape buttons
   */
  public onSearchTermInputKeyUp(e: KeyboardEvent) {
    this.selectedIndex = KeyboardNavigateInArray(
      e.keyCode,
      this.searchFinalResults,
      this.selectedIndex
    );
    if (e.keyCode === ESCAPE_KEY) {
      if (!this.searchTerm && this.searchFinalResults.length === 0) {
        this.searchboxInput.nativeElement.blur();
      }
      this.DismissAll();
    }
    if (e.keyCode === ENTER_KEY) {
      this.invokeAction(this.CurentSelectedItem);
      this.DismissAll();
    }
    if (
      (e.keyCode === KEY_DOWN || e.keyCode === KEY_UP) &&
      !this.searchTerm &&
      this.searchFinalResults.length === 0
    ) {
      this.searchFinalResults = SearchHistory.value;
    }
  }

  public DismissDelayed(delay = 150) {
    setTimeout(() => {
      this.DismissAll();
    }, delay);
  }

  public DismissAll() {
    this.searchTerm = '';
    this.selectedIndex = 0;
    this.searchService.Dismiss();
  }

  public get CurentSelectedItem() {
    return this.searchFinalResults[this.selectedIndex];
  }

  public invokeAction(suggestion: ISearchable) {
    if (!suggestion) {
      return;
    }
    StoreInSearchHistory(suggestion, SearchHistory);
    if (suggestion.navigatesByUri) {
      this.router.navigateByUrl(suggestion.navigatesByUri);
    }
    if (suggestion.onSelect) {
      suggestion.onSelect(this.CurentSelectedItem);
    }
    this.DismissAll();
    this.searchboxInput.nativeElement.blur();
  }

  public get viewPlaceholder() {
    if (IsMobileOrTablet()) {
      return (
        this.options.placeholderMobileText ||
        this.options.placeholderText ||
        `Tap to search...`
      );
    }
    return this.options.placeholderText || `Press 'S' or click to search...`;
  }

  ngOnInit() {
    this.searchService.SetProviders(this.providers);
    this.searchService.SearchResult.subscribe((result) => {
      this.searchFinalResults = result;
    });
  }

  public onSearchButtonClick() {
    this.DismissAll();
  }
}
