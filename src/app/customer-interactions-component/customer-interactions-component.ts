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
    { headerName: 'Notes', field: 'notes', filter: true },
    { headerName: 'Next Best Action', field: 'nextBestAction', filter: true, sortable: true },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: (params: any) => `
        <span class="action-icon" title="Complete" data-action="Completed" data-row="${params.rowIndex}">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#3cb371"/>
            <path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" fill="none"/>
          </svg>
        </span>
        <span class="action-icon" title="Schedule" data-action="Scheduled" data-row="${params.rowIndex}">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <rect x="4" y="6" width="16" height="14" rx="3" fill="#ffd700"/>
            <path d="M8 10h8v2H8z" fill="#fff"/>
          </svg>
        </span>
        <span class="action-icon" title="Pending" data-action="Pending" data-row="${params.rowIndex}">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="#2d8cff"/>
            <circle cx="12" cy="12" r="5" fill="#fff"/>
          </svg>
        </span>
      `
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