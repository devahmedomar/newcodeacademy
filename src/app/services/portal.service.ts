import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Profile } from '../models';

@Injectable({ providedIn: 'root' })
export class PortalService {
  constructor(private api: ApiService) {}

  getMyProfile() {
    return this.api.get<Profile>('/api/students/me');
  }
}