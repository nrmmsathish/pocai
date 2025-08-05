import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';

interface Lead {
  name: string;
  interest: string;
  quality: string;
  rm: string;
  daysToConvert: number;
  contactMode: string;
  segment: string;
  estimatedAUM: number;
  location: string;
  lastActivity: string;
  referralSource: string;
  notes: string;
}

@Component({
  selector: 'app-leads-table',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './leads-table-component.html',
  styleUrls: ['./leads-table-component.scss']

})
export class LeadsTableComponent {
  gridOptions: GridOptions;
  constructor() {
    this.gridOptions = {
      defaultColDef: {
        resizable: true,
        minWidth: 80,
        flex: 1
      },
      onGridReady: (params: any) => {
        params.api.sizeColumnsToFit();
      }
    };
  }
  columnDefs: ColDef<Lead>[] = [
    { headerName: 'Lead Name', field: 'name', minWidth: 140 },
    { headerName: 'Segment', field: 'segment', minWidth: 110 },
    { headerName: 'Interest', field: 'interest', minWidth: 120 },
    { headerName: 'Estimated AUM', field: 'estimatedAUM', minWidth: 130, valueFormatter: ({ value }: any) => value ? `$${value.toLocaleString()}` : '' },
    { headerName: 'Location', field: 'location', minWidth: 110 },
    {
      headerName: 'Quality (AI)', field: 'quality', minWidth: 110, cellRenderer: ({ value }: any) =>
        `<span style="font-weight:600;color:${value === 'High' ? '#2ecc71' : value === 'Medium' ? '#ffb347' : '#ff5a5f'}">${value}</span>`
    },
    { headerName: 'Bank RM', field: 'rm', minWidth: 120 },
    { headerName: 'Referral Source', field: 'referralSource', minWidth: 120 },
    { headerName: 'Last Activity', field: 'lastActivity', minWidth: 120 },
    { headerName: 'Days to Convert', field: 'daysToConvert', minWidth: 120, valueFormatter: ({ value }: any) => value ? `${value} days` : '' },
    {
      headerName: 'Notes',
      field: 'notes',
      minWidth: 160,
      cellRenderer: ({ value }: any) =>
        `<span title="${value}">${value.length > 40 ? value.slice(0, 40) + '...' : value}</span>`
    },
    {
      headerName: 'Preferred Contact',
      field: 'contactMode',
      minWidth: 140,
      cellRenderer: ({ value }: any) => {
        switch (value) {
          case 'WhatsApp':
            return `<img src="WhatsApp.svg" alt="WhatsApp" width="22" height="22" style="vertical-align:middle;" title="WhatsApp" />`;
          case 'Email':
            return `<img src="Outlook.svg" alt="Outlook" width="22" height="22" style="vertical-align:middle;" title="Email" />`;
          case 'Call':
            return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;" title="Call">
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" stroke="#3cb371" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`;
          case 'Zoom':
            return `<img src="zoom.svg" alt="Zoom" width="22" height="22" style="vertical-align:middle;" title="Zoom" />`;
          default:
            return `<span style="color:#888;">${value}</span>`;
        }
      }
    }

  ];

  rowData = [
    {
      name: 'Priya Sharma',
      segment: 'Ultra-HNI',
      interest: 'Mutual Funds',
      estimatedAUM: 2500000,
      location: 'Mumbai',
      quality: 'High',
      rm: 'Amit Verma',
      referralSource: 'Existing Client',
      lastActivity: 'Call - 2 days ago',
      daysToConvert: 12,
      contactMode: 'WhatsApp',
      notes: 'Interested in ESG funds, prefers digital onboarding.'
    },
    {
      name: 'Rahul Jain',
      segment: 'HNI',
      interest: 'Wealth Planning',
      estimatedAUM: 1200000,
      location: 'Delhi',
      quality: 'Medium',
      rm: 'Sneha Rao',
      referralSource: 'Event',
      lastActivity: 'Email - 1 day ago',
      daysToConvert: 20,
      contactMode: 'Email',
      notes: 'Requested portfolio simulation, prefers weekend meetings.'
    },
    {
      name: 'Neha Gupta',
      segment: 'NRI',
      interest: 'NRI Banking',
      estimatedAUM: 1800000,
      location: 'Dubai',
      quality: 'High',
      rm: 'Rohit Singh',
      referralSource: 'Website',
      lastActivity: 'WhatsApp - Today',
      daysToConvert: 8,
      contactMode: 'Call',
      notes: 'Needs tax advisory, prefers WhatsApp updates.'
    },
    {
      name: 'Vikram Patel',
      segment: 'HNI',
      interest: 'Portfolio Review',
      estimatedAUM: 950000,
      location: 'Ahmedabad',
      quality: 'Low',
      rm: 'Amit Verma',
      referralSource: 'Referral',
      lastActivity: 'Zoom - 3 days ago',
      daysToConvert: 30,
      contactMode: 'Zoom',
      notes: 'Low engagement, prefers face-to-face.'
    },
    {
      name: 'Sonal Mehta',
      segment: 'Ultra-HNI',
      interest: 'Insurance',
      estimatedAUM: 3000000,
      location: 'Bangalore',
      quality: 'Medium',
      rm: 'Sneha Rao',
      referralSource: 'Social Media',
      lastActivity: 'Call - 5 days ago',
      daysToConvert: 18,
      contactMode: 'WhatsApp',
      notes: 'Interested in premium health cover.'
    }
  ];
}
