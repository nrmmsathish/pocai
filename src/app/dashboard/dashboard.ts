import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterConfig, GridsterModule } from 'angular-gridster2';
import { ChatComponent } from '../chat-component/chat-component';
import { ClientsContactWidgetComponent } from '../clients-contact-widget-component/clients-contact-widget-component';
import { CustomerInteractionsComponent } from '../customer-interactions-component/customer-interactions-component';
import { CioInsightsComponent } from '../cio-insights-component/cio-insights-component';
import { LeadsTableComponent } from '../leads-table-component/leads-table-component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [
    ChatComponent,
    CustomerInteractionsComponent,
    ClientsContactWidgetComponent,
    CioInsightsComponent,
    LeadsTableComponent,
    CommonModule,
    GridsterModule
  ],
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {
  constructor(public router: Router) {}
  options: GridsterConfig = {
    draggable: {
      enabled: true,
      ignoreContent: true,
      dragHandleClass: 'widget-header'
    },
    resizable: { enabled: true },
    minCols: 6,
    minRows: 4,
    maxCols: 12,
    maxRows: 8,
    pushItems: true,
    displayGrid: 'onDrag&Resize'
  };
  navOpen = false;
  showChat = false;
  isDarkTheme = true;
  activeTab: 'clients' | 'nba' | 'campaigns' | 'ideas' = 'clients';

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  minimizeItem(item: any) {
    item.rows = 1;
    item.cols = 1;
    item.minimized = true;
  }

  maximizeItem(item: any) {
    item.rows = 3;
    item.cols = 4;
    item.minimized = false;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
}