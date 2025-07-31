import { RouterModule, Routes } from '@angular/router';
import { ToDoTasksComponent } from './to-do-tasks/to-do-tasks.component';
import { ToDoTasksResolver } from './to-do-tasks/to-do-tasks-resolver.service';
import { NgModule } from '@angular/core';
import { ToDoTaskEditComponent } from './to-do-tasks/to-do-task-edit/to-do-task-edit.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
