import { TestBed } from '@angular/core/testing';

import { ScriptDataService } from './script-data';

describe('ScriptDataService', () => {
  let service: ScriptDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
