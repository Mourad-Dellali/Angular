import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { JobDto } from '../models/job.dto';
import { CursorPageModel } from '../../../shared/models/cursor-page.model';
import { GetJobsQuery } from '../models/get-jobs.query';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/jobs/getJobs`;

  getJobs(query: GetJobsQuery): Observable<CursorPageModel<JobDto>> {
    let params = new HttpParams()
      .set('pageSize', String(query.pageSize));

    if (query.cursor)   params = params.set('cursor',   query.cursor);
    if (query.cursorId) params = params.set('cursorId', query.cursorId);
    if (query.from)     params = params.set('from',     query.from);
    if (query.to)       params = params.set('to',       query.to);

    return this.http.get<CursorPageModel<JobDto>>(this.apiUrl, { params });
  }

  
}