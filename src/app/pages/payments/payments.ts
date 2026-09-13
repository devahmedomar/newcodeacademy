import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Card } from 'primeng/card';
import { Tag } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { PortalService } from '../../services/portal.service';
import { I18nService } from '../../services/i18n.service';
import { Payment } from '../../models';

@Component({
  selector: 'app-payments',
  imports: [DatePipe, Card, Tag, TableModule],
  styleUrl: './payments.css',
  templateUrl: './payments.html',
})
export class Payments {
  private portal = inject(PortalService);
  i18n = inject(I18nService);

  payments = signal<Payment[]>([]);
  current = signal<Payment | null>(null);
  currentMonth = signal('');
  loading = signal(true);
  error = signal('');

  async ngOnInit() {
    try {
      const profile = await this.portal.getMyProfile();
      this.payments.set(profile.payments);
      this.current.set(profile.currentPayment);
      this.currentMonth.set(profile.currentMonth);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Failed to load payments');
    } finally {
      this.loading.set(false);
    }
  }

  severity(status: string): 'success' | 'warn' | 'danger' | 'secondary' {
    if (status === 'paid') return 'success';
    if (status === 'late') return 'danger';
    return 'warn';
  }
}