import { TestBed, inject } from '@angular/core/testing';

import { AmazingSearchService } from './amazing-search.service';

describe('AmazingSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AmazingSearchService]
    });
  });

  it('should be created', inject([AmazingSearchService], (service: AmazingSearchService) => {
    expect(service).toBeTruthy();
  }));
});
