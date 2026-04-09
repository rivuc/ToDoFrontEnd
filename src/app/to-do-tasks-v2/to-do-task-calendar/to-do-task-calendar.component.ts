import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ToDoTask } from '../../shared/to-do-task.model';
import { ToDoTaskEditV2Component } from '../to-do-task-edit-v2/to-do-task-edit-v2.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-to-do-task-calendar',
  imports: [
    CommonModule,
    RouterOutlet,
    FullCalendarModule,
    ToDoTaskEditV2Component,
  ],

  templateUrl: './to-do-task-calendar.component.html',
  styleUrl: './to-do-task-calendar.component.css',
  providers: [MessageService],
})
export class ToDoTaskCalendarComponent {
  toDoTasks: ToDoTask[] = [];
  loading = true;
  visibleEdit: boolean = false;
  selectedTask: ToDoTask | null = null;
  saving: boolean = false;
  isEdit: boolean = false;
  selectedTasks: ToDoTask[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),

    contentHeight: 'auto',
  };

  handleDateClick(arg: any) {
    // alert('date click! ' + arg.dateStr);
    console.log(arg);
    this.visibleEdit = true;
  }

  onSave(updatedTask: ToDoTask) {
    console.log('Save');
    /*
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
        */
  }
}
