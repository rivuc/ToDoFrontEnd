import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoTasksComponent } from './to-do-tasks.component';
import { ToDoTaskService } from './to-do-tasks.service';
import { ToDoTask } from '../shared/to-do-task.model';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ToDoTaskComponent', () => {
  let component: ToDoTasksComponent;
  let fixture: ComponentFixture<ToDoTasksComponent>;
  let toDoTaskService: jasmine.SpyObj<ToDoTaskService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    const toDoTaskServiceSpy = jasmine.createSpyObj('ToDoTaskService', [
      'getToDoTasks',
      'startedEditing',
      'showForm',
    ]);

    toDoTaskServiceSpy.toDoTaskChanged = new Subject<ToDoTask[]>();
    toDoTaskServiceSpy.startedEditing = new Subject<number>();

    router = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = {
      snapshot: {
        params: { id: '1' },
      },
    } as unknown as ActivatedRoute;

    await TestBed.configureTestingModule({
      providers: [
        ToDoTaskService,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: activatedRoute,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToDoTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    toDoTaskService = TestBed.inject(
      ToDoTaskService
    ) as jasmine.SpyObj<ToDoTaskService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch to-do tasks on init', () => {
    const mockTasks: ToDoTask[] = [
      { id: 1, title: 'Task 1', isDone: true },
      { id: 2, title: 'Task 2', isDone: false },
    ];
    spyOn(toDoTaskService, 'getToDoTasks').and.returnValue(mockTasks);
    toDoTaskService.getToDoTasks.and.returnValue(mockTasks);

    component.ngOnInit();

    expect(toDoTaskService.getToDoTasks).toHaveBeenCalled();
    expect(component.toDoTasks).toEqual(mockTasks);
  });

  it('should update to-do tasks when toDoTaskChanged event is emitted', () => {
    const mockTasks: ToDoTask[] = [
      { id: 1, title: 'Task 1', isDone: true },
      { id: 2, title: 'Task 2', isDone: false },
      { id: 3, title: 'Task 3', isDone: false },
    ];
    component.toDoTasks = [
      { id: 1, title: 'Task 1', isDone: true },
      { id: 2, title: 'Task 2', isDone: false },
    ];

    toDoTaskService.toDoTaskChanged.next(mockTasks);

    expect(component.toDoTasks).toEqual(mockTasks);
    expect(component.toDoTasks.length).toEqual(mockTasks.length);
  });

  it('should navigate to the edit page and set the selected index', () => {
    spyOn(toDoTaskService.startedEditing, 'next');
    spyOn(toDoTaskService, 'showForm');

    const index = 1;

    component.onEditTask(index);

    expect(toDoTaskService.startedEditing.next).toHaveBeenCalledWith(1);
    expect(toDoTaskService.showForm).toHaveBeenCalledWith(true);
    expect(router.navigate).toHaveBeenCalledWith([index, 'edit'], {
      relativeTo: activatedRoute,
    });
  });

  it('should navigate to the new task page and set the selected index to null', () => {
    spyOn(toDoTaskService, 'showForm');

    component.onNewTask();

    expect(toDoTaskService.showForm).toHaveBeenCalledWith(true);
    expect(toDoTaskService.selectedIndex).toBe(-1);
    expect(router.navigate).toHaveBeenCalledWith(['new'], {
      relativeTo: activatedRoute,
    });
  });

  it('should display the list of to-do tasks', () => {
    const mockTasks: ToDoTask[] = [
      { id: 1, title: 'Task 1', isDone: true },
      { id: 2, title: 'Task 2', isDone: false },
    ];
    spyOn(toDoTaskService, 'getToDoTasks').and.returnValue(mockTasks);
    toDoTaskService.getToDoTasks.and.returnValue(mockTasks);
    component.toDoTasks = toDoTaskService.getToDoTasks();

    fixture.detectChanges();

    const listItems = fixture.debugElement.queryAll(By.css('li'));
    expect(listItems.length).toBe(2);
    expect(listItems[0].nativeElement.textContent).toContain('Task 1');
    expect(listItems[1].nativeElement.textContent).toContain('Task 2');
  });
});
