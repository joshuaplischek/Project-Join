import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactTaskComponent } from './compact-task.component';

describe('CompactTaskComponent', () => {
  let component: CompactTaskComponent;
  let fixture: ComponentFixture<CompactTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompactTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompactTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
