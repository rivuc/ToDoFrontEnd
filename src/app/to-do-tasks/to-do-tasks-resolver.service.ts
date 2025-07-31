import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { ToDoTask } from '../shared/to-do-task.model';
import { inject } from '@angular/core';
import { ToDoTaskService } from './to-do-tasks.service';

export const ToDoTasksResolver: ResolveFn<ToDoTask[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const toDoTasks = inject(ToDoTaskService).getToDoTasks();
  if (toDoTasks.length === 0) {
    return inject(ToDoTaskService).fetchToDoTasks();
  } else {
    return toDoTasks;
  }
};
