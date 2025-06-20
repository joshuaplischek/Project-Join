import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactModulComponent } from './add-contact-modul.component';

describe('AddContactModulComponent', () => {
  let component: AddContactModulComponent;
  let fixture: ComponentFixture<AddContactModulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContactModulComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddContactModulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
