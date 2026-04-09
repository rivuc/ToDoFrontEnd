import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToDoTask } from '../shared/to-do-task.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ToDoTaskServiceV2 {
  constructor(private http: HttpClient) {}

  getToDoTasks(): Observable<ToDoTask[]> {
    return this.http.get<ToDoTask[]>(environment.apiUrl);
  }

  createToDoTask(task: ToDoTask): Observable<ToDoTask> {
    return this.http.post<ToDoTask>(environment.apiUrl, task);
  }

  updateToDoTask(task: ToDoTask): Observable<ToDoTask> {
    return this.http.put<ToDoTask>(`${environment.apiUrl}`, task);
  }

  deleteToDoTask(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${id}`);
  }

  deleteMultipleToDoTask(ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/delete-multiple`, {
      ids: ids,
    });
  }
}
