import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PortalService } from '../../services/portal.service';
import { Payment } from '../../models';

@Component({
  selector: 'app-payments',
  imports: [DatePipe],
  styleUrl: './payments.css',
  templateUrl: './payments.html',
})
export class Payments {
  private portal = inject(PortalService);

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
}