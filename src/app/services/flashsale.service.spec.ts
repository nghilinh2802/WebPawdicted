import { TestBed } from '@angular/core/testing';

import { FlashsaleService } from './flashsale.service';

describe('FlashsaleService', () => {
  let service: FlashsaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlashsaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
