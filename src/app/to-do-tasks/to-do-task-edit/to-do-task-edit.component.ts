import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToDoTaskService } from '../to-do-tasks.service';
import { ToDoTask } from '../../shared/to-do-task.model';
import { of, Subscription, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-to-do-task-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './to-do-task-edit.component.html',
  styleUrl: './to-do-task-edit.component.css',
})
export class ToDoTaskEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: false }) toDoForm: NgForm | undefined;
  editMode = false;
  editedItem: ToDoTask | undefined;
  subcription: Subscription | undefined;
  subcriptionPath: Subscription | undefined;
  showForm: boolean = true;
  itemId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private toDoTaskService: ToDoTaskService
  ) {}

  ngOnInit(): void {
    console.log('ToDoTaskEditComponent ngOnInit');

    this.subcriptionPath = this.route.params.subscribe((params: Params) => {
      const index = params['id'];
      if (index != null) {
        this.toDoTaskService.getToDoTask(index).subscribe((editedItem) => {
          this.toDoTaskService.selectedIndex = index;
          this.editMode = true;
          this.editedItem = editedItem;
          console.log(editedItem);

          setTimeout(() => {
            this.toDoForm?.setValue({
              title: this.editedItem?.title,
              isDone: this.editedItem?.isDone,
            });
          });
        });
      } else {
      }
    });
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    const value = form.value;
    const newTask = new ToDoTask(null, value.title, !!value.isDone);
    if (this.editMode) {
      this.toDoTaskService.updateToDoTask(
        this.toDoTaskService.selectedIndex ?? 0,
        newTask
      );
    } else {
      this.toDoTaskService.addToDoTask(newTask);
    }
    this.toDoTaskService.showForm(false);
    this.toDoTaskService.startedEditing.next(-1);
  }

  onClear() {
    this.toDoForm?.reset();
    this.editMode = false;
    this.toDoTaskService.showForm(false);
    this.toDoTaskService.startedEditing.next(-1);
    this.toDoTaskService.selectedIndex = null;
  }

  onCancel() {
    this.toDoTaskService.showForm(false);
    this.toDoTaskService.startedEditing.next(-1);
    console.log(this.editedItem);
  }

  onDelete() {
    this.toDoTaskService.deleteToDoTask(
      this.toDoTaskService.selectedIndex ?? -1
    );
    this.onClear();
  }

  showItemForm() {
    return this.toDoTaskService.isShowForm;
  }

  ngOnDestroy(): void {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
    if (this.subcriptionPath) {
      this.subcriptionPath.unsubscribe();
    }
  }
}
