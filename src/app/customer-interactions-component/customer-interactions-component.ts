import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, themeQuartz } from 'ag-grid-community';

interface Interaction {
  type: string;
  category: string;
  client: string;
  date: string;
  status: string;
  notes: string;
  nextBestAction: string;
  action: string;
}

@Component({
  selector: 'app-customer-interactions',
  imports: [CommonModule, AgGridModule],
  standalone: true,
  templateUrl: './customer-interactions-component.html',
  styleUrl: './customer-interactions-component.scss'
})
export class CustomerInteractionsComponent {
  theme = themeQuartz;
  gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true,
      minWidth: 80,
      flex: 1
    },
    onGridReady: (params: any) => {
      params.api.sizeColumnsToFit();
    }
  };

  columnDefs: ColDef<Interaction>[] = [
    { headerName: 'Type', field: 'type', filter: true, sortable: true },
    {
      headerName: 'Category',
      field: 'category',
      filter: true,
      sortable: true,
      cellClass: () => 'category-highlight'
    },
    { headerName: 'Client', field: 'client', filter: true, sortable: true },
    {
      headerName: 'Date',
      field: 'date',
      filter: true,
      sortable: true,
      valueFormatter: params => {
        if (!params.value) return '';
        const date = new Date(params.value);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).replace(/ /g, ' ');
      }
    },
    { headerName: 'Status', field: 'status', filter: true, sortable: true },
    {
      headerName: 'Notes', field: 'notes', filter: true, cellRenderer: ({ value }: any) =>
        `<span title="${value}">${value.length > 40 ? value.slice(0, 40) + '...' : value}</span>`
    },

    {
      headerName: 'Next Best Action', field: 'nextBestAction', filter: true, sortable: true, cellRenderer: ({ value }: any) =>
        `<span title="${value}">${value.length > 40 ? value.slice(0, 40) + '...' : value}</span>`
    },
    {
      headerName: 'Reach Client',
      cellRenderer: () => `
          <div class="reach-client-actions">
            <span title="Call (AI Listen)" class="reach-btn call-btn">
              <svg style="vertical-align: sub;" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" stroke="#3cb371" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
           <span title="WhatsApp" class="reach-btn whatsapp-btn">
        <img src="WhatsApp.svg" alt="WhatsApp" width="22" height="22" style="vertical-align:middle;border-radius:4px;" />
      </span>
            <span title="Email" class="reach-btn email-btn">
            <img src="Outlook.svg" alt="Email" width="18" height="18" style="vertical-align:middle;border-radius:4px;" />
      
            </span>
            <span   title="Zoom (AI Listen)" class="reach-btn zoom-btn">
              <img src="zoom.svg" alt="Email" width="18" height="18" style="vertical-align:middle;border-radius:4px;" />
            </span>
          </div>
        `,
      sortable: false,
      filter: false,
      minWidth: 180
    }
  ];

  interactions: Interaction[] = [
    {
      type: 'Service Request',
      category: 'Update Risk Profile',
      client: 'Alice Johnson',
      date: '2024-07-28',
      status: 'Completed',
      notes: 'Risk profile updated to Balanced.',
      nextBestAction: 'Schedule annual review.',
      action: 'Completed'
    },
    {
      type: 'Service Request',
      category: 'Generate Performance Report',
      client: 'Bob Smith',
      date: '2024-07-29',
      status: 'Pending',
      notes: 'Requested Q2 performance report.',
      nextBestAction: 'Send report and offer portfolio review.',
      action: 'Pending'
    },
    {
      type: 'Transaction',
      category: 'Buy Mutual Fund',
      client: 'Eva Green',
      date: '2024-07-30',
      status: 'Scheduled',
      notes: 'Client interested in ESG MF.',
      nextBestAction: 'Share fund details and confirm purchase.',
      action: 'Scheduled'
    },
    {
      type: 'Transaction',
      category: 'Buy Bond',
      client: 'David Kim',
      date: '2024-07-27',
      status: 'Completed',
      notes: 'Purchased government bond.',
      nextBestAction: 'Send confirmation and suggest diversification.',
      action: 'Completed'
    },
    {
      type: 'Query/Feedback',
      category: 'Feedback on Recent Purchase',
      client: 'Carol Lee',
      date: '2024-07-26',
      status: 'Completed',
      notes: 'Satisfied with recent MF purchase.',
      nextBestAction: 'Recommend similar products.',
      action: 'Completed'
    },
    {
      type: 'Query/Feedback',
      category: 'Query on Charges',
      client: 'Frank Miller',
      date: '2024-07-25',
      status: 'Pending',
      notes: 'Asked about transaction charges.',
      nextBestAction: 'Clarify charges and offer cost-saving tips.',
      action: 'Pending'
    }
  ];

  ideas = [
    { type: 'Birthday', client: 'Alice Johnson', date: '2024-08-02', action: 'Send personalized wishes and offer a special portfolio review.' },
    { type: 'Anniversary', client: 'Bob Smith', date: '2024-08-10', action: 'Congratulate and discuss long-term investment goals.' },
    { type: 'Portfolio Review', client: 'Carol Lee', date: '2024-08-15', action: 'Schedule a review meeting and share performance insights.' },
    { type: 'Performance Checkpoint', client: 'David Kim', date: '2024-08-20', action: 'Share quarterly performance and suggest rebalancing.' },
    { type: 'Birthday', client: 'Eva Green', date: '2024-08-05', action: 'Send birthday greetings and offer a complimentary financial health check.' },
    { type: 'Anniversary', client: 'Frank Miller', date: '2024-08-12', action: 'Send anniversary wishes and discuss new investment opportunities.' },
    { type: 'Portfolio Review', client: 'Grace Lee', date: '2024-08-18', action: 'Invite for portfolio review and discuss diversification.' },
    { type: 'Performance Checkpoint', client: 'Henry Ford', date: '2024-08-22', action: 'Share performance summary and suggest next steps.' }
  ];

  selectedCategory: string = 'Engagement Idea';
  categorySummary = [
    { type: 'Service Request', count: 0 },
    { type: 'Engagement Idea', count: 0 },
    { type: 'Transaction', count: 0 },
    { type: 'Query/Feedback', count: 0 }
  ];

  showCategoryPopup = false;
  popupCategoryType = '';
  popupCategoryInteractions: Interaction[] = [];

  constructor() {
    this.mergeIdeasWithInteractions();
    this.updateCategorySummary();
  }

  ngOnInit() {
    document.addEventListener('click', (e: any) => {
      if (e.target && e.target.closest('.action-icon')) {
        const icon = e.target.closest('.action-icon');
        const rowIndex = Number(icon.getAttribute('data-row'));
        const action = icon.getAttribute('data-action');
        const item = this.filteredInteractions[rowIndex];
        if (item) {
          item.action = action;
          item.status = action;
        }
      }
    });
  }

  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }

  mergeIdeasWithInteractions() {
    const ideasAsInteractions: Interaction[] = this.ideas.map(idea => ({
      type: 'Engagement Idea',
      category: idea.type,
      client: idea.client,
      date: idea.date,
      status: 'Planned',
      notes: idea.action,
      nextBestAction: idea.action,
      action: 'Planned'
    }));
    this.interactions = [...this.interactions, ...ideasAsInteractions];
  }

  updateCategorySummary() {
    this.categorySummary.forEach(cat => {
      cat.count = this.interactions.filter(i => i.type === cat.type).length;
    });
  }

  openCategoryPopup(type: string) {
    this.popupCategoryType = type;
    this.popupCategoryInteractions = this.interactions.filter(i => i.type === type);
    this.showCategoryPopup = true;
  }

  closeCategoryPopup() {
    this.showCategoryPopup = false;
  }

  filterByCategory(type: string) {
    this.selectedCategory = type;
  }

  get filteredInteractions(): Interaction[] {
    if (this.selectedCategory === 'All') return this.interactions;
    return this.interactions.filter(i => i.type === this.selectedCategory);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, ' ');
  }
}