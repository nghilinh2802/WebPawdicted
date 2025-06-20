import { TestBed } from '@angular/core/testing';

import { DatabaseBlogsService } from './database-blogs.service';

describe('DatabaseBlogsService', () => {
  let service: DatabaseBlogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseBlogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
