import { TestBed } from '@angular/core/testing';

import { BillProfileService } from './bill-profile.service';
import { HttpClientModule } from '@angular/common/http';
import { AppUtils } from 'src/app/utils/app.util';

describe('BillProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [AppUtils]
  }));

  it('should be created', () => {
    const service: BillProfileService = TestBed.get(BillProfileService);
    expect(service).toBeTruthy();
  });
});
