import { RouterModule, Routes } from '@angular/router';
import { ToDoTasksComponent } from './to-do-tasks/to-do-tasks.component';
import { ToDoTasksResolver } from './to-do-tasks/to-do-tasks-resolver.service';
import { NgModule } from '@angular/core';
import { ToDoTaskEditComponent } from './to-do-tasks/to-do-task-edit/to-do-task-edit.component';
import { ToDoTasksV2Component } from './to-do-tasks-v2/to-do-tasks-v2.component';
import { ToDoTaskCalendarComponent } from './to-do-tasks-v2/to-do-task-calendar/to-do-task-calendar.component';

/*
export const routes: Routes = [
  {
    path: '',
    component: ToDoTasksComponent,
    resolve: [ToDoTasksResolver],
    children: [
      {
        path: 'new',
        component: ToDoTaskEditComponent,
      },
      {
        path: ':id/edit',
        component: ToDoTaskEditComponent,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];*/

/*
const routes: Routes = [
  {
    path: '',
    component: ToDoTasksComponent,
    resolve: [ToDoTasksResolver],
    /*   children: [
      {
        path: ':id',
        component: ToDoTaskDetailComponent,
      },
    ],
  },
  {
    path: ':id',
    component: ToDoTasksComponent,
  },
];
*/
export const routes: Routes = [
  {
    path: '',
    component: ToDoTasksComponent,
    resolve: [ToDoTasksResolver],
    children: [
      {
        path: 'new',
        component: ToDoTaskEditComponent,
      },
      {
        path: ':id/edit',
        component: ToDoTaskEditComponent,
      },
    ],
  },
  {
    path: 'v2',
    component: ToDoTasksV2Component,
  },
  {
    path: 'v2/calendar',
    component: ToDoTaskCalendarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
