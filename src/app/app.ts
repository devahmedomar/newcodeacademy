import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { I18nService } from './services/i18n.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Button, Tooltip, FormsModule, Dialog, FloatLabel, InputText, Message],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  constructor(public auth: AuthService, public theme: ThemeService) {}

  i18n = inject(I18nService);

  showPassDialog = false;
  passCurrent = '';
  passNew = '';
  passMsg = '';
  passErr = '';
  changing = false;

  logout() {
    this.auth.logout();
    window.location.href = '/login';
  }

  openPassDialog() {
    this.passCurrent = '';
    this.passNew = '';
    this.passMsg = '';
    this.passErr = '';
    this.showPassDialog = true;
  }

  async changePassword() {
    this.changing = true;
    this.passErr = '';
    this.passMsg = '';
    try {
      await this.auth.changePassword(this.passCurrent, this.passNew);
      this.passCurrent = '';
      this.passNew = '';
      this.passMsg = this.i18n.t('app.passChanged');
    } catch (e) {
      this.passErr = e instanceof Error ? e.message : this.i18n.t('app.passFailed');
    } finally {
      this.changing = false;
    }
  }

  langToggleLabel() {
    return this.i18n.lang() === 'ar' ? 'EN' : 'العربية';
  }
}