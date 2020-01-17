import { Component } from '@angular/core';
import { ISearchable } from 'projects/amazing-search-core/src/lib/amazing-search-definitions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'amazing-search';

  public terms: Array<ISearchable> = [
    {
      title: 'Amazing search',
      description:
        'You can type (search, amazing, amazing search) and I will be appeared!',
      id: '1',
      keywords:
        'search, amazing, amazing search, searching, find, pick, google',
      onSelect: (item: ISearchable) => {
        alert(`You have selected ${item.title}`);
      }
    }
  ];
}
