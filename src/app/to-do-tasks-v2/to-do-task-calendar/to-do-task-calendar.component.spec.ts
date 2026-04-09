import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoTaskCalendarComponent } from './to-do-task-calendar.component';

describe('ToDoTaskCalendarComponent', () => {
  let component: ToDoTaskCalendarComponent;
  let fixture: ComponentFixture<ToDoTaskCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoTaskCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToDoTaskCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
