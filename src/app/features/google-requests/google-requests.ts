import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

export interface GoogleRequest {
  id: string;
  time: Date;
  address: string;
  token: string;
  strategy: string;
  result: 'HIT' | 'MISS' | 'ERROR';
  cost: number;
}

export interface TokenUsage {
  token: string;
  org: string;
  hits: number;
  misses: number;
  total: number;
  cost: number;
}

export interface StrategyUsage {
  strategy: string;
  wasted: number;
  total: number;
  cost: number;
}

const MOCK_REQUESTS: GoogleRequest[] = [
  { id: '1',  time: new Date('2026-04-28T14:32:00'), address: '32800 County Rd, Sidon, MS, 38954',                    token: 'tempcheckadmin',  strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'MISS',  cost: 0.005 },
  { id: '2',  time: new Date('2026-04-28T14:31:00'), address: '407 1/2 S Walnut St, North Platte, NE, 69101',         token: 'Testing-Anirudh', strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'HIT',   cost: 0.005 },
  { id: '3',  time: new Date('2026-04-28T14:30:00'), address: '150 S Huntington Avenue, Boston, VA, 02130',           token: 'qwedfg',          strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'HIT',   cost: 0.005 },
  { id: '4',  time: new Date('2026-04-28T14:29:00'), address: '7213 S Staples Street, Corpus Christi, TX, 78411',     token: 'tempcheckadmin',  strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'MISS',  cost: 0.005 },
  { id: '5',  time: new Date('2026-04-28T14:28:00'), address: '600 6th Street, Brookings, SD, 57006',                 token: 'Testing-Anirudh', strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'HIT',   cost: 0.005 },
  { id: '6',  time: new Date('2026-04-28T14:27:00'), address: '2150 Eden Terrace, Rock Hill, SC, 29730',              token: 'qwedfg',          strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'ERROR', cost: 0.005 },
  { id: '7',  time: new Date('2026-04-28T14:26:00'), address: '590 Main Street, Springfield, OR, 97477',              token: 'tempcheckadmin',  strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'MISS',  cost: 0.005 },
  { id: '8',  time: new Date('2026-04-28T14:25:00'), address: '323 Waterwood Parkway, Edmond, OK, 73034',             token: 'Testing-Anirudh', strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'HIT',   cost: 0.005 },
  { id: '9',  time: new Date('2026-04-28T14:24:00'), address: '1000 S Telephone Road, Moore, OK, 73160',              token: 'qwedfg',          strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'HIT',   cost: 0.005 },
  { id: '10', time: new Date('2026-04-28T14:23:00'), address: '102 N Dixon Avenue, Cary, NC, 27511',                  token: 'tempcheckadmin',  strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'MISS',  cost: 0.005 },
  { id: '11', time: new Date('2026-04-28T14:22:00'), address: '1781 19th Avenue SE, Rio Rancho, NM, 87124',           token: 'Testing-Anirudh', strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'HIT',   cost: 0.005 },
  { id: '12', time: new Date('2026-04-28T14:21:00'), address: '18 Loudon Road, Concord, NH, 03301',                   token: 'qwedfg',          strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'MISS',  cost: 0.005 },
  { id: '13', time: new Date('2026-04-28T14:20:00'), address: '905 N Las Vegas Boulevard, Las Vegas, NV, 89101',      token: 'tempcheckadmin',  strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'HIT',   cost: 0.005 },
  { id: '14', time: new Date('2026-04-28T14:19:00'), address: '902 Armory Road, St. Joseph, MO, 63383',               token: 'Testing-Anirudh', strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'MISS',  cost: 0.005 },
  { id: '15', time: new Date('2026-04-28T14:18:00'), address: '2555 American Boulevard W, Bloomington, MN, 55431',    token: 'qwedfg',          strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'HIT',   cost: 0.005 },
  { id: '16', time: new Date('2026-04-28T14:17:00'), address: '6400 W Saint Joseph Highway, Lansing, MI, 48917',      token: 'tempcheckadmin',  strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'MISS',  cost: 0.005 },
  { id: '17', time: new Date('2026-04-28T14:16:00'), address: '2992 Western Parkway, Waldorf, MD, 20603',             token: 'Testing-Anirudh', strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'HIT',   cost: 0.005 },
  { id: '18', time: new Date('2026-04-28T14:15:00'), address: '1927 S Curry Pike, Bloomington, IN, 47403',            token: 'qwedfg',          strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'ERROR', cost: 0.005 },
  { id: '19', time: new Date('2026-04-28T14:14:00'), address: '4200 Smith Road, Cincinnati, OH, 45212',               token: 'tempcheckadmin',  strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'HIT',   cost: 0.005 },
  { id: '20', time: new Date('2026-04-28T14:13:00'), address: '1500 Market Street, Philadelphia, PA, 19102',          token: 'Testing-Anirudh', strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', result: 'MISS',  cost: 0.005 },
];

const TOKEN_USAGE: TokenUsage[] = [
  { token: 'tempcheckadmin',  org: 'EarthDefine',  hits: 3, misses: 5, total: 8,  cost: 0.040 },
  { token: 'Testing-Anirudh', org: 'EarthDefine',  hits: 5, misses: 2, total: 7,  cost: 0.035 },
  { token: 'qwedfg',          org: 'External',     hits: 3, misses: 2, total: 5,  cost: 0.025 },
];

const STRATEGY_USAGE: StrategyUsage[] = [
  { strategy: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', wasted: 9, total: 20, cost: 0.045 },
];

@Component({
  selector: 'app-google-requests',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    CardModule, ButtonModule, SelectModule, DatePickerModule,
    TableModule, TagModule, InputTextModule, TooltipModule,
  ],
  templateUrl: './google-requests.html',
  styleUrls: ['./google-requests.scss'],
})
export class GoogleRequests implements OnInit {

  requests: GoogleRequest[] = [];
  sortAsc = false;

  // Header filters
  dateRange = '24h';
  customDateRange: Date[] | null = null;
  dateRanges = [
    { label: 'Last 24 hours', value: '24h'    },
    { label: 'Last 7 days',   value: '7d'     },
    { label: 'Last 30 days',  value: '30d'    },
    { label: 'Custom',        value: 'custom' },
  ];

  // Table filters
  filterToken    = '';
  filterResult   = '';
  filterStrategy = '';
  filterAddress  = '';

  tokenOptions = [
    { label: 'All tokens',       value: '' },
    { label: 'tempcheckadmin',   value: 'tempcheckadmin'  },
    { label: 'Testing-Anirudh',  value: 'Testing-Anirudh' },
    { label: 'qwedfg',           value: 'qwedfg'          },
  ];

  resultOptions = [
    { label: 'All results', value: ''      },
    { label: 'Hit',         value: 'HIT'   },
    { label: 'Miss',        value: 'MISS'  },
    { label: 'Error',       value: 'ERROR' },
  ];

  strategyOptions = [
    { label: 'All strategies',                      value: '' },
    { label: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION', value: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION' },
  ];

  tokenUsage    = TOKEN_USAGE;
  strategyUsage = STRATEGY_USAGE;
  activeTokenFilter: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.requests = [...MOCK_REQUESTS].sort((a, b) => b.time.getTime() - a.time.getTime());
  }

  get filteredRequests(): GoogleRequest[] {
    return this.requests.filter(r => {
      if (this.filterToken    && r.token    !== this.filterToken)    return false;
      if (this.filterResult   && r.result   !== this.filterResult)   return false;
      if (this.filterStrategy && r.strategy !== this.filterStrategy) return false;
      if (this.filterAddress  && !r.address.toLowerCase().includes(this.filterAddress.toLowerCase())) return false;
      if (this.activeTokenFilter && r.token !== this.activeTokenFilter) return false;
      return true;
    });
  }

  get totalRequests(): number  { return this.filteredRequests.length; }
  get totalHits(): number      { return this.filteredRequests.filter(r => r.result === 'HIT').length; }
  get totalMisses(): number    { return this.filteredRequests.filter(r => r.result === 'MISS').length; }
  get estimatedCost(): string  { return '$' + (this.filteredRequests.length * 0.005).toFixed(3); }

  toggleSort(): void {
    this.sortAsc = !this.sortAsc;
    this.requests.sort((a, b) => this.sortAsc
      ? a.time.getTime() - b.time.getTime()
      : b.time.getTime() - a.time.getTime()
    );
  }

  filterByToken(token: string): void {
    this.activeTokenFilter = this.activeTokenFilter === token ? null : token;
  }

  resultSeverity(result: string): 'success' | 'danger' | 'warn' {
    if (result === 'HIT')   return 'success';
    if (result === 'MISS')  return 'danger';
    return 'warn';
  }

  hitPct(t: TokenUsage): number    { return Math.round((t.hits / t.total) * 100); }
  missPct(t: TokenUsage): number   { return Math.round((t.misses / t.total) * 100); }
  wastedPct(s: StrategyUsage): number { return Math.round((s.wasted / s.total) * 100); }

  exportCsv(): void {
    const rows = [
      ['Time', 'Address', 'Token', 'Strategy', 'Result', 'Cost'],
      ...this.filteredRequests.map(r => [
        r.time.toISOString(), r.address, r.token, r.strategy, r.result, r.cost.toFixed(3)
      ])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'google-requests.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  goToStrategies(): void { this.router.navigate(['/search-strategies']); }
}