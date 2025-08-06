import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';
import { Chart, LinearScale, CategoryScale } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
@Component({
  selector: 'app-leads-management-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './leads-management-dashboard.html',
  styleUrl: './leads-management-dashboard.scss'
})
export class LeadsManagementDashboard implements AfterViewInit {
  isDarkTheme = false;
   constructor(public router: Router) {}
  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }
  ngAfterViewInit() {
    // Chart.js must be installed: npm install chart.js
    // Import Chart.js dynamically to avoid SSR issues
    // Promise.all([
    //   import('chart.js/auto'),
    //   import('chartjs-chart-funnel')
    // ]).then(([{ default: Chart }]) => {
      // register controller in chart.js and ensure the defaults are set
      Chart.register(FunnelController, TrapezoidElement, LinearScale, CategoryScale, ChartDataLabels);

      // Current quarter lead dynamics (horizontal bar)
      new Chart('quarterLeadDynamics', {
        type: 'bar',
        data: {
          labels: ['Apr 2025', 'Jul 2025'],
          datasets: [{
            label: 'Leads',
            data: [11, 16],
            backgroundColor: ['#c7b6fa', '#c7b6fa']
          }]
        },
        options: {
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false // Hide x-axis grid lines
              }
            },
            y: {
              grid: {
                display: false // Hide y-axis grid lines
              }
            }
          }
        }
      });

      // Lead dynamics by month (horizontal bar)
      new Chart('leadDynamicsByMonth', {
        type: 'bar',
        data: {
          labels: ['Dec 2025', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025', 'May 2025', 'Jun 2025', 'Jul 2025'],
          datasets: [{
            label: 'Leads',
            data: [5, 8, 10, 3, 70, 16, 11, 25],
            backgroundColor: '#2d8cff'
          }]
        },
        options: {
          indexAxis: 'y',
          plugins: { legend: { display: false }, datalabels: { color: 'white' } },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: false // Hide x-axis grid lines
              }
            },
            y: {
              grid: {
                display: false // Hide y-axis grid lines
              }
            }
          }
        }
      });

      // Lead stages (vertical bar)
      new Chart('leadStages', {
        type: 'bar',
        data: {
          labels: ['New', 'Contacted', 'In Progress', 'Converted', 'Rejected'],
          datasets: [{
            label: 'Leads',
            data: [6, 12, 18, 60, 25],
            backgroundColor: '#2d8cff'
          }]
        },
        options: {
          plugins: { legend: { display: false }, datalabels: { color: 'white' } },
          scales: {
            x: {

              grid: {
                display: false // Hide x-axis grid lines
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false // Hide y-axis grid lines
              }
            }
          }
        }
      });

      // Lead sources (pie)
      // ...inside ngAfterViewInit...
      new Chart('leadSources', {
        type: 'pie',
        data: {
          labels: [
            'Banker Referral',
            'Customer Referral',
            'SalesForce WealthX',
            'Rel Pro',
            'Road Show',
            'One Citi Referral'
          ],
          datasets: [{
            data: [15, 22, 37, 13, 25, 18],
            backgroundColor: [
              '#6C63FF', // soft indigo
              '#48C9B0', // teal
              '#F7CAC9', // light pink
              '#FFD166', // pastel yellow
              '#A1C6EA', // light blue
              '#FFB7B2'  // blush
            ],
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1200, // 1.2 seconds
            easing: 'easeOutBounce'
          },
          plugins: {
            datalabels: { color: 'white' },
            legend: {
              display: true,
              position: 'right',
              labels: {
                color: '#193b6a',
                font: { size: 15, weight: 'bold' },
                boxWidth: 18,
                padding: 18
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                  const percent = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} (${percent}%)`;
                }
              }
            }
          }
        }
      });

      // Lead conversion rate (funnel chart simulated with bar)
      new Chart('leadConversionRate', {
        type: 'funnel',
        data: {
          labels: [
            'Proposal/Price Quote', 'Negotiation/Review', 'Initial Offer',
            'Prospect', 'Needs Analysis', 'Qualification'
          ], // reversed for inverted funnel
          datasets: [{
            label: 'Sales Pipeline',
            data: [7.31, 6.38, 5.97, 4.57, 3.05, 2.43],
            backgroundColor: [
              '#25d366', // green
              '#2ecc71',
              '#19e6e6',
              '#4faaff',
              '#2d8cff',
              '#193b6a'  // blue
            ]
          }]
        },
        options: {
          indexAxis: 'y', // vertical funnel
          animation: {


            duration: 1200, // 1.2 seconds
            easing: 'easeOutBounce'
          },
          plugins: {
            legend: { display: true, position: 'bottom' },

          },

        }
      });

      // Leads amount by customer needs (vertical bar)
      new Chart('leadsByNeeds', {
        type: 'bar',
        data: {
          labels: [
            'Banking', 'Cards', 'Lending', 'Wealth'
          ],
          datasets: [{
            label: 'Amount',
            data: [47700, 52000, 51300, 142100],
            backgroundColor: '#2d8cff'
          }]
        },
        options: {
          plugins: { legend: { display: false }, datalabels: { color: 'white' } },
          scales: {
            x: {
              grid: {
                display: false // Hide x-axis grid lines
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: false // Hide y-axis grid lines
              }
            }
          }
        }
      });


      new Chart('salesFunnel', {
        type: 'funnel',
        data: {
          labels: [
            'Qualification', 'Needs Analysis', 'Prospect', 'Initial Offer',
            'Negotiation/Review', 'Proposal/Price Quote'
          ],
          datasets: [{
            label: 'Sales Pipeline',
            data: [7.31, 6.38, 5.97, 4.57, 3.05, 2.40], // <-- reversed data
            backgroundColor: [
              '#ffd700', '#ffb347', '#ff5a99', '#4faaff', '#2d8cff', '#19e6e6'
            ]
          }]
        },
        options: {
          indexAxis: 'y', // vertical funnel
          plugins: {
            legend: { display: false },
            datalabels: {
              formatter: (value, context) => {
                // Access the label from the data
                const labels = context.chart.data.labels;
                const label = Array.isArray(labels) ? labels[context.dataIndex] : '';
                // Access the value of the data point
                const dataValue = value * 100;

                // Example: Combine label and value
                return `${label}: ${dataValue}`;

                // Example: Display value and percentage (if calculated)
                // return `${value} (${percentage}%)`;

                // Example: Multi-line label
                // return [label, `Value: ${value}`];
              },
              // Other datalabels options like color, font, position, etc.
              color: 'white',
              font: {
                size: 12

              },
              anchor: 'start', // or 'start', 'end'
              align: 'center' // or 'left', 'right'
            }
          },
          scales: {
            y: {
              beginAtZero: true // Reverses the y-axis, so the first label is at the bottom
            }
          }
        }
      });
new Chart('leadCluster', {
  type: 'scatter',
  data: {
    datasets: [
      {
        label: 'High Value',
        data: [
          { x: 1.2, y: 3.5 }, { x: 2.1, y: 4.2 }, { x: 1.8, y: 3.9 }
        ],
        backgroundColor: '#2ecc71'
      },
      {
        label: 'Medium Value',
        data: [
          { x: 3.5, y: 2.1 }, { x: 4.0, y: 2.8 }, { x: 3.8, y: 2.5 }
        ],
        backgroundColor: '#3498db'
      },
      {
        label: 'Low Value',
        data: [
          { x: 5.2, y: 1.1 }, { x: 5.8, y: 1.5 }, { x: 6.0, y: 1.3 }
        ],
        backgroundColor: '#e67e22'
      }
    ]
  },
  options: {
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Lead: (${context.parsed.x}, ${context.parsed.y})`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Rejected' },
        grid: { color: '#eee' }
      },
      y: {
        title: { display: true, text: 'Converted' },
        grid: { color: '#eee' }
      }
    }
  }
});
      // Sales trend with forecast (line chart)
      new Chart('salesTrend', {
        type: 'line',
        data: {
          labels: [
            'Dec 2024', 'Feb 2025', 'Apr 2025', 'Jun 2025', 'Aug 2025',
            'Oct 2025'
          ],
          datasets: [
            {
              label: 'Won Amount',
              data: [0.23, 0.49, 0.12, 0.62, 0.77],
              borderColor: '#2d8cff',
              backgroundColor: '#2d8cff22',
              fill: false,
              tension: 0.3,
              pointRadius: 5
            },
            {
              label: 'Forecasted Sales',
              data: [0.23, 0.33, 0.65, 0.58, 1.1, 1.17, 1.03, 1.17],
              borderColor: '#ffb347',
              backgroundColor: '#ffb34722',
              fill: false,
              borderDash: [5, 5],
              tension: 0.3,
              pointRadius: 5
            }
          ]
        },
        options: {
          plugins: {
            legend: { position: 'bottom' },
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 25,
              ticks: {
                callback: value => `$${value}M`,
                color: '#b3d1ff' // <-- X axis label color
              }
            },
            y: {
              ticks: {
                color: '#b3d1ff' // <-- Y axis label color
              },
              grid: {
                display: false
              }
            }
          }
        }
      });

      // Sales target (vertical bar)
      new Chart('salesTarget', {
        type: 'bar',
        data: {
          labels: ['Sales Target'],
          datasets: [
            {
              label: 'Target',
              data: [8.01],
              backgroundColor: '#2d8cff44',
              barPercentage: 0.5,
              categoryPercentage: 0.5
            },
            {
              label: 'Actual',
              data: [18.91],
              backgroundColor: '#2d8cff',
              barPercentage: 0.5,
              categoryPercentage: 0.5
            }
          ]
        },
        options: {
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: $${context.parsed.x}M`;
                }
              },

            },
            datalabels: {
              display: true,
              anchor: 'end',
              align: 'end',
              color: '#2d8cff',
              font: { size: 12 },
              formatter: function (value, context) {
                return `$${value}M`;
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 25,
              ticks: {
                color: '#b3d1ff',
                callback: value => `$${value}M`
              },
              grid: {
                color: '#22304a'
              }
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                color: '#b3d1ff'
              }
            }
          }
        }
      });

    // });
  }
}
