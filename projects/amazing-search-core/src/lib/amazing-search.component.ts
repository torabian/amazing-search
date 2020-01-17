import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import lunr from 'lunr';

import { map, debounceTime, tap } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import {
  ISearchOptions,
  ILunrDocument,
  ISearchable
} from './amazing-search-definitions';
import { drawerAnim } from './amazing-search-anims';
import { Router } from '@angular/router';
import { IsMobileOrTablet } from './amazing-search.service';

@Component({
  selector: 'amazing-search',
  templateUrl: './amazing-search.component.html',
  styleUrls: ['./amazing-search.component.scss'],
  animations: [drawerAnim]
})
export class AmazingSearchComponent implements OnInit, OnDestroy {
  public searchTerm = '';
  public inputActive = false;
  @Input() public options: ISearchOptions = {};
  @Input() public set terms(terms: ISearchable[]) {
    if (!terms || !terms.length) {
      return;
    }
    this.termsItems = terms;
    this.index(terms);
  }

  public suggestions: ISearchable[] = [];
  private subscription: Subscription = null;
  private termsItems: ISearchable[] = [];
  public keyUp = new Subject<string>();
  public searchResult = new Subject<ISearchable[]>();
  public visibleSuggestions = false;
  public selectedIndex = -1;
  private indexes = null;

  @ViewChild('searchboxInput', { static: false }) public searchboxInput;
  @HostListener('window:keyup', ['$event']) public onKeyDown(
    event: KeyboardEvent
  ) {
    const $event = document.all ? window.event : event;
    if (!/^(?:input|textarea|select|button)$/i.test($event.target['tagName'])) {
      if (event.key === 's') {
        this.searchboxInput.nativeElement.focus();
      }
    }
  }
  @HostListener('document:click', ['$event'])
  clickedOutside(event) {
    const isInside = this.ref.nativeElement.contains(event.target);
    if (!isInside) {
      this.CloseSuggestions();
    }
  }
  private index(terms: ISearchable[]) {
    this.indexes = lunr(function() {
      this.field('title');
      this.field('description');
      this.field('keywords');
      terms.forEach(x => this.add(x));
    });
  }

  private handleIndex(
    e: KeyboardEvent,
    suggestions: ISearchable[],
    selectedIndex: number
  ): number {
    if (e.keyCode === 40) {
      selectedIndex++;
      if (selectedIndex > suggestions.length) {
        selectedIndex = 0;
      }
    }
    if (e.keyCode === 38) {
      selectedIndex--;
      if (selectedIndex === -1) {
        selectedIndex = suggestions.length;
      }
    }
    return selectedIndex;
  }
  public onKeyUp(e: KeyboardEvent) {
    this.selectedIndex = this.handleIndex(
      e,
      this.suggestions,
      this.selectedIndex
    );
    if (e.keyCode === 27) {
      if (!this.searchTerm) {
        this.searchboxInput.nativeElement.blur();
      }
      this.dismissSuggestion();
    }
    if (e.keyCode === 13) {
      this.selectIndex();
      this.dismissSuggestion();
    }
  }
  private dismissSuggestion() {
    this.searchTerm = '';
    this.selectedIndex = -1;
    this.searchResult.next([]);
  }
  private performSearch(term: string): void {
    if (!term || !term.trim() || !this.indexes) {
      return this.searchResult.next([]);
    }
    const result: ILunrDocument<ISearchable>[] = this.indexes.search(term);

    const final = result.map(x => this.termsItems.find(y => y.id === x.ref));
    if (!result) {
      return;
    }
    this.searchResult.next(final);
  }

  public get CurentSelectedItem() {
    return this.suggestions[this.selectedIndex];
  }

  /**
   * @description Selects an item which is focused by keyboard arrows, touch or click
   */
  public selectIndex() {
    const search = this.suggestions[this.selectedIndex];
    if (!search) {
      return;
    }
    this.invokeAction(search);
  }

  private invokeAction(suggestion: ISearchable) {
    if (suggestion.navigatesByUri) {
      this.router.navigateByUrl(suggestion.navigatesByUri);
    }
    if (suggestion.onSelect) {
      suggestion.onSelect(this.CurentSelectedItem);
    }
  }
  public selectByPress(index: number) {
    this.selectedIndex = index;
    this.selectIndex();
    this.dismissSuggestion();
  }
  public CloseSuggestions() {
    // this.searchResult.next([]);
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

  constructor(private ref: ElementRef, private router: Router) {}

  public onInput(event) {
    const { value } = event.target;
    this.performSearch(value);
    this.searchTerm = value;
    this.keyUp.next(value);
    this.inputActive = true;
  }

  ngOnInit() {
    this.subscription = this.keyUp
      .pipe(
        map(event => event),
        debounceTime(500)
      )
      .subscribe(() => {
        this.inputActive = false;
      });
    this.searchResult
      .pipe(
        debounceTime(200),
        tap(result => {
          if (result.length === 0) {
            this.selectedIndex = -1;
          }
          // in this case, first need to hide, and then clear array for animation
          const cleared = result.length === 0 && this.suggestions.length > 0;
          const inserted = result.length > 0 && this.suggestions.length === 0;
          if (cleared) {
            this.visibleSuggestions = false;
          }
          if (inserted) {
            this.suggestions = result;
          }
        }),
        tap((result: ISearchable[]) => {
          result = result.map((item: ISearchable) => {
            if (typeof item.title === 'function') {
              item.title = item.title(this.searchTerm);
            }
            return item;
          });
          return result;
        }),
        debounceTime(150)
      )
      .subscribe(result => {
        const cleared = result.length === 0 && this.suggestions.length > 0;
        const inserted = result.length ? true : false;
        if (cleared) {
          this.suggestions = [];
        }
        if (inserted) {
          this.visibleSuggestions = true;
        }
        if (result.length && this.visibleSuggestions) {
          this.suggestions = result;
        }
        if (this.suggestions.length) {
          this.selectedIndex = 0;
        }
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public onSearchButtonClick() {
    this.searchTerm = '';
  }
}
