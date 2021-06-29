import { TestBed } from '@angular/core/testing';

import { GeneralService } from './general.service';
import { HttpClientModule } from '@angular/common/http';
import { AppUtils } from 'src/app/utils/app.util';

describe('GeneralService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientModule],
    providers: [AppUtils]
  }));

  it('should be created', () => {
    const service: GeneralService = TestBed.get(GeneralService);
    expect(service).toBeTruthy();
  });
});
