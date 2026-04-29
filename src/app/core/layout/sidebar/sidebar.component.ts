import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, ButtonModule],
  template: `
    <aside class="sidebar">

      <div class="sidebar-logo">
        <div class="sidebar-logo-text">EarthDefine</div>
        <div class="sidebar-logo-sub">Admin Portal</div>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
            <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/>
            <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
            <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/>
          </svg>
          Dashboard
        </a>
        <a routerLink="/token-management" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.5"/>
            <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Token Management
        </a>
        <a routerLink="/settings" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 16 16" fill="none">
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="8" cy="8" r="3.5" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Settings
        </a>
        <a routerLink="/search-strategies" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h8M2 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Search Strategies
        </a>
        <a routerLink="/google-requests" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.5"/>
            <path d="M8 4v4l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Google Requests
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar">VK</div>
          <div class="sidebar-email">vikalpa&#64;earthdefine.com</div>
        </div>
        <button class="sidebar-logout">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Logout
        </button>
      </div>

    </aside>
  `,
  styles: [`
    .sidebar {
      width: 220px;
      min-height: 100vh;
      background: #1E3A8A;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: 0;
    }
    .sidebar-logo {
      padding: 22px 18px 16px;
      border-bottom: 1px solid rgba(255,255,255,.1);
    }
    .sidebar-logo-text {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -.3px;
    }
    .sidebar-logo-sub {
      font-size: 11px;
      color: rgba(255,255,255,.45);
      margin-top: 2px;
    }
    .sidebar-nav {
      flex: 1;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255,255,255,.65);
      cursor: pointer;
      text-decoration: none;
      transition: background .15s, color .15s;
    }
    .nav-item:hover {
      background: rgba(255,255,255,.1);
      color: #fff;
    }
    .nav-item.active {
      background: rgba(255,255,255,.18);
      color: #fff;
    }
    .nav-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
    .sidebar-footer {
      padding: 12px 10px;
      border-top: 1px solid rgba(255,255,255,.1);
    }
    .sidebar-user {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      margin-bottom: 2px;
    }
    .sidebar-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255,255,255,.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: #fff;
      flex-shrink: 0;
    }
    .sidebar-email {
      font-size: 11px;
      color: rgba(255,255,255,.55);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .sidebar-logout {
      all: unset;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-radius: 8px;
      font-size: 12px;
      color: rgba(255,255,255,.55);
      cursor: pointer;
      width: 100%;
      box-sizing: border-box;
      transition: background .15s, color .15s;
    }
    .sidebar-logout:hover {
      background: rgba(255,255,255,.08);
      color: rgba(255,255,255,.85);
    }
  `]
})
export class SidebarComponent {}