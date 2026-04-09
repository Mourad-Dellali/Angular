import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { JobDetailsModel } from '../models/jobs-details.model';

@Injectable({ providedIn: 'root' })
export class JobsDetailsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/jobs`;

  getJobDetails(jobId: string): Observable<JobDetailsModel> {
    return this.http.get<JobDetailsModel>(`${this.apiUrl}/${jobId}`);
  }

  refreshStatus(jobId: string): Observable<{ status: string }> {
    return this.http.post<{ status: string }>(`${this.apiUrl}/${jobId}/refresh`, {});
  }
}