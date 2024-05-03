import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
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

  // How to add a new task into tasks with signals
  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newTask = input.value;
    // Recieves his last state and create a new state with the new task at the end of the list
    this.addTask(newTask)
    input.value = '';
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
  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((task, position) => position !== index));
  }
}
