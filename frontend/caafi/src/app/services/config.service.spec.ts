import { TestBed, inject } from '@angular/core/testing';
import { TemplatesService } from './config.service';

describe('ConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplatesService]
    });
  });

  it('should be created', inject([TemplatesService], (service: TemplatesService) => {
    expect(service).toBeTruthy();
  }));
});
