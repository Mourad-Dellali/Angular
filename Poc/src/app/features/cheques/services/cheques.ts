import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetChequesQueryModel } from '../models/get-cheques-query.model';
import { CursorPageModel } from '../../../shared/models/cursor-page.model';
import { ChequeDto } from '../models/cheque.dto';
import { environment } from '../../../../environments/environment.prod';



@Injectable({ providedIn: 'root' })
export class ChequesService {
private readonly apiUrl = `${environment.apiBaseUrl}/api/Cheques`;

  constructor(private readonly http: HttpClient) {}

  getCheques(
    query: GetChequesQueryModel = {}
  ): Observable<CursorPageModel<ChequeDto>> {
    let params = new HttpParams();

    if (query.from) params = params.set('from', query.from);
    if (query.to) params = params.set('to', query.to);
    if (query.cursor) params = params.set('cursor', query.cursor);
    if (query.cursorId) params = params.set('cursorId', query.cursorId);
    params = params.set('pageSize', String(query.pageSize ?? 20));

    return this.http.get<CursorPageModel<ChequeDto>>(this.apiUrl, { params });
  }
}