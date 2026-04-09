import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoTaskEditV2Component } from './to-do-task-edit-v2.component';

describe('ToDoTaskEditV2Component', () => {
  let component: ToDoTaskEditV2Component;
  let fixture: ComponentFixture<ToDoTaskEditV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoTaskEditV2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToDoTaskEditV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
