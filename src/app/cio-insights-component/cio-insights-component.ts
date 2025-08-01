import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { GridOptions, themeQuartz } from 'ag-grid-community';

@Component({
  selector: 'app-cio-insights-component',
  imports: [CommonModule, AgGridModule],
  standalone: true,
  templateUrl: './cio-insights-component.html',
  styleUrl: './cio-insights-component.scss'
})
export class CioInsightsComponent {
  theme = themeQuartz;

  insights = [
    {
      title: 'ESG Investing: The Future of Wealth',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80',
      visits: 124,
      proposed: 38,
      accepted: 19
    },
    {
      title: 'Global Markets Outlook Q3',
      image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
      visits: 98,
      proposed: 22,
      accepted: 11
    },
    {
      title: 'Tech Disruption in Banking',
      image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
      visits: 87,
      proposed: 30,
      accepted: 14
    },
    {
      title: 'Private Equity Trends',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      visits: 65,
      proposed: 18,
      accepted: 7
    }
  ];

  selectedInsightIndex: number | null = null;
  customerTableData: any[] = [];
  gridApi: any;

  customerGridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 20,
    defaultColDef: {
      resizable: true,
      minWidth: 80,
      flex: 1
    },
    onGridReady: (params: any) => {
      params.api.sizeColumnsToFit();
    }
  };

  customerColumnDefs = [
    { headerName: 'Customer Name', field: 'name', checkboxSelection: true, headerCheckboxSelection: true, minWidth: 160, flex: 1 },
    { headerName: 'Bank', field: 'bank', minWidth: 120, flex: 1 },
    { headerName: 'Tier', field: 'tier', minWidth: 100, flex: 1 },
    { headerName: 'Product Suitability', field: 'suitability', minWidth: 160, flex: 1 },
    { headerName: 'Recent Product', field: 'recentProduct', minWidth: 160, flex: 1 },
    { headerName: 'Engagement Type', field: 'engagementType', minWidth: 140, flex: 1 },
    {
      headerName: 'Last Contact',
      field: 'lastContact',
      minWidth: 120,
      flex: 1,
      valueFormatter: (params: any) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      }
    },
    { headerName: 'Email', field: 'email', minWidth: 180, flex: 1 },
    { headerName: 'Interest Level', field: 'interest', minWidth: 120, flex: 1 }
  ];

  showProductsPopup = false;
  productsTableData: any[] = [];
  productsColumnDefs = [
    { headerName: 'Product Name', field: 'name', minWidth: 180, flex: 1 },
    { headerName: 'Type', field: 'type', minWidth: 120, flex: 1 },
    { headerName: 'Suitability', field: 'suitability', minWidth: 140, flex: 1 },
    { headerName: 'Risk Level', field: 'risk', minWidth: 120, flex: 1 },
    { headerName: 'Returns (5Y)', field: 'returns', minWidth: 120, flex: 1 }
  ];

  showRelatedProducts() {
    this.showProductsPopup = true;
    this.productsTableData = [
      { name: 'ESG Balanced Fund', type: 'Mutual Fund', suitability: 'High', risk: 'Moderate', returns: '12.5%' },
      { name: 'Green Bond', type: 'Bond', suitability: 'Medium', risk: 'Low', returns: '7.2%' },
      { name: 'Sustainable Equity Portfolio', type: 'Equity', suitability: 'High', risk: 'High', returns: '15.8%' },
      { name: 'ESG ETF', type: 'ETF', suitability: 'Medium', risk: 'Moderate', returns: '10.1%' }
    ];
  }

  closeProductsPopup() {
    this.showProductsPopup = false;
  }

  showCustomers(index: number) {
    this.selectedInsightIndex = index;
    
    this.customerTableData = [
      {
        name: 'Alice Johnson',
        bank: 'Wealth Bank',
        suitability: 'Highly Suitable',
        email: 'alice.johnson@email.com',
        interest: 'High',
        lastContact: '2025-07-10',
        tier: 'Platinum',
        recentProduct: 'ESG Balanced Fund',
        engagementType: 'Service Request'
      },
      {
        name: 'Bob Smith',
        bank: 'Global Finance',
        suitability: 'Suitable',
        email: 'bob.smith@email.com',
        interest: 'Medium',
        lastContact: '2025-06-22',
        tier: 'Gold',
        recentProduct: 'Green Bond',
        engagementType: 'Portfolio Review'
      },
      {
        name: 'Carol Lee',
        bank: 'Prime Wealth',
        suitability: 'Moderate',
        email: 'carol.lee@email.com',
        interest: 'High',
        lastContact: '2025-07-01',
        tier: 'Silver',
        recentProduct: 'Sustainable Equity Portfolio',
        engagementType: 'Investment Inquiry'
      },
      {
        name: 'David Kim',
        bank: 'Wealth Bank',
        suitability: 'Highly Suitable',
        email: 'david.kim@email.com',
        interest: 'High',
        lastContact: '2025-07-15',
        tier: 'Platinum',
        recentProduct: 'ESG ETF',
        engagementType: 'Service Request'
      },
      {
        name: 'Eva Green',
        bank: 'Prime Wealth',
        suitability: 'Suitable',
        email: 'eva.green@email.com',
        interest: 'Medium',
        lastContact: '2025-07-12',
        tier: 'Gold',
        recentProduct: 'Green Bond',
        engagementType: 'Performance Review'
      },
      {
        name: 'Frank Miller',
        bank: 'Global Finance',
        suitability: 'Highly Suitable',
        email: 'frank.miller@email.com',
        interest: 'High',
        lastContact: '2025-07-08',
        tier: 'Platinum',
        recentProduct: 'ESG Balanced Fund',
        engagementType: 'Service Request'
      },
      {
        name: 'Grace Lee',
        bank: 'Wealth Bank',
        suitability: 'Moderate',
        email: 'grace.lee@email.com',
        interest: 'Low',
        lastContact: '2025-07-03',
        tier: 'Silver',
        recentProduct: 'Sustainable Equity Portfolio',
        engagementType: 'Investment Inquiry'
      },
      {
        name: 'Henry Ford',
        bank: 'Prime Wealth',
        suitability: 'Suitable',
        email: 'henry.ford@email.com',
        interest: 'Medium',
        lastContact: '2025-07-14',
        tier: 'Gold',
        recentProduct: 'Green Bond',
        engagementType: 'Portfolio Review'
      },
      {
        name: 'Ivy Chen',
        bank: 'Global Finance',
        suitability: 'Highly Suitable',
        email: 'ivy.chen@email.com',
        interest: 'High',
        lastContact: '2025-07-09',
        tier: 'Platinum',
        recentProduct: 'ESG ETF',
        engagementType: 'Service Request'
      },
      {
        name: 'Jack Black',
        bank: 'Wealth Bank',
        suitability: 'Moderate',
        email: 'jack.black@email.com',
        interest: 'Low',
        lastContact: '2025-07-05',
        tier: 'Silver',
        recentProduct: 'Sustainable Equity Portfolio',
        engagementType: 'Investment Inquiry'
      },
      {
        name: 'Linda Park',
        bank: 'Prime Wealth',
        suitability: 'Suitable',
        email: 'linda.park@email.com',
        interest: 'Medium',
        lastContact: '2025-07-11',
        tier: 'Gold',
        recentProduct: 'Green Bond',
        engagementType: 'Portfolio Review'
      },
      {
        name: 'Mike Brown',
        bank: 'Global Finance',
        suitability: 'Highly Suitable',
        email: 'mike.brown@email.com',
        interest: 'High',
        lastContact: '2025-07-07',
        tier: 'Platinum',
        recentProduct: 'ESG Balanced Fund',
        engagementType: 'Service Request'
      },
      {
        name: 'Nina Patel',
        bank: 'Wealth Bank',
        suitability: 'Highly Suitable',
        email: 'nina.patel@email.com',
        interest: 'High',
        lastContact: '2025-07-13',
        tier: 'Platinum',
        recentProduct: 'ESG ETF',
        engagementType: 'Service Request'
      },
      {
        name: 'Oscar Wilde',
        bank: 'Prime Wealth',
        suitability: 'Suitable',
        email: 'oscar.wilde@email.com',
        interest: 'Medium',
        lastContact: '2025-07-06',
        tier: 'Gold',
        recentProduct: 'Green Bond',
        engagementType: 'Portfolio Review'
      },
      {
        name: 'Priya Singh',
        bank: 'Global Finance',
        suitability: 'Moderate',
        email: 'priya.singh@email.com',
        interest: 'High',
        lastContact: '2025-07-02',
        tier: 'Silver',
        recentProduct: 'Sustainable Equity Portfolio',
        engagementType: 'Investment Inquiry'
      },
      {
        name: 'Quentin Blake',
        bank: 'Wealth Bank',
        suitability: 'Highly Suitable',
        email: 'quentin.blake@email.com',
        interest: 'High',
        lastContact: '2025-07-15',
        tier: 'Platinum',
        recentProduct: 'ESG Balanced Fund',
        engagementType: 'Service Request'
      },
      {
        name: 'Rita Gomez',
        bank: 'Prime Wealth',
        suitability: 'Suitable',
        email: 'rita.gomez@email.com',
        interest: 'Medium',
        lastContact: '2025-07-10',
        tier: 'Gold',
        recentProduct: 'Green Bond',
        engagementType: 'Performance Review'
      },
      {
        name: 'Sam Lee',
        bank: 'Global Finance',
        suitability: 'Highly Suitable',
        email: 'sam.lee@email.com',
        interest: 'High',
        lastContact: '2025-07-08',
        tier: 'Platinum',
        recentProduct: 'ESG Balanced Fund',
        engagementType: 'Service Request'
      },
      {
        name: 'Tina Brown',
        bank: 'Wealth Bank',
        suitability: 'Moderate',
        email: 'tina.brown@email.com',
        interest: 'Low',
        lastContact: '2025-07-03',
        tier: 'Silver',
        recentProduct: 'Sustainable Equity Portfolio',
        engagementType: 'Investment Inquiry'
      },
      {
        name: 'Uma Sharma',
        bank: 'Prime Wealth',
        suitability: 'Suitable',
        email: 'uma.sharma@email.com',
        interest: 'Medium',
        lastContact: '2025-07-14',
        tier: 'Gold',
        recentProduct: 'Green Bond',
        engagementType: 'Portfolio Review'
      },
      {
        name: 'Victor Hugo',
        bank: 'Global Finance',
        suitability: 'Highly Suitable',
        email: 'victor.hugo@email.com',
        interest: 'High',
        lastContact: '2025-07-09',
        tier: 'Platinum',
        recentProduct: 'ESG ETF',
        engagementType: 'Service Request'
      },
      {
        name: 'Wendy Lee',
        bank: 'Wealth Bank',
        suitability: 'Moderate',
        email: 'wendy.lee@email.com',
        interest: 'Low',
        lastContact: '2025-07-05',
        tier: 'Silver',
        recentProduct: 'Sustainable Equity Portfolio',
        engagementType: 'Investment Inquiry'
      },
      {
        name: 'Xavier King',
        bank: 'Prime Wealth',
        suitability: 'Suitable',
        email: 'xavier.king@email.com',
        interest: 'Medium',
        lastContact: '2025-07-11',
        tier: 'Gold',
        recentProduct: 'Green Bond',
        engagementType: 'Portfolio Review'
      },
      {
        name: 'Yara Costa',
        bank: 'Global Finance',
        suitability: 'Highly Suitable',
        email: 'yara.costa@email.com',
        interest: 'High',
        lastContact: '2025-07-07',
        tier: 'Platinum',
        recentProduct: 'ESG Balanced Fund',
        engagementType: 'Service Request'
      },
      {
        name: 'Zane Smith',
        bank: 'Wealth Bank',
        suitability: 'Highly Suitable',
        email: 'zane.smith@email.com',
        interest: 'High',
        lastContact: '2025-07-13',
        tier: 'Platinum',
        recentProduct: 'ESG ETF',
        engagementType: 'Service Request'
      },
      {
        name: 'Ava Brown',
        bank: 'Prime Wealth',
        suitability: 'Suitable',
        email: 'ava.brown@email.com',
        interest: 'Medium',
        lastContact: '2025-07-06',
        tier: 'Gold',
        recentProduct: 'Green Bond',
        engagementType: 'Portfolio Review'
      },
      {
        name: 'Ben Lee',
        bank: 'Global Finance',
        suitability: 'Moderate',
        email: 'ben.lee@email.com',
        interest: 'High',
        lastContact: '2025-07-02',
        tier: 'Silver',
        recentProduct: 'Sustainable Equity Portfolio',
        engagementType: 'Investment Inquiry'
      },
      {
        name: 'Cathy Kim',
        bank: 'Wealth Bank',
        suitability: 'Highly Suitable',
        email: 'cathy.kim@email.com',
        interest: 'High',
        lastContact: '2025-07-15',
        tier: 'Platinum',
        recentProduct: 'ESG Balanced Fund',
        engagementType: 'Service Request'
      },
      {
        name: 'Dan Ford',
        bank: 'Prime Wealth',
        suitability: 'Suitable',
        email: 'dan.ford@email.com',
        interest: 'Medium',
        lastContact: '2025-07-10',
        tier: 'Gold',
        recentProduct: 'Green Bond',
        engagementType: 'Performance Review'
      },
      {
        name: 'Ella Chen',
        bank: 'Global Finance',
        suitability: 'Highly Suitable',
        email: 'ella.chen@email.com',
        interest: 'High',
        lastContact: '2025-07-08',
        tier: 'Platinum',
        recentProduct: 'ESG Balanced Fund',
        engagementType: 'Service Request'
      },
      {
        name: 'Fiona Black',
        bank: 'Wealth Bank',
        suitability: 'Moderate',
        email: 'fiona.black@email.com',
        interest: 'Low',
        lastContact: '2025-07-03',
        tier: 'Silver',
        recentProduct: 'Sustainable Equity Portfolio',
        engagementType: 'Investment Inquiry'
      }
    ];
  }

  onCustomerGridReady(params: any) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  sendRecommendationMail() {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedCustomers = selectedNodes.map((node: any) => node.data);
    alert(
      `Recommendation mail will be sent to:\n` +
      selectedCustomers.map((c: any) => `${c.name} (${c.email})`).join('\n')
    );
  }
}