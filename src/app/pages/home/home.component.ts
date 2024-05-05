import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Filters } from '../../models/filters.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([
    {
      id: Date.now(),
      title: 'Crear proyecto',
      completed: false
    },
    {
      id: Date.now(),
      title: 'Crear componentes',
      completed: false
    },
    {
      id: Date.now(),
      title: 'Crear servicio',
      completed: false
    },
  ]);

  Filters = Filters;
  currentFilter = signal<Filters>(Filters.All);
  tasksByFilter = computed(() => {
    const filter = this.currentFilter();
    const tasks = this.tasks();

    const filterMap: Record<Filters, () => Task[]> = {
      [Filters.Completed]: () => tasks.filter((task) => task.completed),
      [Filters.Pending]: () => tasks.filter((task) => !task.completed),
      [Filters.All]: () => tasks,
    }

    return filterMap[filter]();
  });

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern('^\\S.*$'),
      Validators.minLength(3)
    ]
  });

  // How to add a new task into tasks with signals
  changeHandler() {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();
      this.addTask(value);
      this.newTaskCtrl.setValue('');
    }
  }

  // Separates responsabilities and how to add an object to a signal
  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      completed: false
    }
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  updateTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position == index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      });
    })
  }

  toggleComplete(index: number) {
    this.tasks.update(tasks => {
      tasks[index] && (tasks[index].completed = !tasks[index].completed)
      return tasks;
    })
  }

  // How to delete a task
  // Recieves the position of the element
  deleteTask(id: number) {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  updateTaskEditingMode(index: number) {
    this.tasks.update(prevState => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            isEditing: true
          }
        }
        return {
          ...task,
          isEditing: false
        };
      });
    });
  }

  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const newTitle = input.value;
    this.tasks.update(prevState => {
      return prevState.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: newTitle,
            isEditing: false
          }
        }
        return task;
      });
    });
  }

  changeFilter(filter: Filters) {
    this.currentFilter.set(filter);
  }
}
