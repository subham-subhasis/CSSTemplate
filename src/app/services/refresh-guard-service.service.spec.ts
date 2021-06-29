import { TestBed } from '@angular/core/testing';

import { RefreshGuardServiceService } from './refresh-guard-service.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('RefreshGuardServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:[RouterTestingModule]
  }));

  it('should be created', () => {
    const service: RefreshGuardServiceService = TestBed.get(RefreshGuardServiceService);
    expect(service).toBeTruthy();
  });
});
