import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacypoliceComponent } from './privacypolice.component';

describe('PrivacypoliceComponent', () => {
  let component: PrivacypoliceComponent;
  let fixture: ComponentFixture<PrivacypoliceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacypoliceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrivacypoliceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
