import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

export interface Token {
  id: string;
  title: string;
  key?: string;
  status: 'ACTIVE' | 'EXPIRED';
  balance: number | 'Unlimited';
  role: 'Admin' | 'User';
  createdBy: string;
  createdAt: string;
  expiresAt: string | 'Never';
  attributeCount: number;
  isGuest?: boolean;
}

const MOCK_TOKENS: Token[] = [
  { id: '1', title: 'tempcheckadmin',  key: 'tk_abc123', status: 'ACTIVE',  balance: 'Unlimited', role: 'Admin', createdBy: 'psingh@earthdefine.com', createdAt: 'Apr 20, 2026, 5:30 PM', expiresAt: 'May 21, 2026, 5:30 PM', attributeCount: 44 },
  { id: '2', title: 'Testing-Anirudh', key: 'tk_def456', status: 'ACTIVE',  balance: 'Unlimited', role: 'Admin', createdBy: 'psingh@earthdefine.com', createdAt: 'Feb 13, 2026, 7:54 PM', expiresAt: 'Dec 31, 2027, 7:53 PM', attributeCount: 43 },
  { id: '3', title: 'uattest',         key: 'tk_ghi789', status: 'EXPIRED', balance: 'Unlimited', role: 'Admin', createdBy: 'psingh@earthdefine.com', createdAt: 'Oct 6, 2025, 2:38 PM',  expiresAt: 'Jan 31, 2026, 2:38 PM', attributeCount: 44 },
  { id: '4', title: 'Guest 773f53e4',  key: 'tk_jkl012', status: 'EXPIRED', balance: 'Unlimited', role: 'Admin', createdBy: 'psingh@earthdefine.com', createdAt: 'Aug 1, 2025, 10:47 AM', expiresAt: 'Aug 15, 2025, 10:47 AM', attributeCount: 52, isGuest: true },
  { id: '5', title: 'qwedfg',          key: 'tk_mno345', status: 'ACTIVE',  balance: 99999,       role: 'User',  createdBy: 'psingh@earthdefine.com', createdAt: 'Jul 30, 2025, 6:31 PM', expiresAt: 'Never',                 attributeCount: 40 },
  { id: '6', title: 'likewhat',        key: 'tk_pqr678', status: 'EXPIRED', balance: 'Unlimited', role: 'Admin', createdBy: 'psingh@earthdefine.com', createdAt: 'Aug 1, 2025, 10:36 AM', expiresAt: 'Aug 30, 2025, 10:36 AM', attributeCount: 52 },
];

@Component({
  selector: 'app-token-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, TableModule, ButtonModule, CheckboxModule, TagModule, InputTextModule],
  templateUrl: './token-list.html',
  styleUrls: ['./token-list.scss'],
})
export class TokenListComponent implements OnInit {

  tokens: Token[] = [];
  showGuestTokens = false;
  showActiveOnly  = false;
  copiedId: string | null = null;
  searchQuery = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.tokens = MOCK_TOKENS;
  }

  get filteredTokens(): Token[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.tokens.filter(t => {
      if (!this.showGuestTokens && t.isGuest) return false;
      if (this.showActiveOnly && t.status !== 'ACTIVE') return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.createdBy.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  get activeCount():  number { return this.tokens.filter(t => t.status === 'ACTIVE').length; }
  get expiredCount(): number { return this.tokens.filter(t => t.status === 'EXPIRED').length; }

  goToDetail(token: Token): void { this.router.navigate(['/token-management', token.id]); }
  goToCreate(): void              { this.router.navigate(['/token-management', 'create']); }

  copyKey(token: Token, event: Event): void {
    event.stopPropagation();
    navigator.clipboard.writeText(token.key ?? '').then(() => {
      this.copiedId = token.id;
      setTimeout(() => this.copiedId = null, 2000);
    });
  }

  cloneToken(token: Token, event: Event): void {
    event.stopPropagation();
    console.log('Clone token:', token.id);
  }

  isExpired(token: Token): boolean { return token.status === 'EXPIRED'; }

  statusSeverity(token: Token): 'success' | 'danger' {
    return token.status === 'ACTIVE' ? 'success' : 'danger';
  }

  balanceDisplay(token: Token): string {
    if (token.balance === 'Unlimited') return 'Unlimited';
    return (token.balance as number).toLocaleString();
  }
}