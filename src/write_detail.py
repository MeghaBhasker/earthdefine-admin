html = """<div class="detail-page" *ngIf="token">

  <div class="breadcrumb">
    <span class="breadcrumb-link" (click)="goBack()">Token Management</span>
    <span class="breadcrumb-sep">›</span>
    <span class="breadcrumb-current">{{ token.title }}</span>
  </div>

  <div class="detail-header">
    <div class="detail-header-left">
      <span class="detail-title">{{ token.title }}</span>
      <p-tag [value]="token.role" severity="warn" [rounded]="true" />
      <p-tag [value]="token.status" [severity]="isActive ? 'success' : 'danger'" [rounded]="true" />
    </div>
    <div class="detail-header-right">
      <p-button label="Clone token" severity="secondary" [outlined]="true" size="small" (onClick)="cloneToken()" />
      <p-button label="Deactivate" severity="danger" size="small" (onClick)="deactivateToken()" *ngIf="isActive" />
    </div>
  </div>

  <div class="detail-grid">

    <div class="left-col">

      <p-card styleClass="detail-card">
        <ng-template pTemplate="header">
          <div class="card-header"><span class="card-title">Token Details</span></div>
        </ng-template>
        <div class="field-list">
          <div class="field-row">
            <div class="field-label">Title</div>
            <div class="field-value fw-medium">{{ token.title }}</div>
          </div>
          <div class="field-row">
            <div class="field-label">Key</div>
            <div class="field-value">
              <div class="key-display">{{ keyVisible ? token.key : 'ek_****' }}</div>
              <div class="key-actions">
                <button class="inline-link" (click)="toggleKey()">{{ keyVisible ? 'Hide Key' : 'Show Key' }}</button>
                <span class="dot-sep">·</span>
                <button class="inline-link" (click)="regenerateKey()">Generate new key</button>
              </div>
            </div>
          </div>
          <div class="field-row">
            <div class="field-label">Status</div>
            <div class="field-value">
              <p-tag [value]="token.status" [severity]="isActive ? 'success' : 'danger'" [rounded]="true" />
            </div>
          </div>
          <div class="field-row no-border">
            <div class="field-label">Created</div>
            <div class="field-value muted-sm">
              <div>By {{ token.createdBy }}</div>
              <div>{{ token.createdAt }}</div>
            </div>
          </div>
        </div>
      </p-card>

      <div class="gap"></div>

      <p-card styleClass="detail-card">
        <ng-template pTemplate="header">
          <div class="card-header">
            <span class="card-title">Settings</span>
            <p-button label="Save" size="small" (onClick)="saveSettings()" />
          </div>
        </ng-template>
        <div class="field-list">
          <div class="field-row">
            <div class="field-label">Role</div>
            <div class="field-value">
              <p-select [(ngModel)]="token.role" [options]="roleOptions" optionLabel="label" optionValue="value" styleClass="compact-select" />
            </div>
          </div>
          <div class="field-row">
            <div class="field-label">Expiration</div>
            <div class="field-value">
              <p-datepicker [(ngModel)]="token.expiresAt" placeholder="No expiry" [showClear]="true" dateFormat="mm/dd/yy" styleClass="compact-select" />
            </div>
          </div>
          <div class="field-row">
            <div class="field-label">Query logging</div>
            <div class="field-value"><p-toggleswitch [(ngModel)]="token.queryLogging" /></div>
          </div>
          <div class="field-row no-border">
            <div class="field-label">Allow negative balance</div>
            <div class="field-value"><p-toggleswitch [(ngModel)]="token.allowNegativeBalance" /></div>
          </div>
        </div>
      </p-card>

      <div class="gap"></div>

      <p-card styleClass="detail-card">
        <ng-template pTemplate="header">
          <div class="card-header"><span class="card-title">Notification Settings</span></div>
        </ng-template>
        <div class="notif-grid">
          <div>
            <div class="notif-title">Notification emails</div>
            <div class="notif-sub">These emails will receive notifications from the server</div>
            <div class="email-input-row">
              <input pInputText [(ngModel)]="newEmail" placeholder="New email..." class="notif-input" (keyup.enter)="addEmail()" />
              <p-button icon="pi pi-plus" severity="secondary" [outlined]="true" size="small" (onClick)="addEmail()" />
            </div>
          </div>
          <div>
            <div class="notif-title">Balance notification thresholds</div>
            <div class="notif-sub">Send email notifications when balance percentage is below a set threshold</div>
            <p-inputnumber [(ngModel)]="token.balanceThreshold" placeholder="e.g. 20" suffix="%" [min]="0" [max]="100" styleClass="notif-input" />
          </div>
        </div>
      </p-card>

    </div>

    <div class="right-col">

      <p-card styleClass="detail-card">
        <ng-template pTemplate="header">
          <div class="card-header"><span class="card-title">Balance</span></div>
        </ng-template>
        <div class="balance-hero">
          <div class="balance-number">{{ balanceDisplay() }}</div>
          <div class="balance-sub">Total buildings returned: {{ token.totalBuildingsReturned }}</div>
          <p-button label="Change Balance" styleClass="balance-btn" (onClick)="changeBalance()" />
        </div>
      </p-card>

      <div class="gap"></div>

      <p-card styleClass="detail-card">
        <ng-template pTemplate="header">
          <div class="card-header"><span class="card-title">Balance Change History</span></div>
        </ng-template>
        <p-table [value]="token.balanceHistory" styleClass="history-table">
          <ng-template pTemplate="header">
            <tr><th>Balance Change</th><th>Created</th></tr>
          </ng-template>
          <ng-template pTemplate="body" let-h>
            <tr>
              <td>{{ h.change }}</td>
              <td class="muted-sm">{{ h.createdAt }}<br>By {{ h.createdBy }}</td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr><td colspan="2" class="empty-cell">No history yet</td></tr>
          </ng-template>
        </p-table>
      </p-card>

      <div class="gap"></div>

      <p-card styleClass="detail-card">
        <ng-template pTemplate="header">
          <div class="card-header">
            <span class="card-title">Available Attributes</span>
            <span class="attr-total-badge">{{ totalSelectedAttributes() }} selected</span>
          </div>
        </ng-template>
        <div *ngFor="let group of token.attributeGroups; let last = last">
          <div class="attr-group-header">
            <p-checkbox [binary]="true" [ngModel]="isGroupAllSelected(group)" (ngModelChange)="toggleGroupAll(group, $event)" [inputId]="'group-' + group.title" />
            <label [for]="'group-' + group.title" class="attr-group-title">{{ group.title }}</label>
            <span class="attr-group-count">{{ groupSelectedCount(group) }}</span>
          </div>
          <div class="attr-grid">
            <div *ngFor="let attr of group.attributes" class="attr-item">
              <p-checkbox [(ngModel)]="attr.selected" [binary]="true" [inputId]="attr.key" />
              <label [for]="attr.key" class="attr-label">{{ attr.label }}</label>
            </div>
          </div>
          <p-divider *ngIf="!last" />
        </div>
      </p-card>

    </div>

  </div>

</div>
"""

with open('src/app/features/token-management/token-detail/token-detail.html', 'w') as f:
    f.write(html)
print('Done')
