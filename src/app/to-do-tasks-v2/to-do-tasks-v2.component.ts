import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { KeyFilterModule } from 'primeng/keyfilter';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToDoTask } from '../shared/to-do-task.model';
import { ToDoTaskServiceV2 } from './to-do-tasks-v2.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ToDoTaskEditV2Component } from './to-do-task-edit-v2/to-do-task-edit-v2.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs/internal/operators/finalize';
import { tap } from 'rxjs/internal/operators/tap';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-to-do-tasks-v2',
  imports: [
    ButtonModule,
    KeyFilterModule,
    Toast,
    Ripple,
    TableModule,
    DialogModule,
    ToDoTaskEditV2Component,
    ProgressSpinnerModule,
    ToolbarModule,
  ],
  templateUrl: './to-do-tasks-v2.component.html',
  styleUrl: './to-do-tasks-v2.component.css',
  providers: [MessageService],
})
export class ToDoTasksV2Component implements OnInit {
  toDoTasks: ToDoTask[] = [];
  loading = true;
  visibleEdit: boolean = false;
  selectedTask: ToDoTask | null = null;
  saving: boolean = false;
  isEdit: boolean = false;
  selectedTasks: ToDoTask[] = [];

  constructor(
    private messageService: MessageService,
    private toDoTaskService: ToDoTaskServiceV2
  ) {}

  ngOnInit(): void {
    this.toDoTaskService.getToDoTasks().subscribe({
      next: (data) => {
        this.toDoTasks = data;
        this.loading = false;

        console.log(this.toDoTasks);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onEdit(task: ToDoTask) {
    this.isEdit = true;
    this.selectedTask = { ...task };
    this.visibleEdit = true;
  }

  onSave(updatedTask: ToDoTask) {
    this.saving = true;
    const request$ = this.isEdit
      ? this.toDoTaskService.updateToDoTask(updatedTask)
      : this.toDoTaskService.createToDoTask(updatedTask);

    request$
      .pipe(
        tap(() => console.log('Tap executed')),
        finalize(() => {
          console.log('Finalized');
          this.saving = false;
          this.visibleEdit = false;
        })
      )
      .subscribe({
        next: (savedTask) => this.handleSaveSuccess(savedTask),
        error: (ex) => this.handleSaveError(ex),
      });
  }

  private handleSaveSuccess(savedTask: ToDoTask) {
    if (this.isEdit) {
      this.messageService.add({
        severity: 'success',
        summary: 'Updated',
        detail: `Task "${savedTask.title}" updated successfully`,
        life: 3000,
      });
      const index = this.toDoTasks.findIndex((t) => t.id === savedTask.id);
      if (index > -1) {
        this.toDoTasks[index] = savedTask;
        console.log(savedTask);
      }
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Created',
        detail: `Task "${savedTask.title}" created successfully`,
        life: 3000,
      });
      this.toDoTasks.push(savedTask);
      console.log(savedTask);
    }
    this.toDoTasks = [...this.toDoTasks];
  }

  private handleSaveError(ex: any) {
    if (ex.error && ex.error.errors) {
      const validationErrors = Object.values(
        ex.error.errors
      ).flat() as string[];
      validationErrors.forEach((msg) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: msg,
          life: 4000,
        });
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update task',
        life: 3000,
      });
      console.log('Error occurred:', ex);
    }
  }

  onShow() {
    this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `deleted successfully`,
      life: 3000,
    });
  }

  onDelete(index: number) {
    let task = this.toDoTasks[index];
    this.toDoTaskService.deleteToDoTask(task.id!).subscribe({
      next: () => {
        this.toDoTasks.splice(index, 1);
        this.toDoTasks = this.toDoTasks.filter((t) => t.id !== task.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `Task "${task.title}" deleted successfully`,
          life: 3000,
        });
        console.log(`Deleted task with ID: ${task.id}`);
      },
      error: (ex) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete task',
          life: 3000,
        });
        console.log('Error occurred while deleting:', ex);
      },
    });

    console.log(`Deleting task with ID: ${task.id}`);
  }

  openNew() {
    this.isEdit = false;
    this.selectedTask = { id: 0, title: '', isDone: false };
    this.visibleEdit = true;
  }

  onDeleteSelected() {
    console.log(this.selectedTasks);
    let ids = this.selectedTasks.map((task) => task.id!);
    this.toDoTaskService.deleteMultipleToDoTask(ids).subscribe({
      next: () => {
        this.toDoTasks = this.toDoTasks.filter((t) => !ids.includes(t.id!));
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: `ToDoTasks deleted successfully`,
          life: 3000,
        });
        console.log(`Deleted tasks with IDs: ${ids.join(', ')}`);
      },
      error: (ex) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete tasks',
          life: 3000,
        });
        console.log('Error occurred while deleting:', ex);
      },
    });
  }
}
