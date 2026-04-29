import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const MOCK_KPI = [
  { icon: 'pi-ticket',               label: 'TOTAL ACTIVE TOKENS',    value: '5',       trend: 'across all plans',      trendType: 'neutral',   accent: '#3B82F6' },
  { icon: 'pi-chart-line',           label: 'API CALLS THIS MONTH',   value: '12,847',  trend: '↑ 18% vs last month',   trendType: 'up',        accent: '#8B5CF6' },
  { icon: 'pi-map-marker',           label: 'GOOGLE MAPS COST (APR)', value: '$128.34', trend: '↓ 84% vs Mar',          trendType: 'down-good', accent: '#10B981' },
  { icon: 'pi-database',             label: 'CACHE HIT RATE',         value: '84.2%',   trend: '↑ 3.1% vs last month',  trendType: 'up',        accent: '#0EA5E9' },
];

const MOCK_COSTS = {
  labels: ['Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026'],
  values: [27164.74, 11107.41, 788.65, 175.00, 128.34],
};

const MOCK_FUNNEL = [
  { name: 'RULE_BASED_ADDRESS_COMPONENTS_FULLTEXT_S', pct: 100, count: 399 },
  { name: 'GEOCODIO_GEO_LOCATION_WITH_NUMBER_MATCH',  pct: 52,  count: 219 },
  { name: 'GEOCODIO_ADDRESS_COMPONENTS_FULLTEXT_SIN', pct: 10,  count: 140 },
  { name: 'GEOCODIO_GEO_LOCATION_WITH_NUMBER_MATCHI', pct: 8,   count: 92  },
  { name: 'AWS_SEARCH_STRATEGY_WITH_ESRI',            pct: 6,   count: 68  },
  { name: 'TOMTOM_SIMPLE_SEARCH_STRATEGY',            pct: 5,   count: 57  },
  { name: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION',    pct: 5,   count: 50  },
  { name: 'EMPTY_RESULT',                             pct: 0,   count: 0   },
];

const FUNNEL_GRADIENTS = ['#3B82F6','#4F6DDD','#6358CC','#7743BA','#8B2EA9','#9F1997','#B30485'];
const FUNNEL_MIN_WIDTH = 18;

const MOCK_FAILED = [
  { label: 'No matching buildings found', count: 1111, color: '#F97316' },
  { label: 'Non-US address',              count: 332,  color: '#EAB308' },
  { label: 'Invalid address',             count: 193,  color: '#94A3B8' },
  { label: 'Address processing error',    count: 10,   color: '#EF4444' },
];

const MOCK_QUERY_COUNT = {
  labels: ['6PM','9PM','12AM','3AM','6AM','9AM','12PM','3PM'],
  data:   [0, 0, 0, 0, 0, 45, 142, 0],
};

const MOCK_CACHED = {
  labels: ['6PM','9PM','12AM','3AM','6AM','9AM','12PM','3PM'],
  total:  [0, 0, 0, 0, 0, 2700, 3100, 120],
  cached: [0, 0, 0, 0, 0, 2300, 2700, 80],
};

const MOCK_INVOCATIONS = {
  labels: ['Grainger', 'Default', 'AWS', 'TomTom', 'Geocodio'],
  data:   [3421, 2800, 1950, 1300, 980],
};

const MOCK_DAILY_QUERIES = {
  labels: ['Apr 17','Apr 18','Apr 19','Apr 20','Apr 21','Apr 22','Apr 23','Apr 24','Apr 25','Apr 26','Apr 27','Apr 28'],
  total:  [512, 0, 4, 145, 2343, 906, 0, 989, 1, 0, 11, 0],
  google: [0,   0, 0, 0,   27,   0,   0, 1,   0, 0, 0,  0],
  pct:    [0,   0, 0, 0,   1.15, 0,   0, 0.1, 0, 0, 0,  0],
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, SelectModule, DatePickerModule, TableModule],
  template: `
    <div class="dashboard">

      <div class="page-header">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-sub">Overview of platform activity</p>
      </div>

      <!-- DASH-01 -->
      <div class="kpi-grid">
        <div *ngFor="let k of kpis" class="kpi-card" [style.border-left-color]="k.accent">
          <div class="kpi-card-top">
            <div class="kpi-icon-wrap" [style.background]="k.accent + '18'">
              <i class="pi {{ k.icon }}" [style.color]="k.accent"></i>
            </div>
          </div>
          <div class="kpi-label">{{ k.label }}</div>
          <div class="kpi-value">{{ k.value }}</div>
          <div class="kpi-trend" [ngClass]="k.trendType">{{ k.trend }}</div>
        </div>
      </div>

      <!-- DASH-02 + DASH-03 -->
      <div class="cost-funnel-grid">

        <p-card styleClass="cost-card">
          <ng-template pTemplate="header">
            <div class="card-header"><div class="card-title">Google Map Monthly Costs</div></div>
          </ng-template>
          <div class="cost-chart-wrap"><canvas #costChart></canvas></div>
        </p-card>

        <p-card styleClass="funnel-card">
          <ng-template pTemplate="header">
            <div class="card-header">
              <div>
                <div class="card-title">Strategies Effectiveness Funnel</div>
                <div class="card-sub">{{ funnelTotal | number }} total resolutions</div>
              </div>
              <div class="header-right">
                <p-select [(ngModel)]="funnelRange" [options]="funnelRanges" optionLabel="label" optionValue="value" styleClass="compact-select" />
                <p-datepicker *ngIf="funnelRange === 'custom'" [(ngModel)]="funnelCustomRange" selectionMode="range" [readonlyInput]="true" placeholder="Select date range" styleClass="compact-datepicker" />
              </div>
            </div>
          </ng-template>
          <div class="funnel-scroll">
            <div *ngFor="let s of funnelFiltered; let i = index" class="funnel-row">
              <div class="funnel-meta">
                <span class="funnel-name" [title]="s.name">{{ s.name }}</span>
                <span class="funnel-count">{{ s.count | number }}</span>
              </div>
              <div class="funnel-track">
                <div class="funnel-bar" [style.width.%]="funnelVisualWidth(s.pct)" [style.background]="funnelColor(i)">
                  {{ s.pct }}%
                </div>
              </div>
            </div>
          </div>
          <div class="funnel-token-row">
            <span class="funnel-token-label">Token</span>
            <p-select [(ngModel)]="funnelToken" [options]="funnelTokens" optionLabel="label" optionValue="value" [filter]="true" filterPlaceholder="Search tokens..." styleClass="funnel-token-select" placeholder="All tokens" />
          </div>
        </p-card>

      </div>

      <!-- DASH-04 -->
      <div class="failed-grid">
        <p-card styleClass="failed-card">
          <ng-template pTemplate="header">
            <div class="card-header"><div class="card-title">Failed Requests Summary</div></div>
          </ng-template>
          <div class="failed-list">
            <div *ngFor="let f of failed" class="failed-row">
              <div class="failed-left">
                <span class="failed-dot" [style.background]="f.color"></span>
                <span class="failed-label">{{ f.label }}</span>
              </div>
              <div class="failed-right">
                <div class="failed-bar-wrap">
                  <div class="failed-bar-fill" [style.width.%]="failedBarWidth(f.count)" [style.background]="f.color"></div>
                </div>
                <strong class="failed-count">{{ f.count | number }}</strong>
              </div>
            </div>
          </div>
          <div class="failed-token-row">
            <span class="failed-token-label">Token</span>
            <p-select [(ngModel)]="failedToken" [options]="failedTokens" optionLabel="label" optionValue="value" [filter]="true" filterPlaceholder="Search tokens..." styleClass="failed-token-select" placeholder="All tokens" />
          </div>
        </p-card>
      </div>

      <!-- DASH-05 + DASH-06 -->
      <div class="charts-grid">
        <p-card styleClass="chart-card">
          <ng-template pTemplate="header">
            <div class="card-header">
              <div><div class="card-title">Google Map Query Count</div><div class="card-sub">Hourly · last 24 hours</div></div>
              <p-select [(ngModel)]="queryGranularity" [options]="granularities" optionLabel="label" optionValue="value" styleClass="compact-select" />
            </div>
          </ng-template>
          <div class="chart-wrap"><canvas #queryChart></canvas></div>
        </p-card>
        <p-card styleClass="chart-card">
          <ng-template pTemplate="header">
            <div class="card-header">
              <div><div class="card-title">Total Requests vs Cached</div><div class="card-sub">Hourly · last 24 hours</div></div>
              <p-select [(ngModel)]="cacheGranularity" [options]="granularities" optionLabel="label" optionValue="value" styleClass="compact-select" />
            </div>
          </ng-template>
          <div class="chart-wrap"><canvas #cacheChart></canvas></div>
        </p-card>
      </div>

      <!-- DASH-07 -->
      <div class="invocations-grid">
        <p-card styleClass="chart-card">
          <ng-template pTemplate="header">
            <div class="card-header">
              <div><div class="card-title">Invocations Count by Search Strategy</div><div class="card-sub">By token</div></div>
              <div class="header-right">
                <p-select [(ngModel)]="selectedInvToken" [options]="funnelTokens" optionLabel="label" optionValue="value" [filter]="true" filterPlaceholder="Search tokens..." styleClass="compact-select" placeholder="All tokens" />
              </div>
            </div>
          </ng-template>
          <div class="chart-wrap"><canvas #invocationsChart></canvas></div>
        </p-card>
      </div>

      <!-- DASH-08 -->
      <div class="daily-grid">
        <p-card styleClass="chart-card">
          <ng-template pTemplate="header">
            <div class="card-header">
              <div>
                <div class="card-title">Daily Google Queries Percentage</div>
                <div class="card-sub">Total Google: <strong>{{ dailyTotalGoogle | number }}</strong> &nbsp;·&nbsp; Total Requests: <strong>{{ dailyTotalRequests | number }}</strong> &nbsp;·&nbsp; Overall: <strong>{{ dailyOverallPct }}%</strong></div>
              </div>
              <div class="header-right">
                <p-select [(ngModel)]="dailyRange" [options]="dailyRanges" optionLabel="label" optionValue="value" styleClass="compact-select" />
                <p-datepicker *ngIf="dailyRange === 'custom'" [(ngModel)]="dailyQueryRange" selectionMode="range" [readonlyInput]="true" placeholder="Select date range" styleClass="compact-datepicker" />
              </div>
            </div>
          </ng-template>
          <div class="chart-wrap-tall"><canvas #dailyChart></canvas></div>
        </p-card>
      </div>

    </div>
  `,
  styles: [`
    .page-header  { margin-bottom: 18px }
    .page-title   { font-size: 20px; font-weight: 600; letter-spacing: -.2px }
    .page-sub     { font-size: 13px; color: #64748B; margin-top: 2px }

    /* KPI */
    .kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 16px }
    .kpi-card {
      background: #fff; border: 1px solid #E2E8F0; border-left: 4px solid;
      border-radius: 10px; padding: 16px 18px; transition: box-shadow .15s;
    }
    .kpi-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,.07) }
    .kpi-icon-wrap { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px }
    .kpi-icon-wrap i { font-size: 16px }
    .kpi-label { font-size: 11px; font-weight: 600; color: #64748B; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px }
    .kpi-value { font-size: 26px; font-weight: 300; letter-spacing: -.5px; margin-bottom: 3px; color: #0F172A }
    .kpi-trend { font-size: 12px }
    .kpi-trend.neutral   { color: #64748B }
    .kpi-trend.up        { color: #15803D }
    .kpi-trend.down-good { color: #15803D }
    .kpi-trend.warn      { color: #F97316 }

    /* cost + funnel — equal width, independent height */
    .cost-funnel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; align-items: start; align-self: start }
    ::ng-deep .cost-card .p-card-body, ::ng-deep .funnel-card .p-card-body { padding: 0 }
    ::ng-deep .cost-card .p-card-content, ::ng-deep .funnel-card .p-card-content { padding: 14px 18px }

    .card-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 14px 18px 0; gap: 12px }
    .card-title  { font-size: 14px; font-weight: 600 }
    .card-sub    { font-size: 12px; color: #64748B; margin-top: 2px }
    .header-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex-shrink: 0 }

    ::ng-deep .compact-select .p-select-label { padding: 5px 10px !important; font-size: 12px !important }
    ::ng-deep .compact-datepicker .p-datepicker-input { padding: 5px 10px !important; font-size: 12px !important; width: 190px }

    /* cost chart fixed height */
    .cost-chart-wrap { position: relative; height: 420px }

    /* funnel */
    .funnel-scroll { display: flex; flex-direction: column; gap: 5px; overflow: hidden }
    .funnel-row  { display: flex; flex-direction: column; gap: 3px }
    .funnel-meta { display: flex; justify-content: space-between; align-items: baseline }
    .funnel-name { font-size: 11px; color: #64748B; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 75% }
    .funnel-count { font-size: 11px; font-weight: 500; color: #0F172A; flex-shrink: 0 }
    .funnel-track { background: #F1F5F9; border-radius: 20px; height: 26px; overflow: hidden }
    .funnel-bar { height: 100%; border-radius: 20px; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; font-size: 11px; font-weight: 500; color: #fff; transition: opacity .15s }
    .funnel-bar:hover { opacity: .85 }
    .funnel-token-row { display: flex; align-items: center; gap: 12px; margin-top: 12px; padding-top: 12px; border-top: 1px solid #E2E8F0 }
    .funnel-token-label { font-size: 13px; color: #64748B; white-space: nowrap }
    ::ng-deep .funnel-token-select { flex: 1 }
    ::ng-deep .funnel-token-select .p-select-label { font-size: 13px !important }

    /* failed with bars */
    .failed-grid { margin-bottom: 16px }
    ::ng-deep .failed-card .p-card-body    { padding: 0 }
    ::ng-deep .failed-card .p-card-content { padding: 14px 18px }
    .failed-list  { display: flex; flex-direction: column }
    .failed-row   { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F1F5F9 }
    .failed-row:last-child { border: none }
    .failed-left  { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0 }
    .failed-dot   { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0 }
    .failed-label { font-size: 13px; color: #334155 }
    .failed-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0 }
    .failed-bar-wrap { width: 140px; height: 6px; background: #F1F5F9; border-radius: 3px; overflow: hidden }
    .failed-bar-fill { height: 100%; border-radius: 3px; transition: width .4s }
    .failed-count { font-size: 13px; font-weight: 600; color: #0F172A; min-width: 44px; text-align: right }
    .failed-token-row { display: flex; align-items: center; gap: 12px; margin-top: 14px; padding-top: 12px; border-top: 1px solid #E2E8F0 }
    .failed-token-label { font-size: 13px; color: #64748B; white-space: nowrap }
    ::ng-deep .failed-token-select { flex: 1 }
    ::ng-deep .failed-token-select .p-select-label { font-size: 13px !important }

    /* charts */
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px }
    ::ng-deep .chart-card .p-card-body    { padding: 0 }
    ::ng-deep .chart-card .p-card-content { padding: 14px 18px }
    .chart-wrap      { position: relative; height: 180px }
    .chart-wrap-tall { position: relative; height: 240px }

    .invocations-grid { margin-bottom: 16px }
    .invocation-filters { display: flex; gap: 12px; margin-bottom: 12px; flex-wrap: wrap }
    .inv-filter { display: flex; flex-direction: column; gap: 4px }
    .inv-filter label { font-size: 11px; color: #64748B }
    ::ng-deep .inv-strategy-select { min-width: 280px }
    ::ng-deep .inv-token-select    { min-width: 180px }
    .daily-grid { margin-bottom: 16px }


    @media(max-width: 900px) {
      .kpi-grid { grid-template-columns: 1fr 1fr }
      .cost-funnel-grid { grid-template-columns: 1fr }
      .charts-grid { grid-template-columns: 1fr }
    }
  `]
})
export class Dashboard implements AfterViewInit, OnDestroy {

  @ViewChild('costChart')        costChartRef!:  ElementRef<HTMLCanvasElement>;
  @ViewChild('queryChart')       queryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('cacheChart')       cacheChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('invocationsChart') invChartRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('dailyChart')       dailyChartRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  kpis        = MOCK_KPI;
  funnel = MOCK_FUNNEL;
  failed = MOCK_FAILED;

  funnelRange = '24h';
  funnelToken = 'all';
  funnelCustomRange: Date[] | null = null;
  funnelRanges = [
    { label: 'All time',      value: 'all'    },
    { label: 'Last 7 days',   value: '7d'     },
    { label: 'Last 24 hours', value: '24h'    },
    { label: 'Last 12 hours', value: '12h'    },
    { label: 'Last hour',     value: '1h'     },
    { label: 'Custom',        value: 'custom' },
  ];
  funnelTokens = [
    { label: 'All tokens',                                  value: 'all'      },
    { label: 'Anirudh Balaji (17d787f1)',                   value: '17d787f1' },
    { label: 'Guest 40ebd48a-9fe9-4a29-93d4-9009978a7119', value: 'guest'    },
    { label: 'emailTestSimar (3a2f1b9c)',                   value: '3a2f1b9c' },
  ];

  get funnelFiltered() { return this.funnel.filter(s => s.count > 0); }
  get funnelTotal()    { return this.funnelFiltered.reduce((sum, s) => sum + s.count, 0); }
  funnelVisualWidth(pct: number): number { return Math.max(pct, FUNNEL_MIN_WIDTH); }
  funnelColor(i: number): string { return FUNNEL_GRADIENTS[i] ?? FUNNEL_GRADIENTS[FUNNEL_GRADIENTS.length - 1]; }

  failedToken  = 'all';
  failedTokens = this.funnelTokens;
  failedBarWidth(count: number): number {
    const max = Math.max(...this.failed.map(f => f.count));
    return (count / max) * 100;
  }

  queryGranularity = 'hourly';
  cacheGranularity = 'hourly';
  granularities = [
    { label: '5 min',  value: '5m'     },
    { label: '30 min', value: '30m'    },
    { label: 'Hourly', value: 'hourly' },
    { label: 'Daily',  value: 'daily'  },
  ];

  selectedStrategy = 'rule_based';
  selectedInvToken = 'all';
  strategies = [
    { label: 'RULE_BASED_ADDRESS_COMPONENTS_FULLTEXT_SINGLE_RESULT', value: 'rule_based' },
    { label: 'GEOCODIO_GEO_LOCATION_WITH_NUMBER_MATCHING',           value: 'geocodio'   },
    { label: 'GOOGLE_MAPS_PURE_ADDRESS_GEO_LOCATION',                value: 'gmaps'      },
  ];

  dailyRange = '7d';
  dailyQueryRange: Date[] | null = null;
  dailyRanges = [
    { label: 'All time',      value: 'all'    },
    { label: 'Last 30 days',  value: '30d'    },
    { label: 'Last 7 days',   value: '7d'     },
    { label: 'Last 24 hours', value: '24h'    },
    { label: 'Custom',        value: 'custom' },
  ];

  get dailyTotalGoogle():   number { return MOCK_DAILY_QUERIES.google.reduce((a, b) => a + b, 0); }
  get dailyTotalRequests(): number { return MOCK_DAILY_QUERIES.total.reduce((a, b) => a + b, 0); }
  get dailyOverallPct(): string {
    if (this.dailyTotalRequests === 0) return '0.00';
    return ((this.dailyTotalGoogle / this.dailyTotalRequests) * 100).toFixed(2);
  }

  ngAfterViewInit() { setTimeout(() => this.initCharts(), 100); }
  ngOnDestroy()     { this.charts.forEach(c => c.destroy()); }

  private initCharts() {
    const baseOpts: any = {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { font: { size: 10 } }, grid: { display: false } },
        y: { ticks: { font: { size: 10 } }, grid: { color: '#F1F5F9' } }
      }
    };

    const grad = (canvas: HTMLCanvasElement, c1: string, c2: string) => {
      const ctx = canvas.getContext('2d')!;
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height || 200);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      return g;
    };

    // DASH-02
    new Chart(this.costChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: MOCK_COSTS.labels,
        datasets: [{
          label: 'Cost ($)', data: MOCK_COSTS.values,
          borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.08)',
          borderWidth: 2.5, pointRadius: 5, pointHoverRadius: 7,
          pointBackgroundColor: '#3B82F6', pointBorderColor: '#fff', pointBorderWidth: 2,
          fill: true, tension: 0.35,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff', titleColor: '#0F172A', bodyColor: '#3B82F6',
            borderColor: '#E5E7EB', borderWidth: 1, padding: 12, cornerRadius: 10,
            titleFont: { size: 12 }, bodyFont: { size: 12, weight: 'bold' as any },
            callbacks: { label: (item: any) => 'cost : $' + item.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10 }, color: '#94A3B8' }, border: { display: false } },
          y: { grid: { color: 'rgba(0,0,0,0.04)' }, min: 0, suggestedMax: 30000, ticks: { font: { size: 10 }, color: '#94A3B8', callback: (v: any) => v >= 1000 ? '$' + (v / 1000).toFixed(0) + 'K' : '$' + v }, border: { display: false } }
        }
      }
    });

    // DASH-05
    new Chart(this.queryChartRef.nativeElement, {
      type: 'bar',
      data: { labels: MOCK_QUERY_COUNT.labels, datasets: [{ data: MOCK_QUERY_COUNT.data, backgroundColor: grad(this.queryChartRef.nativeElement, '#60A5FA', '#1D4ED8'), borderRadius: 4 }] },
      options: baseOpts
    });

    // DASH-06: stacked — uncached (red) bottom, cached (green) top
    const uncachedData = MOCK_CACHED.total.map((t, i) => t - MOCK_CACHED.cached[i]);
    new Chart(this.cacheChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: MOCK_CACHED.labels,
        datasets: [
          {
            label: 'Uncached',
            data: uncachedData,
            backgroundColor: grad(this.cacheChartRef.nativeElement, '#F87171', '#DC2626'),
            borderRadius: 0,
            stack: 'requests',
          },
          {
            label: 'Cached',
            data: MOCK_CACHED.cached,
            backgroundColor: grad(this.cacheChartRef.nativeElement, '#4ADE80', '#16A34A'),
            borderRadius: 4,
            stack: 'requests',
          },
        ]
      },
      options: {
        ...baseOpts,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10 } },
          tooltip: {
            callbacks: {
              label: (ctx: any) => ` ${ctx.dataset.label.toLowerCase()} : ${ctx.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          x: { ticks: { font: { size: 10 } }, grid: { display: false }, stacked: true },
          y: { ticks: { font: { size: 10 } }, grid: { color: '#F1F5F9' }, stacked: true }
        }
      }
    });

    // DASH-07: invocations by token name
    new Chart(this.invChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: MOCK_INVOCATIONS.labels,
        datasets: [{
          data: MOCK_INVOCATIONS.data,
          backgroundColor: grad(this.invChartRef.nativeElement, '#60A5FA', '#1D4ED8'),
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        ...baseOpts,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#fff', titleColor: '#0F172A', bodyColor: '#1D4ED8',
            borderColor: '#E5E7EB', borderWidth: 1, padding: 10, cornerRadius: 8,
            callbacks: { label: (ctx: any) => ` count : ${ctx.parsed.y.toLocaleString()}` }
          }
        }
      }
    });

    // DASH-08
    new Chart(this.dailyChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: MOCK_DAILY_QUERIES.labels,
        datasets: [
          { label: 'Total requests',  data: MOCK_DAILY_QUERIES.total,  backgroundColor: grad(this.dailyChartRef.nativeElement, '#93C5FD', '#BFDBFE'), borderRadius: 4, order: 2 },
          { label: 'Google requests', data: MOCK_DAILY_QUERIES.google, backgroundColor: grad(this.dailyChartRef.nativeElement, '#3B82F6', '#1D4ED8'), borderRadius: 4, order: 2 },
          { label: 'Google %', data: MOCK_DAILY_QUERIES.pct, type: 'line' as any, borderColor: '#F97316', backgroundColor: 'rgba(249,115,22,.1)', borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#F97316', fill: false, yAxisID: 'y1', order: 1 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: true, position: 'bottom', labels: { font: { size: 10 }, boxWidth: 10 } },
          tooltip: { callbacks: { label: (ctx: any) => ctx.dataset.label === 'Google %' ? ` Google %: ${ctx.parsed.y.toFixed(2)}%` : ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}` } }
        },
        scales: {
          x:  { ticks: { font: { size: 10 } }, grid: { display: false } },
          y:  { ticks: { font: { size: 10 } }, grid: { color: '#F1F5F9' } },
          y1: { position: 'right', ticks: { font: { size: 10 }, callback: (v: any) => v + '%' }, grid: { display: false } }
        }
      }
    });
  }
}