import { TestBed } from '@angular/core/testing';

import { TasksFirbaseService } from './tasks-firbase.service';

describe('TasksFirbaseService', () => {
  let service: TasksFirbaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksFirbaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
