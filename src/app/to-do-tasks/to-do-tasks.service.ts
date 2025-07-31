import { Injectable } from '@angular/core';
import { ToDoTask } from '../shared/to-do-task.model';
import { Observable, of, Subject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ToDoTaskService {
  constructor(private http: HttpClient) {}

  private toDoTasks: ToDoTask[] = [];
  toDoTaskChanged = new Subject<ToDoTask[]>();
  startedEditing = new Subject<number>();
  isShowForm: boolean = false;
  selectedIndex: number | null = null;

  fetchToDoTasks(): Observable<ToDoTask[]> {
    return this.http.get<ToDoTask[]>(environment.apiUrl).pipe(
      tap((tasks) => {
        this.setToDoTasks(tasks);
      })
    );
  }

  getToDoTask(index: number): Observable<ToDoTask> {
    return of(this.toDoTasks[index]);
  }

  getToDoTasks(): ToDoTask[] {
    return this.toDoTasks.slice();
  }

  getToDoTasks2(): Observable<ToDoTask[]> {
    return of(this.toDoTasks.slice());
  }

  setToDoTasks(toDoTasks: ToDoTask[]) {
    this.toDoTasks = toDoTasks;
  }

  addToDoTask(toDoTask: ToDoTask) {
    return this.http
      .post<ToDoTask>(environment.apiUrl, toDoTask)
      .subscribe((response) => {
        console.log(response);
        this.toDoTasks.push(response);
        this.toDoTaskChanged.next(this.toDoTasks.slice());
      });
  }

  updateToDoTask(index: number, ToDoTask: ToDoTask) {
    let item = this.getToDoTask(index).subscribe((item) => {
      ToDoTask.id = item.id;
      return this.http
        .put<ToDoTask>(environment.apiUrl, ToDoTask)
        .subscribe((response) => {
          this.toDoTasks[index] = response;
          this.toDoTaskChanged.next(this.toDoTasks.slice());
        });
    });
  }

  deleteToDoTask(index: number) {
    this.getToDoTask(index).subscribe((item) => {
      return this.http
        .delete<boolean>(`${environment.apiUrl}/${item.id}`)
        .subscribe(() => {
          this.toDoTasks.splice(index, 1);
          this.toDoTaskChanged.next(this.toDoTasks.slice());
        });
    });
  }

  showForm(show: boolean) {
    this.isShowForm = show;
  }
}
