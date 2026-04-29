import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-create-token',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    CardModule, ButtonModule,
    InputTextModule, SelectModule, DatePickerModule,
    CheckboxModule, InputNumberModule, DividerModule,
    IftaLabelModule,
  ],
  templateUrl: './create-token.html',
  styleUrls: ['./create-token.scss'],
})
export class CreateToken {
  title = '';
  status = 'ACTIVE';
  expirationDate: Date | null = null;
  isAdmin = false;
  queryLogging = false;
  notificationEmail = '';
  unlimited = true;
  callLimit: number | null = null;

  statusOptions = [
    { label: 'ACTIVE',  value: 'ACTIVE'  },
    { label: 'EXPIRED', value: 'EXPIRED' },
  ];

  constructor(private router: Router) {}

  get isValid(): boolean { return this.title.trim().length > 0; }

  create(): void {
    if (!this.isValid) return;
    console.log('Create token', this);
    this.router.navigate(['/token-management']);
  }

  cancel(): void {
    this.router.navigate(['/token-management']);
  }
}