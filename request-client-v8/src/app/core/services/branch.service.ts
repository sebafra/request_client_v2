import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Branch } from '../models/branch.interface';
import { API_ENDPOINTS } from '../constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends BaseService<Branch> {
  protected getEndpoint(): string {
    return API_ENDPOINTS.BRANCH;
  }
}
