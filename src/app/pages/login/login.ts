import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { Message } from 'primeng/message';
import { Tooltip } from 'primeng/tooltip';
import { AuthService } from '../../services/auth.service';
import { I18nService } from '../../services/i18n.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, InputText, Password, Button, Card, FloatLabel, Message, Tooltip],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    public i18n: I18nService,
    public theme: ThemeService,
  ) {}

  async submit() {
    this.error = '';
    this.loading = true;
    try {
      const user = await this.auth.login(this.email, this.password);
      if (user.role === 'student') this.router.navigate(['/dashboard']);
      else this.error = this.i18n.t('login.teacherOnly');
    } catch (e) {
      this.error = e instanceof Error ? e.message : this.i18n.t('login.failed');
    } finally {
      this.loading = false;
    }
  }

  arrowIcon() {
    return this.i18n.dir() === 'rtl' ? 'pi pi-arrow-left' : 'pi pi-arrow-right';
  }
}