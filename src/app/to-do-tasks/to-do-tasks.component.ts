import { Component, OnInit } from '@angular/core';
import { ToDoTaskService } from './to-do-tasks.service';
import { ToDoTask } from '../shared/to-do-task.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-to-do-task',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './to-do-tasks.component.html',
  styleUrl: './to-do-task.component.css',
})
export class ToDoTasksComponent implements OnInit {
  toDoTasks: ToDoTask[] = [];
  selectedTaskIndex: number | undefined;
  loading = true;

  constructor(
    private toDoTaskService: ToDoTaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.toDoTasks = this.toDoTaskService.getToDoTasks();
    //Subscribe to update the list of To Do Tasks
    this.toDoTaskService.toDoTaskChanged.subscribe((toDoTasks: ToDoTask[]) => {
      this.toDoTasks = toDoTasks;
    });

    //Subscribe to update index
    this.toDoTaskService.startedEditing.subscribe((index: number) => {
      this.toDoTaskService.selectedIndex = index;
      this.selectedTaskIndex = index;
    });
    console.log('ToDoTasksComponent');
  }

  onEditTask(i: number) {
    console.log(i);
    this.router.navigate([i, 'edit'], {
      relativeTo: this.route,
    });
    this.toDoTaskService.startedEditing.next(i);
    this.toDoTaskService.showForm(true);
  }

  onNewTask() {
    this.router.navigate(['new'], { relativeTo: this.route });
    this.toDoTaskService.showForm(true);
    //this.toDoTaskService.selectedIndex = null;
    this.toDoTaskService.startedEditing.next(-1);
  }

  getIndex() {
    return this.selectedTaskIndex;
  }
}
