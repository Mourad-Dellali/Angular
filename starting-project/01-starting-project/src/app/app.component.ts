import { Component } from '@angular/core';
import { HeaderComponent } from './header-component/header.component';
import { ServerStatusComponent } from './server-status-component/server-status.component';
import { TicketComponent } from './ticket-component/ticket.component';
import { TrafficComponent } from './traffic-component/traffic.component';
import { HeaderItemComponent } from "./header-item/header-item.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    ServerStatusComponent,
    TrafficComponent,
    TicketComponent,
    HeaderItemComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
