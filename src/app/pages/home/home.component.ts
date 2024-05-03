import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal([
    'Instalar Angular CLI',
    'Crear proyecto',
    'Crear componentes',
    'Crear servicio',
  ]);

  // How to add a new task into tasks with signals
  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const newTask = input.value;
    // Recieves his last state and create a new state with the new task at the end of the list
    this.tasks.update((tasks) => [...tasks, newTask]);
    input.value = '';
  }

  // How to delete a task
  // Recieves the position of the element
  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((task, position) => position !== index));
  }
}
