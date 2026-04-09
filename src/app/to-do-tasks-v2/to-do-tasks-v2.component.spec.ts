import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoTasksV2Component } from './to-do-tasks-v2.component';
import { ToDoTask } from '../shared/to-do-task.model';
import { ToDoTaskServiceV2 } from './to-do-tasks-v2.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

// mocks
const mockTasks: ToDoTask[] = [
  { id: 1, title: 'Task 1', isDone: false },
  { id: 2, title: 'Task 2', isDone: true },
];

describe('ToDoTasksV2Component', () => {
  let component: ToDoTasksV2Component;
  let fixture: ComponentFixture<ToDoTasksV2Component>;
  let mockToDoTaskService: jasmine.SpyObj<ToDoTaskServiceV2>;
  let mockMessageService: jasmine.Spy;

  beforeEach(async () => {
    mockToDoTaskService = jasmine.createSpyObj('ToDoTaskServiceV2', [
      'getToDoTasks',
      'createToDoTask',
      'updateToDoTask',
      'deleteToDoTask',
      'deleteMultipleToDoTask',
    ]);
    mockToDoTaskService.getToDoTasks.and.returnValue(of(mockTasks));

    await TestBed.configureTestingModule({
      imports: [ToDoTasksV2Component],
      providers: [
        { provide: ToDoTaskServiceV2, useValue: mockToDoTaskService },
        //  { provide: MessageService, useValue: mockMessageService }, //no funciona probablemente por la complejidad de la libreria
        { provide: MessageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoTasksV2Component);
    component = fixture.componentInstance;

    // Crear el spy DESPUÉS de la creación del componente
    mockMessageService = spyOn(component['messageService'], 'add');

    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('ngOnInit() should load tasks successfully', () => {
    component.ngOnInit();

    expect(component.toDoTasks.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  fit('onEdit() should set edit state and open dialog', () => {
    component.onEdit(mockTasks[0]);
    expect(component.isEdit).toBeTrue();
    expect(component.selectedTask).toEqual(mockTasks[0]);
    expect(component.visibleEdit).toBeTrue();
  });

  fit('onSave() should create a ToDo Task', () => {
    component.isEdit = false;
    const newTask: ToDoTask = { id: 3, title: 'New Task', isDone: false };
    mockToDoTaskService.createToDoTask.and.returnValue(of(newTask));

    component.toDoTasks = [...mockTasks];
    component.onSave(newTask);

    expect(mockToDoTaskService.createToDoTask).toHaveBeenCalledWith(newTask);
    expect(component.toDoTasks).toContain(newTask);
    expect(component.toDoTasks.length).toBe(3);
  });

  fit('onSave() should save a ToDo Task', () => {
    component.isEdit = true;
    const editTask: ToDoTask = mockTasks[0];
    editTask.title = 'Updated Task';
    mockToDoTaskService.updateToDoTask.and.returnValue(of(editTask));

    component.toDoTasks = [...mockTasks];
    component.onSave(editTask);

    expect(mockToDoTaskService.updateToDoTask).toHaveBeenCalledWith(editTask);
    expect(component.toDoTasks).toContain(editTask);
    expect(component.toDoTasks.length).toBe(2);
  });

  fit('onDelete() should remove a ToDo Task', () => {
    mockToDoTaskService.deleteToDoTask.and.returnValue(of(void 0));
    const index = 1;
    const deleteTask: ToDoTask = mockTasks[index];
    component.toDoTasks = [...mockTasks];

    component.onDelete(index);

    expect(mockToDoTaskService.deleteToDoTask).toHaveBeenCalledWith(
      deleteTask.id!
    );
    expect(component.toDoTasks.length).toBe(1);
    expect(component['messageService'].add).toHaveBeenCalledWith(
      jasmine.objectContaining({ summary: 'Deleted' })
    );
  });

  fit('onDeleteMultiple() should remove multiple ToDo Tasks', () => {
    const selectedTasks = [mockTasks[0], mockTasks[1]];
    mockToDoTaskService.deleteMultipleToDoTask.and.returnValue(of(void 0));
    component.toDoTasks = [...mockTasks];
    component.selectedTasks = selectedTasks;

    component.onDeleteSelected();

    expect(mockToDoTaskService.deleteMultipleToDoTask).toHaveBeenCalledWith(
      selectedTasks.map((task) => task.id!)
    );
    expect(component.toDoTasks.length).toBe(0);
    expect(component['messageService'].add).toHaveBeenCalledWith(
      jasmine.objectContaining({ summary: 'Deleted' })
    );
  });
});
