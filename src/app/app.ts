import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from './chat-component/chat-component';
import { Dashboard } from './dashboard/dashboard';

@Component({
  selector: 'app-root',
  imports: [ChatComponent,Dashboard,RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pocai');
}
