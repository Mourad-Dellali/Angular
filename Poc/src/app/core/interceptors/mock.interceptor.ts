import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { ChequeDto } from '../../features/cheques/models/cheque.dto';
import { JobDto } from '../../features/jobs/models/job.dto';
import { JobDetailsModel } from '@features/jobs/models/jobs-details.model';

const MOCK_CHEQUES: ChequeDto[] = Array.from({ length: 50 }, (_, i) => ({
  id: `00000000-0000-0000-0000-${String(i + 1).padStart(12, '0')}`,
  number: 1000 + i,
  bankCode: 7,
  brancheCode: 42,
  accountNumber: 987654 + i,
  montant: parseFloat((Math.random() * 100000).toFixed(2)),
  dateCheque: '2024-03-15',
  dateCompensation: '2024-03-20',
  checkType: i % 2,
  createdAt: new Date(2024, 2, i + 1).toISOString(),
}));

const MOCK_JOBS: JobDto[] = Array.from({ length: 30 }, (_, i) => ({
  id: `job-0000-0000-0000-${String(i + 1).padStart(12, '0')}`,
  status: ['Pending', 'Processing', 'Completed', 'Failed'][i % 4],
  createdAt: new Date(2024, 2, i + 1).toISOString(),
}));

export const mockInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.url.includes('/api/Cheques')) {
    const pageSize = Number(req.params.get('pageSize') ?? 20);
    const cursorId = req.params.get('cursorId');
    const checkType = req.params.get('checkType');

    let items = [...MOCK_CHEQUES];
    if (checkType !== null && checkType !== '')
    items = items.filter(c => c.checkType === Number(checkType));
    const cursorIndex = cursorId ? items.findIndex(c => c.id === cursorId) : -1;
    const start = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const page  = items.slice(start, start + pageSize);
    const hasNextPage = start + pageSize < items.length;
    const last  = page[page.length - 1];

    return of(new HttpResponse({
      status: 200,
      body: {
        items: page,
        nextCursor:   hasNextPage ? last?.createdAt : null,
        nextCursorId: hasNextPage ? last?.id        : null,
        hasNextPage,
      }
    })).pipe(delay(400));
  }

  if (req.url.includes('/api/jobs/getJobs')) {
    const pageSize = Number(req.params.get('pageSize') ?? 20);
    const cursorId = req.params.get('cursorId');

    let items = [...MOCK_JOBS];
    const cursorIndex = cursorId ? items.findIndex(j => j.id === cursorId) : -1;
    const start = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    const page  = items.slice(start, start + pageSize);
    const hasNextPage = start + pageSize < items.length;
    const last  = page[page.length - 1];

    return of(new HttpResponse({
      status: 200,
      body: {
        items: page,
        nextCursor:   hasNextPage ? last?.createdAt : null,
        nextCursorId: hasNextPage ? last?.id        : null,
        hasNextPage,
      }
    })).pipe(delay(400));
  }

  if (req.url.includes('/api/jobs') && req.method === 'POST') {
    return of(new HttpResponse({
      status: 200,
      body: { job_id: crypto.randomUUID() }
    })).pipe(delay(600));
  }
  if (req.url.match(/\/api\/jobs\/[^/]+$/) && req.method === 'GET') {
  const jobId = req.url.split('/').pop()!;

  // use jobId to seed some variation
  const index   = MOCK_JOBS.findIndex(j => j.id === jobId);
  const status  = index >= 0 ? MOCK_JOBS[index].status : 'Pending';
  const start   = index >= 0 ? index % 45 : 0;
  const cheques = MOCK_CHEQUES.slice(start, start + 5);

  const job: JobDetailsModel = {
    id: jobId,
    status: status as any,
    createdAt: index >= 0 ? MOCK_JOBS[index].createdAt : new Date().toISOString(),
    cheques,
    ocrResults: status === 'Completed'
      ? cheques.map(c => ({
          chequeId:        c.id,
          extractedAmount: c.montant,
          extractedDate:   c.dateCheque,
          confidence:      parseFloat((Math.random() * 30 + 70).toFixed(2)),
          rawText:         `Montant: ${c.montant} DZD — Date: ${c.dateCheque}`,
        }))
      : [],  // no OCR results if not completed
  };

  return of(new HttpResponse({ status: 200, body: job })).pipe(delay(500));
}

if (req.url.match(/\/api\/jobs\/[^/]+\/refresh$/) && req.method === 'POST') {
  return of(new HttpResponse({
    status: 200,
    body: { status: 'Completed' }
  })).pipe(delay(800));
}

  return next(req);

  
};
