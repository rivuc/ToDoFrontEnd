import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { ToDoTask } from '../../shared/to-do-task.model';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToDoTaskServiceV2 } from '../to-do-tasks-v2.service';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-to-do-task-edit-v2',
  imports: [
    CommonModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ToggleSwitchModule,
  ],
  templateUrl: './to-do-task-edit-v2.component.html',
  styleUrl: './to-do-task-edit-v2.component.css',
})
export class ToDoTaskEditV2Component implements OnInit {
  @Input() visibleDialog = false;
  @Output() visibleDialogChange = new EventEmitter<boolean>();

  @Input() task: ToDoTask | null = null;
  @Output() save = new EventEmitter<ToDoTask>();

  saving: boolean = false;

  constructor(
    private messageService: MessageService,
    private toDoTaskService: ToDoTaskServiceV2
  ) {}

  ngOnInit(): void {
    //TODO: Se ejecuta por el numero de elementos
    console.log('Dialog initialized');
  }

  onSave(form: NgForm) {
    console.log('Form Invalid: ', form.invalid);
    if (this.task) {
      this.save.emit(this.task);
      //  this.closeDialog();
    } else {
      console.log('No task to save');
    }
  }

  closeDialog() {
    this.visibleDialogChange.emit(false);
  }
}
