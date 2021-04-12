import { TestBed } from '@angular/core/testing';

import { RoutemodelService } from './routemodel.service';

describe('RoutemodelService', () => {
  let service: RoutemodelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoutemodelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
