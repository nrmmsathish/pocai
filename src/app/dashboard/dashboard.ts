import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  GridsterConfig,
  GridsterItem,
  GridsterItemComponentInterface
} from 'angular-gridster2';
import { GridsterModule } from 'angular-gridster2';
import { ChatComponent } from '../chat-component/chat-component';
import { ClientsContactWidgetComponent } from '../clients-contact-widget-component/clients-contact-widget-component';
import { CustomerInteractionsComponent } from '../customer-interactions-component/customer-interactions-component';
import { CioInsightsComponent } from '../cio-insights-component/cio-insights-component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [ ChatComponent,CustomerInteractionsComponent,ClientsContactWidgetComponent,CioInsightsComponent, CommonModule, GridsterModule],
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {
  options: GridsterConfig;
  navOpen = false;
  showChat = false;
  isDarkTheme = false;
  activeTab: 'clients' | 'nba' | 'campaigns' | 'ideas' = 'clients';

 
  constructor() {
    this.options = {
     draggable: {
      enabled: true,
      ignoreContent: true,
      dragHandleClass: 'widget-header' // <-- Only drag on icon!
    },
      resizable: { enabled: true },
      minCols: 6,
      minRows: 4,
      maxCols: 12,
      maxRows: 8,
      pushItems: true,
      displayGrid: 'onDrag&Resize'
    };


   
  }
  toggleNav() {
    this.navOpen = !this.navOpen;
  }


  minimizeItem(item: any) {
    item.rows = 1;
    item.cols = 1;
    item.minimized = true;
  }

  maximizeItem(item: any) {
    item.rows = 3; // or your preferred max
    item.cols = 4; // or your preferred max
    item.minimized = false;
  }
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
}