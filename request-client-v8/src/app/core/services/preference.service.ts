import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Preference } from '../models/preference.interface';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService extends BaseService<Preference> {
  protected getEndpoint(): string {
    return API_ENDPOINTS.PREFERENCE;
  }
}
