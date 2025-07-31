import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoTaskEditComponent } from './to-do-task-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToDoTaskService } from '../to-do-tasks.service';
import { of, Subject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ToDoTask } from '../../shared/to-do-task.model';
import { By } from '@angular/platform-browser';

describe('ToDoTaskEditComponent', () => {
  let component: ToDoTaskEditComponent;
  let fixture: ComponentFixture<ToDoTaskEditComponent>;
  let activatedRoute: ActivatedRoute;
  let toDoTaskServiceSpy: jasmine.SpyObj<ToDoTaskService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    toDoTaskServiceSpy = jasmine.createSpyObj('ToDoTaskService', [
      'getToDoTasks',
      'startedEditing',
      'showForm',
      'updateToDoTask',
      'addToDoTask',
      'deleteToDoTask',
    ]);
    toDoTaskServiceSpy.startedEditing = new Subject<number>();

    let activatedRoute = {
      params: of({ id: '1' }),
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: ToDoTaskService, useValue: toDoTaskServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoTaskEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a to-do task item', () => {
    const mockNgForm = {
      value: {
        title: 'Task 1',
        isDone: true,
      },
    } as NgForm;
    component.editMode = false;
    component.onSubmit(mockNgForm);

    expect(toDoTaskServiceSpy.updateToDoTask).toHaveBeenCalledTimes(0);
    expect(toDoTaskServiceSpy.addToDoTask).toHaveBeenCalled();
  });

  it('should update a to-do task item', () => {
    const mockNgForm = {
      value: {
        title: 'Task 1',
        isDone: true,
      },
    } as NgForm;
    component.editMode = true;

    let toDoTask = new ToDoTask(1, '1', true);
    component.onSubmit(mockNgForm);

    expect(toDoTaskServiceSpy.showForm).toHaveBeenCalled();
    expect(toDoTaskServiceSpy.addToDoTask).toHaveBeenCalledTimes(0);
  });

  it('should delete a to-do task item', () => {
    component.onDelete();

    expect(toDoTaskServiceSpy.deleteToDoTask).toHaveBeenCalled();
  });

  it('should cancel a to-do task item', () => {
    spyOn(toDoTaskServiceSpy.startedEditing, 'next');
    component.onCancel();

    expect(toDoTaskServiceSpy.showForm).toHaveBeenCalledOnceWith(false);
    expect(toDoTaskServiceSpy.startedEditing.next).toHaveBeenCalled();
  });

  it('should click in save button', () => {
    toDoTaskServiceSpy.showForm(true);
    spyOn(component, 'onSubmit');

    fixture.detectChanges();

    const formElement = fixture.debugElement.query(By.css('form'));

    // Simula el envío del formulario
    formElement.triggerEventHandler('ngSubmit', {});

    expect(component.onSubmit).toHaveBeenCalled();
  });
});
