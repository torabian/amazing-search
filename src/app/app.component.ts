import { Component } from '@angular/core';
import { ISearchable } from 'projects/amazing-search-core/src/lib/amazing-search-definitions';
import {
  SimpleRegexSearch,
  LunrSearchProvider
} from 'projects/amazing-search-core/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'amazing-search';

  public code =
    '<amazing-search [terms]="terms" [providers]="[SimpleRegexSearch, LunrSearchProvider]"></amazing-search>';
  public providers = [SimpleRegexSearch, LunrSearchProvider];

  public terms: Array<ISearchable> = [
    {
      title: 'Amazing search',
      description:
        'You can type (search, amazing, amazing search) and I will be appeared!',
      id: '1',
      keywords:
        'search, amazing, amazing search, searching, find, pick, google',
      onSelect: (item: ISearchable) => {
        console.log(`You have selected ${item.title}`);
      }
    },
    {
      title: 'Bogota in Colombia',
      description: 'Book a new ticket to bogota',
      id: '2',
      keywords: 'south america, bogota, new, world',
      onSelect: (item: ISearchable) => {
        console.log(`You have selected ${item.title}`);
      }
    }
  ];
}
