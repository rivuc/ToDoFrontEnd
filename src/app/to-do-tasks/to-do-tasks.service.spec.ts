import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ToDoTaskService } from './to-do-tasks.service';
import { ToDoTask } from '../shared/to-do-task.model';
import { environment } from '../../environments/environment';

describe('ToDoTaskService', () => {
  let service: ToDoTaskService;
  let httpMock: HttpTestingController;
  let mockTasks: ToDoTask[];
  const createMockTasks = (): ToDoTask[] => [
    { id: 1, title: 'Task 1', isDone: true },
    { id: 2, title: 'Task 2', isDone: false },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ToDoTaskService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ToDoTaskService);
    httpMock = TestBed.inject(HttpTestingController);
    mockTasks = createMockTasks();
  });

  afterEach(() => {
    httpMock.verify(); // Verifica  no pending http requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize default values', () => {
    expect(service['toDoTasks']).toEqual([]);
    expect(service['isShowForm']).toBeFalse();
  });

  it('should return a list of to do tasks', () => {
    service['toDoTasks'] = mockTasks;

    const toDoTasks = service.getToDoTasks();

    expect(toDoTasks.length).toBe(2);
  });

  it('should fetch a list of to do tasks', () => {
    service.fetchToDoTasks().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });

    // mock HTTP GET
    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('GET');

    //mock response
    req.flush(mockTasks);

    expect(service.getToDoTasks()).toEqual(mockTasks);
  });

  it('should get a to do task', () => {
    service['toDoTasks'] = mockTasks;

    service.getToDoTask(1).subscribe((actual) => {
      expect(actual).toEqual(mockTasks[1]);
    });
  });

  it('should not get a task if not exists', () => {
    service['toDoTasks'] = mockTasks;

    service.getToDoTask(10).subscribe((actual) => {
      expect(actual).toBeUndefined();
    });
  });

  it('should get a list of tasks', () => {
    service['toDoTasks'] = mockTasks;

    const actual = service.getToDoTasks();

    expect(actual).toEqual(mockTasks);
  });

  it('should set a list of tasks', () => {
    service['toDoTasks'] = mockTasks;

    expect(service['toDoTasks']).toEqual(mockTasks);
  });

  it('should add a to do tasks', () => {
    const newToDoTask: ToDoTask = new ToDoTask(null, 'Task 1', true);

    service.addToDoTask(newToDoTask);

    // mock HTTP POST
    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('POST');

    //mock response
    req.flush(mockTasks[0]);

    const actual = service['toDoTasks'][0];
    expect(actual.id).toEqual(mockTasks[0].id);
  });

  it('should update a to do tasks', () => {
    service['toDoTasks'] = mockTasks;

    const updateToDoTask: ToDoTask = new ToDoTask(
      null,
      'Update To Do Task',
      true
    );

    service.updateToDoTask(1, updateToDoTask);

    // mock HTTP POST
    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('PUT');

    //mock response
    updateToDoTask.id = 2;
    req.flush(updateToDoTask);

    service.getToDoTask(1).subscribe((updateToDoTask) => {
      expect(updateToDoTask).toEqual(mockTasks[1]);
      expect(mockTasks[1].title).toEqual('Update To Do Task');
    });
  });

  it('should delete a to do tasks', () => {
    service['toDoTasks'] = mockTasks;
    spyOn(service.toDoTaskChanged, 'next');

    service.deleteToDoTask(1);

    // mock HTTP DELETE
    const req = httpMock.expectOne(`${environment.apiUrl}/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(true);

    //mock response
    expect(service['toDoTasks'].length).toEqual(1);
    expect(service.toDoTaskChanged.next).toHaveBeenCalledTimes(1);
  });
});
