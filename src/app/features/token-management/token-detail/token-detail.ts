import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { InputNumber } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Divider } from 'primeng/divider';

export interface AttributeItem {
  key: string;
  label: string;
  selected: boolean;
}

export interface AttributeGroup {
  title: string;
  attributes: AttributeItem[];
}

export interface BalanceHistory {
  change: string;
  createdAt: string;
  createdBy: string;
}

export interface TokenDetailModel {
  id: string;
  title: string;
  key: string;
  status: 'ACTIVE' | 'EXPIRED';
  createdBy: string;
  createdAt: string;
  role: string;
  expiresAt: Date | null | string;
  queryLogging: boolean;
  allowNegativeBalance: boolean;
  balance: number | 'Unlimited';
  totalBuildingsReturned: number;
  balanceHistory: BalanceHistory[];
  attributeGroups: AttributeGroup[];
  notificationEmails: string[];
  balanceThreshold: number | null;
}

const MOCK_DETAIL: TokenDetailModel = {
  id: '5',
  title: 'qwedfg',
  key: 'tk_a1b2c3d4e5f6',
  status: 'ACTIVE',
  createdBy: 'psingh@earthdefine.com',
  createdAt: 'Wed Jul 30 2025 18:31:21 GMT-0400 (Eastern Daylight Time)',
  role: 'User',
  expiresAt: null,
  queryLogging: false,
  allowNegativeBalance: false,
  balance: 99999,
  totalBuildingsReturned: 1,
  balanceHistory: [
    { change: 'Set To Value: 100000', createdAt: 'Wed, 30 Jul 2025 22:31:21 GMT', createdBy: 'psingh@earthdefine.com' },
  ],
  attributeGroups: [
    {
      title: 'Base Attributes',
      attributes: [
        { key: 'Address',    label: 'Address',    selected: true },
        { key: 'Address_No', label: 'Address_No', selected: true },
        { key: 'Area_SqFt',  label: 'Area_SqFt',  selected: true },
        { key: 'City',       label: 'City',       selected: true },
        { key: 'County',     label: 'County',     selected: true },
        { key: 'Latitude',   label: 'Latitude',   selected: true },
        { key: 'Longitude',  label: 'Longitude',  selected: true },
        { key: 'State',      label: 'State',      selected: true },
        { key: 'Street',     label: 'Street',     selected: true },
        { key: 'ZIP',        label: 'ZIP',        selected: true },
        { key: 'bld_UUID',   label: 'bld_UUID',   selected: true },
        { key: 'geometry',   label: 'geometry',   selected: true },
      ],
    },
    {
      title: 'Other 2D Attributes',
      attributes: [
        { key: 'GrossArea',      label: 'GrossArea',      selected: true  },
        { key: 'Location',       label: 'Location',       selected: true  },
        { key: 'Shape_area',     label: 'Shape_area',     selected: false },
        { key: 'Shape_Length',   label: 'Shape_Length',   selected: false },
        { key: 'lbcs_function',  label: 'lbcs_function',  selected: true  },
        { key: 'lbcs_ownership', label: 'lbcs_ownership', selected: true  },
        { key: 'lbcs_site',      label: 'lbcs_site',      selected: true  },
        { key: 'lbcs_structure', label: 'lbcs_structure', selected: true  },
        { key: 'll_uuid',        label: 'll_uuid',        selected: true  },
      ],
    },
    {
      title: 'Other 3D Attributes',
      attributes: [
        { key: 'HAG',        label: 'HAG',        selected: true },
        { key: 'LAG',        label: 'LAG',        selected: true },
        { key: 'MaxHeight',  label: 'MaxHeight',  selected: true },
        { key: 'MaxObjectH', label: 'MaxObjectH', selected: true },
        { key: 'MeanHeight', label: 'MeanHeight', selected: true },
        { key: 'Stories',    label: 'Stories',    selected: true },
        { key: 'Volume',     label: 'Volume',     selected: true },
      ],
    },
  ],
  notificationEmails: [],
  balanceThreshold: null,
};

@Component({
  selector: 'app-token-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    Card, ButtonModule, Select, DatePicker,
    ToggleSwitch, Checkbox, InputText,
    InputNumber, TableModule, Tag, Divider,
  ],
  templateUrl: './token-detail.html',
  styleUrls: ['./token-detail.scss'],
})
export class TokenDetailComponent implements OnInit {

  token!: TokenDetailModel;
  keyVisible = false;
  newEmail = '';

  roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'User',  value: 'User'  },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const _id = this.route.snapshot.paramMap.get('id');
    // TODO: replace with tokenService.getById(_id).subscribe(t => this.token = t)
    this.token = { ...MOCK_DETAIL };
  }

  goBack(): void { this.router.navigate(['/token-management']); }

  toggleKey(): void { this.keyVisible = !this.keyVisible; }

  regenerateKey(): void { console.log('Regenerate key'); }

  saveSettings(): void { console.log('Save settings', this.token); }

  cloneToken(): void { console.log('Clone', this.token.id); }

  deactivateToken(): void { console.log('Deactivate', this.token.id); }

  changeBalance(): void { console.log('Change balance'); }

  balanceDisplay(): string {
    if (this.token.balance === 'Unlimited') return 'Unlimited';
    return (this.token.balance as number).toLocaleString();
  }

  groupSelectedCount(group: AttributeGroup): string {
    const selected = group.attributes.filter(a => a.selected).length;
    return `${selected} / ${group.attributes.length}`;
  }

  isGroupAllSelected(group: AttributeGroup): boolean {
    return group.attributes.every(a => a.selected);
  }

  toggleGroupAll(group: AttributeGroup, checked: boolean): void {
    group.attributes.forEach(a => a.selected = checked);
  }

  totalSelectedAttributes(): number {
    return this.token.attributeGroups
      .flatMap(g => g.attributes)
      .filter(a => a.selected).length;
  }

  addEmail(): void {
    if (this.newEmail.trim()) {
      this.token.notificationEmails.push(this.newEmail.trim());
      this.newEmail = '';
    }
  }

  removeEmail(email: string): void {
    this.token.notificationEmails = this.token.notificationEmails.filter(e => e !== email);
  }

  get isActive(): boolean { return this.token?.status === 'ACTIVE'; }
}