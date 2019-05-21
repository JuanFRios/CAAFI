import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyConfigComponent } from './survey-config.component';

describe('SurveyConfigComponent', () => {
  let component: SurveyConfigComponent;
  let fixture: ComponentFixture<SurveyConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
