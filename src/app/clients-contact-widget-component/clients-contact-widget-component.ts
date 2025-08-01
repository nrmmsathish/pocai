import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions, themeQuartz } from 'ag-grid-community';
import { FormsModule } from '@angular/forms';


interface Client {
  name: string;
  tier: string;
  aum: number;
  aumTrend: string;
  nnia: number;
  nniaTrend: string;
  reason: string;
  lastContact: string;
  riskProfile?: string;
  lastTransactionAmount?: number;
  portfolioDiversification?: number;
  complianceFlag?: boolean;
  taxResidency?: string;
  customTags?: string[];
  priority?: string; // Add priority field
}
@Component({
  selector: 'app-clients-contact-widget-component',
  imports: [CommonModule, AgGridModule, FormsModule],
  standalone: true,
  templateUrl: './clients-contact-widget-component.html',
  styleUrl: './clients-contact-widget-component.scss'
})
export class ClientsContactWidgetComponent {
  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {
    this.gridOptions = {
      defaultColDef: {
        resizable: true,
        minWidth: 80,
        flex: 1 // auto-size columns based on available space
      },
      onGridReady: (params: any) => {
        params.api.sizeColumnsToFit();
      }
    };
  }
  isMobile = window.innerWidth <= 600;

  showReasonTooltip = false;
  recentArticles?: { title: string; url: string; readDate?: string }[];
  isActiveInvestor?: boolean;
  gridOptions: GridOptions;
  mailTemplates = [
    { id: 'welcome', name: 'Welcome Email', body: 'Dear {{name}},\n\nWelcome to our Private Wealth service...' },
    { id: 'review', name: 'Portfolio Review', body: 'Dear {{name}},\n\nWe would like to schedule a review of your portfolio...' },
    { id: 'custom', name: 'Custom Template', body: '' }
  ];
  selectedTemplate = 'welcome';
  mailTemplate = '';
  clientSummaryText: string = '';
  talkingPointsList: string[] = [];
  activeTab: 'summary' | 'talking' = 'summary';
  showMailPopup = false;
  showWhatsappPopup = false;
  aiTypingIndex = 0;
  aiTypingPoints: { text: string, typing: boolean }[] = [];
  private aiTypingTimeouts: number[] = [];


  mailRecipient = '';
  mailFrom = 'sathish.virattiswaran@bank.com';
  mailCc = 'sathish.virattiswaran@bank.com';
  mailTo = '';
  mailBcc = 'mail.audit@bank.com';
  mailSubject = '';
  showZoomPopup = false;
  zoomTopic = '';
  zoomDateTime = '';
  zoomInvitees = '';
  zoomMessage = '';
  whatsappRecipient = '';
  whatsappMessages: { from: string, text: string }[] = [];
  whatsappInput = '';
  userSignature = 'Best regards,\nJohn Doe\nPrivate Wealth Advisor';
  showCallPopup = false;
  callRecipient = '';
  callStatus = 'Calling...';
  listening = false;


  theme = themeQuartz; // Use the material theme
  tiers = ['Platinum', 'Gold', 'Silver', 'Bronze'];
  columnDefs: ColDef<Client>[] = [
    {
      headerName: 'Name',
      field: 'name',
      filter: 'agTextColumnFilter',
      cellRenderer: (params: any) => {
        return `<a class="client-link" style="color:#193b6a;text-decoration:underline;cursor:pointer;" data-row-index="${params.rowIndex}">${params.value}</a>`;
      },
      minWidth: 120
    },
    {
      headerName: 'Tier',
      field: 'tier',
      filter: 'agTextColumnFilter',
      cellRenderer: (params: any) => {
        const tier = params.value;
        let color = '#444'; // Default muted dark gray
        if (tier === 'Platinum') {
          color = '#2d8cff'; // Muted blue
        } else if (tier === 'Gold') {
          color = '#bfa600'; // Muted gold
        } else if (tier === 'Silver') {
          color = '#7d7d7d'; // Muted silver
        } else if (tier === 'Bronze') {
          color = '#a67c52'; // Muted bronze
        }
        return `<span style="font-weight:500;color:${color};border-radius:8px;padding:4px 14px;display:inline-block;">${tier}</span>`;
      },
      minWidth: 110
    },
    {
      headerName: 'Investment AUM',
      field: 'aum',
      filter: 'agNumberColumnFilter',
      cellRenderer: (params: any) => {
        const value = params.value ? `$${params.value.toLocaleString()}` : '';
        const trend = params.data?.aumTrend; // 'up' or 'down'
        let icon = '';
        if (trend === 'up') {
          // Up arrow icon
          icon = `<svg width="16" height="16" style="vertical-align:middle">
        <polygon points="8,3 13,11 3,11" fill="#3cb371"/>
      </svg>`;
        } else if (trend === 'down') {
          // Down arrow icon
          icon = `<svg width="16" height="16" style="vertical-align:middle">
        <polygon points="8,13 13,5 3,5" fill="#d9534f"/>
      </svg>`;
        }
        return `${value} ${icon}`;
      }
    },
    {
      headerName: 'L12M NNIA',
      field: 'nnia',
      filter: 'agNumberColumnFilter',
      cellRenderer: (params: any) => {
        const value = params.value ? `$${params.value.toLocaleString()}` : '';
        const trend = params.data?.nniaTrend; // 'up' or 'down'
        let icon = '';
        if (trend === 'up') {
          // Up arrow icon
          icon = `<svg width="16" height="16" style="vertical-align:middle">
        <polygon points="8,3 13,11 3,11" fill="#3cb371"/>
      </svg>`;
        } else if (trend === 'down') {
          // Down arrow icon
          icon = `<svg width="16" height="16" style="vertical-align:middle">
        <polygon points="8,13 13,5 3,5" fill="#d9534f"/>
      </svg>`;
        }
        return `${value} ${icon}`;
      }
    },
    { headerName: 'Reason', field: 'reason', filter: 'agTextColumnFilter' },
    {
      //    headerName: `<span style="display:flex;align-items:center;gap:6px;">
      //   <img src="aiIcon.png" alt="AI Icon" style="height:20px;width:20px;vertical-align:middle;margin-right:6px;">
      //   Priority
      // </span>`,
      headerName: 'Priority',
      field: 'priority',
      filter: 'agTextColumnFilter',
      sortable: true,
      // headerComponentParams: { suppressHtmlEscaping: false }, // <-- Add this line
      minWidth: 80,
      sort: 'asc', // Ensure descending sort (High > Medium > Low)
      comparator: (valueA: string, valueB: string) => {
        const order: Record<'High' | 'Medium' | 'Low', number> = { High: 3, Medium: 2, Low: 1 };
        return (order[valueB as 'High' | 'Medium' | 'Low'] || 0) - (order[valueA as 'High' | 'Medium' | 'Low'] || 0);
      },
      cellRenderer: (params: any) => {
        const value = params.value || 'Medium';
        let color = '#ff5a5f';      // High: Vibrant coral red
        let bg = '#ffeaea';
        if (value === 'High') {
          color = '#ff5a5f';
          bg = '#ffeaea';
        } else if (value === 'Medium') {
          color = '#ffb347';        // Medium: Warm amber
          bg = '#fff7e6';
        } else if (value === 'Low') {
          color = '#2ecc71';        // Low: Fresh green
          bg = '#eafaf1';
        }
        return `<span style="font-weight:600;color:${color};border-radius:8px;padding:2px 12px;">${value}</span>`;
      }
    },
    {
      headerName: 'Risk Profile',
      field: 'riskProfile',
      filter: 'agTextColumnFilter',
      minWidth: 120,
      cellRenderer: (params: any) => {
        const risk = params.value || 'Balanced';
        let color = '#6c757d'; // Neutral gray for Balanced
        if (risk === 'Aggressive') color = '#b8860b'; // Muted dark yellow
        else if (risk === 'Conservative') color = '#228b22'; // Muted green
        return `<span style="font-weight:600;color:${color};">${risk}</span>`;
      }
    },
    {
      headerName: 'Last Txn Amount',
      field: 'lastTransactionAmount',
      filter: 'agNumberColumnFilter',
      minWidth: 140,
      valueFormatter: params => params.value ? `$${params.value.toLocaleString()}` : ''
    },
    {
      headerName: 'Diversification',
      field: 'portfolioDiversification',
      filter: 'agNumberColumnFilter',
      minWidth: 120,
      valueFormatter: params => params.value ? `${params.value} assets` : ''
    },

    {
      headerName: 'Tax Residency',
      field: 'taxResidency',
      filter: 'agTextColumnFilter',
      minWidth: 120
    },
    {
      headerName: 'Tags',
      field: 'customTags',
      filter: 'agTextColumnFilter',
      minWidth: 160,
      cellRenderer: (params: any) => {
        return Array.isArray(params.value)
          ? params.value.map((tag: any) => `<span style="background:#e3f0ff;color:#193b6a;border-radius:6px;padding:2px 8px;margin-right:4px;font-size:0.95em;">${tag}</span>`).join('')
          : '';
      }
    },
    {
      headerName: 'Last Contact',
      field: 'lastContact',
      filter: 'agDateColumnFilter',
      valueFormatter: params => {
        if (!params.value) return '';
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`; // dd mmm yyyy
      },
      cellRenderer: (params: { value: string | number | Date; }) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        const formatted = `${date.getDate().toString().padStart(2, '0')} ${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;
        const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return `<span title="Time: ${time}">${formatted}</span>`;
      }
    },
    {
      headerName: 'Reach Client',
      cellRenderer: () => `
    <div class="reach-client-actions">
      <span title="Call" class="reach-btn call-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1v3.5a1 1 0 01-1 1C7.61 22 2 16.39 2 9.5a1 1 0 011-1H6.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z" stroke="#3cb371" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </span>
      </span>
      <span title="WhatsApp" class="reach-btn whatsapp-btn">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="16" fill="#25D366"/>
          <path d="M22.5 19.5c-.5-.25-1.5-.75-1.75-.75-.25 0-.5.25-.75.5-.25.25-.75.75-1 1-.25.25-.5.25-.75.25-.25 0-.5-.25-.75-.5-1.25-1-2.25-2-3.25-3.25-.25-.25-.5-.5-.5-.75 0-.25.25-.5.25-.75.25-.25.5-.5.5-.75 0-.25-.25-.5-.5-.75-.25-.25-.5-.5-.75-.5-.25 0-.5.25-.75.5-.25.25-.75.75-1 1-.25.25-.25.5-.25.75 0 .25.25.5.5.75 1.25 1.25 2.25 2.25 3.25 3.25.25.25.5.5.75.5.25 0 .5-.25.75-.5.25-.25.75-.75 1-1 .25-.25.25-.5.25-.75 0-.25-.25-.5-.5-.75z" fill="#fff"/>
        </span>
      </span>
      <span title="Email" class="reach-btn email-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="#193b6a" stroke-width="2"/>
          <path d="M3 7l9 6 9-6" stroke="#193b6a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span title="Zoom (AI Listen)" class="reach-btn zoom-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="7" width="13" height="10" rx="2" stroke="#2D8CFF" stroke-width="2"/>
          <path d="M21 7v10l-5-5V12l5-5z" fill="#2D8CFF"/>
          <circle cx="9.5" cy="12" r="1.5" fill="#2D8CFF"/>
        </svg>
      </span>
    </div>
  `,
      sortable: false,
      filter: false,
      minWidth: 180
    }
  ];
  rowData = [
    {
      name: 'Alice Johnson',
      tier: 'Platinum',
      aum: 12000000,
      aumTrend: 'up',
      nnia: 350000,
      nniaTrend: 'up',
      reason: 'Portfolio review',
      lastContact: '2025-07-10T09:30:00',
      riskProfile: 'Balanced',
      lastTransactionAmount: 500000,
      portfolioDiversification: 7,
      lastContactSummary: 'Discussed portfolio rebalancing and agreed to increase allocation to ESG funds. Client requested follow-up on new market opportunities.',
      complianceFlag: false,
      taxResidency: 'Singapore',
      customTags: ['ESG', 'Succession'],
      priority: 'High',
      recentArticles: [
        { title: 'Global Markets Rally', url: 'https://www.ft.com/content/markets-rally', readDate: '2025-07-08' },
        { title: 'ESG Investing Trends', url: 'https://www.bloomberg.com/esg-trends', readDate: '2025-07-05' }
      ],
      isActiveInvestor: true
    },
    {
      name: 'Bob Smith',
      tier: 'Gold',
      aum: 8000000,
      aumTrend: 'down',
      nnia: 210000,
      nniaTrend: 'down',
      reason: 'New product',
      lastContact: '2025-06-22T14:15:00',
      riskProfile: 'Conservative',
      lastTransactionAmount: 200000,
      lastContactSummary: 'Explained new product features. Client expressed interest but requested more details before making a decision.',
      portfolioDiversification: 5,
      complianceFlag: true,
      taxResidency: 'India',
      priority: 'Medium',
      customTags: ['NRI', 'Family Office'],
      recentArticles: [
        { title: 'India Wealth Outlook', url: 'https://www.economictimes.com/wealth-outlook', readDate: '2025-06-20' }
      ],
      isActiveInvestor: false
    },
    {
      name: 'Carol Lee',
      tier: 'Silver',
      aum: 3200000,
      aumTrend: 'up',
      nnia: 95000,
      nniaTrend: 'up',
      reason: 'Annual check-in',
      lastContact: '2025-07-01T11:00:00',
      riskProfile: 'Balanced',
      lastContactSummary: 'Annual check-in completed. Reviewed performance and set goals for next quarter.',
      lastTransactionAmount: 120000,
      portfolioDiversification: 4,
      complianceFlag: false,
      taxResidency: 'Hong Kong',
      priority: 'Low',
      customTags: ['Real Estate'],
      recentArticles: [
        { title: 'Property Investment Guide', url: 'https://www.property.com/guide', readDate: '2025-06-28' }
      ],
      isActiveInvestor: true
    },
    {
      name: 'David Kim',
      tier: 'Platinum',
      aum: 15000000,
      aumTrend: 'down',
      nnia: 420000,
      nniaTrend: 'up',
      reason: 'Tax planning',
      lastContactSummary: 'Provided tax planning strategies. Client to share additional documents for further review.',
      lastContact: '2025-07-15T16:45:00',
      riskProfile: 'Aggressive',
      lastTransactionAmount: 800000,
      portfolioDiversification: 8,
      complianceFlag: false,
      taxResidency: 'South Korea',
      priority: 'Low',
      customTags: ['Succession', 'Tech'],
      recentArticles: [
        { title: 'Tech Stocks Analysis', url: 'https://www.techstocks.com/analysis', readDate: '2025-07-13' }
      ],
      isActiveInvestor: true
    },
    {
      name: 'Eva Green',
      tier: 'Gold',
      aum: 9500000,
      aumTrend: 'up',
      nnia: 275000,
      nniaTrend: 'down',
      reason: 'Performance update',
      lastContact: '2025-07-05T10:20:00',
      riskProfile: 'Balanced',
      lastTransactionAmount: 300000,
      lastContactSummary: 'Performance update shared. Client satisfied with results and will maintain current strategy.',
      portfolioDiversification: 6,
      complianceFlag: false,
      taxResidency: 'UK',
      priority: 'Low',
      customTags: ['ESG'],
      recentArticles: [
        { title: 'UK Market Review', url: 'https://www.ukmarket.com/review', readDate: '2025-07-03' }
      ],
      isActiveInvestor: false
    },
    {
      name: 'Frank Miller',
      tier: 'Bronze',
      aum: 1200000,
      aumTrend: 'down',
      nnia: 35000,
      lastContactSummary: 'Discussed fee structure and answered client queries. No immediate action required.',
      nniaTrend: 'down',
      reason: 'Fee discussion',
      lastContact: '2025-06-18T13:00:00',
      riskProfile: 'Conservative',
      lastTransactionAmount: 25000,
      portfolioDiversification: 2,
      complianceFlag: false,
      taxResidency: 'USA',
      priority: 'Medium',
      customTags: ['Startup'],
      recentArticles: [
        { title: 'Startup Funding Tips', url: 'https://www.startup.com/funding', readDate: '2025-06-15' }
      ],
      isActiveInvestor: false
    },
    {
      name: 'Grace Lee',
      tier: 'Silver',
      aum: 4100000,
      aumTrend: 'up',
      lastContactSummary: 'Quarterly review completed. Client interested in sustainable investment options.',
      nnia: 110000,
      nniaTrend: 'up',
      reason: 'Quarterly review',
      lastContact: '2025-07-12T15:30:00',
      riskProfile: 'Balanced',
      lastTransactionAmount: 95000,
      portfolioDiversification: 3,
      complianceFlag: false,
      taxResidency: 'Singapore',
      priority: 'Low',
      customTags: ['ESG', 'Women Investor'],
      recentArticles: [
        { title: 'Women in Wealth', url: 'https://www.wealth.com/women', readDate: '2025-07-10' }
      ],
      isActiveInvestor: true
    },
    {
      name: 'Henry Ford',
      tier: 'Gold',
      aum: 7800000,
      aumTrend: 'down',
      lastContactSummary: 'Estate planning session held. Client to consult with legal advisor before next steps.',
      nnia: 200000,
      nniaTrend: 'down',
      reason: 'Estate planning',
      lastContact: '2025-07-03T09:00:00',
      riskProfile: 'Conservative',
      lastTransactionAmount: 400000,
      portfolioDiversification: 5,
      complianceFlag: true,
      priority: 'High',
      taxResidency: 'USA',
      customTags: ['Family Office'],
      recentArticles: [
        { title: 'Estate Planning Basics', url: 'https://www.estate.com/planning', readDate: '2025-07-01' }
      ],
      isActiveInvestor: false
    },
    {
      name: 'Ivy Chen',
      tier: 'Platinum',
      aum: 18000000,
      aumTrend: 'up',
      nnia: 500000,
      nniaTrend: 'up',
      lastContactSummary: 'Shared market update and discussed tech sector trends. Client requested more frequent updates.',
      reason: 'Market update',
      lastContact: '2025-07-09T17:10:00',
      riskProfile: 'Aggressive',
      lastTransactionAmount: 1000000,
      portfolioDiversification: 9,
      complianceFlag: false,
      taxResidency: 'China',
      priority: 'Low',
      customTags: ['Tech', 'ESG'],
      recentArticles: [
        { title: 'China Market Pulse', url: 'https://www.chinamarket.com/pulse', readDate: '2025-07-07' }
      ],
      isActiveInvestor: true
    },
    {
      name: 'Jack Black',
      tier: 'Bronze',
      aum: 900000,
      aumTrend: 'down',
      nnia: 25000,
      nniaTrend: 'down',
      reason: 'Account setup',
      lastContactSummary: 'Account setup completed. Provided onboarding materials and answered initial questions.',
      lastContact: '2025-06-25T12:00:00',
      riskProfile: 'Balanced',
      lastTransactionAmount: 15000,
      portfolioDiversification: 1,
      complianceFlag: false,
      priority: 'High',
      taxResidency: 'Australia',
      customTags: ['Startup'],
      recentArticles: [
        { title: 'Australian Startups', url: 'https://www.austartups.com', readDate: '2025-06-22' }
      ],
      isActiveInvestor: false
    },
    {
      name: 'Linda Park',
      tier: 'Silver',
      aum: 5000000,
      aumTrend: 'up',
      nnia: 130000,
      lastContactSummary: 'Reviewed portfolio performance. Client happy with returns and considering additional investments.',
      nniaTrend: 'up',
      reason: 'Performance review',
      lastContact: '2025-07-14T10:00:00',
      riskProfile: 'Balanced',
      lastTransactionAmount: 100000,
      portfolioDiversification: 4,
      complianceFlag: false,
      taxResidency: 'South Korea',
      priority: 'Low',
      customTags: ['Women Investor'],
      recentArticles: [
        { title: 'Korea Investment News', url: 'https://www.koreainvest.com/news', readDate: '2025-07-12' }
      ],
      isActiveInvestor: true
    },
    {
      name: 'Mike Brown',
      tier: 'Gold',
      aum: 7000000,
      aumTrend: 'down',
      nnia: 180000,
      nniaTrend: 'down',
      lastContactSummary: 'Explained recent tax changes. Client to review impact with accountant.',
      reason: 'Tax update',
      lastContact: '2025-07-02T09:45:00',
      riskProfile: 'Conservative',
      lastTransactionAmount: 350000,
      portfolioDiversification: 5,
      complianceFlag: true,
      taxResidency: 'USA',
      priority: 'Low',
      customTags: ['Family Office'],
      recentArticles: [
        { title: 'US Tax Changes', url: 'https://www.ustax.com/changes', readDate: '2025-06-30' }
      ],
      isActiveInvestor: false
    },
    {
      name: 'Nina Patel',
      tier: 'Platinum',
      aum: 16000000,
      aumTrend: 'up',
      nnia: 480000,
      lastContactSummary: 'Discussed portfolio expansion and new tech investments. Client approved proposed changes.',
      nniaTrend: 'up',
      reason: 'Portfolio expansion',
      lastContact: '2025-07-11T14:20:00',
      riskProfile: 'Aggressive',
      lastTransactionAmount: 900000,
      portfolioDiversification: 10,
      complianceFlag: false,
      taxResidency: 'India',
      priority: 'High',
      customTags: ['NRI', 'Tech'],
      recentArticles: [
        { title: 'India Tech Boom', url: 'https://www.indiatech.com/boom', readDate: '2025-07-09' }
      ],
      isActiveInvestor: true
    },
    {
      name: 'Oscar Wilde',
      tier: 'Silver',
      aum: 4200000,
      aumTrend: 'up',
      nnia: 115000,
      lastContactSummary: 'Annual review completed. Client requested ESG report for next meeting.',
      nniaTrend: 'up',
      reason: 'Annual review',
      lastContact: '2025-07-13T11:30:00',
      riskProfile: 'Balanced',
      lastTransactionAmount: 85000,
      portfolioDiversification: 3,
      complianceFlag: false,
      taxResidency: 'UK',
      priority: 'Low',
      customTags: ['ESG'],
      recentArticles: [
        { title: 'ESG in UK', url: 'https://www.ukesg.com', readDate: '2025-07-11' }
      ],
      isActiveInvestor: true
    },
    {
      name: 'Priya Singh',
      tier: 'Gold',
      aum: 8500000,
      aumTrend: 'down',
      nnia: 220000,
      nniaTrend: 'down',
      reason: 'Product inquiry',
      lastContact: '2025-07-04T08:00:00',
      riskProfile: 'Conservative',
      lastContactSummary: 'Answered product inquiry and sent additional resources. Awaiting client feedback.',
      lastTransactionAmount: 250000,
      portfolioDiversification: 6,
      complianceFlag: false,
      taxResidency: 'India',
      priority: 'Low',
      customTags: ['NRI'],
      recentArticles: [
        { title: 'NRI Investment Guide', url: 'https://www.nri.com/guide', readDate: '2025-07-02' }
      ],
      isActiveInvestor: false
    },
    {
      name: 'Quentin Blake',
      tier: 'Bronze',
      aum: 1100000,
      aumTrend: 'down',
      nnia: 30000,
      nniaTrend: 'down',
      reason: 'Fee update',
      lastContact: '2025-06-20T10:30:00',
      riskProfile: 'Balanced',
      lastTransactionAmount: 20000,
      portfolioDiversification: 2,
      complianceFlag: false,
      taxResidency: 'Australia',
      lastContactSummary: 'Updated fee structure and clarified billing process. Client acknowledged changes.',
      priority: 'Low',
      customTags: ['Startup'],
      recentArticles: [
        { title: 'Startup Trends', url: 'https://www.startuptrends.com', readDate: '2025-06-18' }
      ],
      isActiveInvestor: false
    },
    {
      name: 'Rita Gomez',
      tier: 'Silver',
      aum: 3900000,
      aumTrend: 'up',
      nnia: 105000,
      nniaTrend: 'up',
      reason: 'Quarterly review',
      lastContactSummary: 'Quarterly review held. Client interested in diversifying portfolio further.',
      lastContact: '2025-07-08T13:15:00',
      riskProfile: 'Balanced',
      lastTransactionAmount: 90000,
      portfolioDiversification: 3,
      complianceFlag: false,
      taxResidency: 'Spain',
      priority: 'Low',
      customTags: ['Women Investor'],
      recentArticles: [
        { title: 'Spain Wealth Insights', url: 'https://www.spainwealth.com/insights', readDate: '2025-07-06' }
      ],
      isActiveInvestor: true
    },
    {
      name: 'Sam Lee',
      tier: 'Gold',
      aum: 9200000,
      aumTrend: 'up',
      nnia: 260000,
      nniaTrend: 'up',
      reason: 'Performance update',
      lastContact: '2025-07-06T09:40:00',
      riskProfile: 'Balanced',
      lastTransactionAmount: 350000,
      portfolioDiversification: 6,
      complianceFlag: false,
      taxResidency: 'Singapore',
      priority: 'High',
      customTags: ['ESG', 'Tech'],
      recentArticles: [
        { title: 'Tech in Singapore', url: 'https://www.singaporetech.com', readDate: '2025-07-04' }
      ],
      isActiveInvestor: true
    }
  ];
  selectedClient: any = null;
  showPopup = false;
  aiTalkingPoints: string[] = [];
  gridApi: any;

  assistantQuestion: string = '';
  assistantAnswer: string = '';
  transcriptLines: string[] = [];
  fullTranscript: string[] = [
    "Advisor: Welcome to the call, Alice.",
    "Client: Thank you. I wanted to discuss my portfolio performance.",
    "Advisor: Sure, let's review your recent investments.",
    "Client: I am interested in ESG funds.",
    "Advisor: Great choice. I will share some options.",
    "AI: ESG funds have outperformed the market this quarter.",
    "Client: Can you send me the details?",
    "Advisor: Absolutely, I will email you after the call."
  ];

  transcriptInterval: any;

  startTranscriptSimulation() {
    this.transcriptLines = [];
    let idx = 0;
    if (this.transcriptInterval) {
      clearInterval(this.transcriptInterval);
    }
    this.transcriptInterval = setInterval(() => {
      if (idx < this.fullTranscript.length) {
        this.transcriptLines.push(this.fullTranscript[idx]);
        idx++;
        setTimeout(() => {
          const transcriptBox = document.querySelector('.transcript-box');
          if (transcriptBox) {
            transcriptBox.scrollTop = transcriptBox.scrollHeight;
          }
        }, 10); // Scroll after DOM update
      } else {
        clearInterval(this.transcriptInterval);
      }
    }, 1200); // 1.2 seconds per line
  }
  // Simulate AI suggestion (replace with real API call if needed)
  generateClientSummary(client: Client): string {
    let trendText = '';
    if (client.aumTrend === 'up') {
      trendText = 'Investment has increased recently.';
    } else if (client.aumTrend === 'down') {
      trendText = 'Investment has decreased recently.';
    }
    // Format last contact date as DD MMM YYYY
    let lastContactFormatted = '';
    if (client.lastContact) {
      const date = new Date(client.lastContact);
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'short' });
      const year = date.getFullYear();
      lastContactFormatted = `${day} ${month} ${year}`;
    }
    return `Client: ${client.name} (${client.tier} tier)
Portfolio Value: $${client.aum.toLocaleString()}
NNIA: $${client.nnia.toLocaleString()}
${trendText}
Last Contact: ${lastContactFormatted}
Reason for connect: ${client.reason}`;
  }

  // Update generateTalkingPoints to include summary
  generateTalkingPoints(client: Client, tone: 'neutral' | 'angry' | 'happy' = 'neutral') {
    // Personalized summary for connect
    this.talkingPointsList = [];

    // Engagement or service request info
    const engagementInfo = client.reason
      ? `<b>Engagement/Service Request</b>: ${client.reason}.`
      : 'No specific service request noted.';

    // Thematic investment product recommendation
    let themeRecommendation = '';
    if (client.customTags?.includes('ESG')) {
      themeRecommendation = '<b>Recommend ESG funds—these align with your interest and have strong recent performance.</b>';
    } else if (client.customTags?.includes('Tech')) {
      themeRecommendation = '<b>Suggest Tech sector funds or AI-driven portfolios, matching your interest in innovation.</b>';
    } else if (client.customTags?.includes('Real Estate')) {
      themeRecommendation = '<b>Consider Real Estate investment trusts for portfolio diversification.</b>';
    } else if (client.tier === 'Platinum' || client.tier === 'Gold') {
      themeRecommendation = '<b>Exclusive access to global thematic funds and private equity opportunities.</b>';
    } else {
      themeRecommendation = 'Explore balanced mutual funds or index ETFs for steady growth.';
    }

    if (tone === 'angry') {
      this.talkingPointsList = [
        engagementInfo,
        `Apologize for any inconvenience regarding compliance issues${client.complianceFlag ? ' (flagged)' : ''}.`,
        `Acknowledge delay and reassure priority for ${client.name}.`,
        `Ask for details about last transaction ($${client.lastTransactionAmount?.toLocaleString() || 'N/A'}).`,
        themeRecommendation,
        `Offer direct contact for urgent matters.`,
        `Thank ${client.name} for patience and feedback.`
      ];
    } else if (tone === 'happy') {
      this.talkingPointsList = [
        engagementInfo,
        `Thank ${client.name} for trust and engagement.`,
        `Share positive updates: Portfolio $${client.aum.toLocaleString()}, NNIA $${client.nnia.toLocaleString()}.`,
        `Highlight ${client.tier} tier benefits and ${client.customTags?.join(', ') || 'no special tags'}.`,
        themeRecommendation,
        `Ask for feedback on recent transaction ($${client.lastTransactionAmount?.toLocaleString() || 'N/A'}).`,
        `Invite to exclusive events for ${client.taxResidency || 'global'} clients.`
      ];
    } else {
      this.talkingPointsList = [
        engagementInfo,
        themeRecommendation,
        `Review ${client.tier} tier market trends and risk profile (${client.riskProfile || 'N/A'}).`,
        
        `Suggest rebalancing based on NNIA and last transaction ($${client.lastTransactionAmount?.toLocaleString() || 'N/A'}).`,
        `Mention new opportunities for ${client.taxResidency || 'global'} clients.`,
        `Highlight regulatory changes for compliance${client.complianceFlag ? ' (flagged)' : ''}.`
      ];
    }
  }
  askAssistant() {
    // Simulate AI response
    this.assistantAnswer = "Based on the transcript, the client's main concern is portfolio performance. Recommend sharing a summary and next steps.";
  }
  onCellClicked(event: any) {
    // Show AI popup for client name
    if (event.colDef.field === 'name') {
      this.selectedClient = event.data;
      this.generateTalkingPoints(event.data);
      this.showPopup = true;
    }
    // Show mail popup for email icon
    if (event.colDef.headerName === 'Reach Client' && event.event?.target?.closest('.email-btn')) {
      const client = event.data;
      this.mailRecipient = client.name;
      this.mailTo = client.email || '';

      this.mailSubject = `Portfolio Update for ${client.name}`;
      this.mailTemplate = `Dear ${client.name},\n\nThank you for your continued trust in our services. Please let us know if you have any questions about your portfolio or recent market developments.\n\n${this.userSignature}`;
      this.showMailPopup = true;
    }
    // Show WhatsApp popup for whatsapp icon
    if (event.colDef.headerName === 'Reach Client' && event.event?.target?.closest('.whatsapp-btn')) {
      const client = event.data;
      this.whatsappRecipient = client.name;
      this.whatsappMessages = [
        { from: 'client', text: `Hi, this is ${client.name}.` },
        { from: 'me', text: 'Hello! How can I assist you today?' }
      ];
      this.whatsappInput = '';
      this.showWhatsappPopup = true;
    }
    // Show Call popup for call icon
    if (event.colDef.headerName === 'Reach Client' && event.event?.target?.closest('.call-btn')) {
      this.callRecipient = event.data.name;
      this.callStatus = 'Calling...';
      this.listening = false;
      this.showCallPopup = true;

      // Simulate call connecting and assistant listening
      setTimeout(() => {
        this.ngZone.run(() => {
          this.callStatus = `Connected to ${event.data.name}`;
          this.listening = true;
          this.startTranscriptSimulation();
          const tones: Array<'angry' | 'happy' | 'neutral'> = ['angry', 'happy', 'neutral'];
          const idx = Math.floor(Math.random() * tones.length);
          this.startAssistantListening(event.data, tones[idx]);
          this.cdr.markForCheck();
        });
      }, 1500);
    }
    // Show Zoom popup for zoom icon
    if (event.colDef.headerName === 'Reach Client' && event.event?.target?.closest('.zoom-btn')) {
      const client = event.data;
      this.zoomTopic = `Meeting with ${client.name}`;
      this.zoomDateTime = '';
      this.zoomInvitees = client.email || '';
      this.zoomMessage = `Hi ${client.name},\n\nI'd like to invite you to a Zoom meeting to discuss your portfolio and any questions you may have.\n\nBest regards,\nJohn Doe`;
      this.showZoomPopup = true;
    }
  }
  closeZoomPopup() {
    this.showZoomPopup = false;
    this.zoomTopic = '';
    this.zoomDateTime = '';
    this.zoomInvitees = '';
    this.zoomMessage = '';
  }
  clearAITypingTimeouts() {
    this.aiTypingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    this.aiTypingPoints = [];
    this.aiTypingIndex = 0;
  }

  hangupCall() {
    this.callStatus = 'Call ended';
    this.listening = false;
    this.clearAITypingTimeouts();
    this.aiTypingPoints = [];
    setTimeout(() => {
      this.showCallPopup = false;
      this.cdr.detectChanges();
    }, 900);
  }

  sendZoomInvite() {
    // Simulate sending invite (replace with real API call)
    alert('Zoom invite sent to: ' + this.zoomInvitees + '\n\nTopic: ' + this.zoomTopic + '\nDate & Time: ' + this.zoomDateTime + '\n\nMessage:\n' + this.zoomMessage);
    this.closeZoomPopup();
  }

  closeCallPopup() {
    this.showCallPopup = false;
    this.callRecipient = '';
    this.callStatus = 'Calling...';
    this.listening = false;
  }


  closeWhatsappPopup() {
    this.showWhatsappPopup = false;
    this.whatsappRecipient = '';
    this.whatsappMessages = [];
    this.whatsappInput = '';
  }
  onBackdropClick(event: MouseEvent) {
    // Only close if click is directly on the backdrop, not if it bubbles from the popup

  }
  sendWhatsappMessage() {
    if (this.whatsappInput.trim()) {
      this.whatsappMessages.push({ from: 'me', text: this.whatsappInput });
      // Simulate bot reply after user sends a message
      setTimeout(() => {
        this.whatsappMessages.push({
          from: 'bot',
          text: '🤖 Bot: Thank you for your message! I will notify your advisor or help you with quick info.'
        });
        this.cdr.markForCheck();
      }, 900);
      this.whatsappInput = '';
    }
  }

  closeMailPopup() {
    this.showMailPopup = false;
    this.mailTemplate = '';
    this.mailRecipient = '';
  }

  sendMail() {
    const subject = this.mailSubject || '';
    const to = this.mailRecipient || '';
    const cc = this.mailCc || '';
    const bcc = this.mailBcc || '';
    const body = (this.mailTemplate || '') + '\n\n' + (this.userSignature || '');
    let eml =
      `To: ${to}\r\n` +
      (cc ? `Cc: ${cc}\r\n` : '') +
      (bcc ? `Bcc: ${bcc}\r\n` : '') +
      `Subject: ${subject}\r\n` +
      `Content-Type: text/plain; charset=UTF-8\r\n` +
      `\r\n` +
      `${body}`;

    const blob = new Blob([eml], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'email'}.eml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.closeMailPopup();
  }


  closePopup() {
    this.showPopup = false;
    this.selectedClient = null;
    this.aiTalkingPoints = [];
  }
  showAITypingPoints(points: string[]) {

    this.clearAITypingTimeouts();
    const typeNext = () => {
      if (this.aiTypingIndex < points.length) {
        this.aiTypingPoints.push({ text: '', typing: true });
        let charIndex = 0;
        const currentPoint = points[this.aiTypingIndex];
        const typeChar = () => {
          if (charIndex <= currentPoint.length) {
            this.aiTypingPoints[this.aiTypingIndex].text = currentPoint.slice(0, charIndex);
            this.cdr.detectChanges();
            charIndex++;
            this.aiTypingTimeouts.push(window.setTimeout(typeChar, 25));
          } else {
            this.aiTypingPoints[this.aiTypingIndex].typing = false;
            this.aiTypingIndex++;
            this.aiTypingTimeouts.push(window.setTimeout(typeNext, 2000));
          }
        };
        typeChar();
      }
    };
    typeNext();
  }

  // Call this when assistant starts listening
  startAssistantListening(client: Client, tone: 'neutral' | 'angry' | 'happy' = 'neutral') {
    this.generateTalkingPoints(client, tone);
    setTimeout(() => {
      this.showAITypingPoints(this.talkingPointsList);
    }, 4000);
    this.listening = true;
  }
  onTemplateChange() {
    const template = this.mailTemplates.find(t => t.id === this.selectedTemplate);
    this.mailTemplate = template ? template.body : '';
  }

  customizeTemplate() {
    this.selectedTemplate = 'custom';
    this.mailTemplate = '';
  }
}