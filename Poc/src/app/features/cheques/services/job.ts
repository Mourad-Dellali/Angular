import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CreateJobCommand {
  checksIds: string[];
}

export interface CreateJobResponse {
  job_id: string;
}

@Injectable({ providedIn: 'root' })
export class JobService {
  private http = inject(HttpClient);
private readonly apiUrl = `${environment.apiBaseUrl}/api/jobs`;

  createJob(command: CreateJobCommand): Observable<CreateJobResponse> {
    return this.http.post<CreateJobResponse>(`${this.apiUrl}/api/jobs`, command);
  }
}