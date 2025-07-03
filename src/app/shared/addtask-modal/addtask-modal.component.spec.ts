import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtaskModalComponent } from './addtask-modal.component';

describe('AddtaskModalComponent', () => {
  let component: AddtaskModalComponent;
  let fixture: ComponentFixture<AddtaskModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddtaskModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddtaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
