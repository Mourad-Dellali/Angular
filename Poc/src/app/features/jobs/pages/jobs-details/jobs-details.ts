import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DxButtonModule, DxDataGridModule, DxLoadIndicatorModule } from 'devextreme-angular';
import { JobsDetailsService } from '../../services/jobs-details';
import { JobDetailsModel } from '../../models/jobs-details.model';
import { DatePipe, DecimalPipe } from '@angular/common';
import { JOB_STATUS_LABELS } from '@features/jobs/models/job.dto';
import { CHECK_TYPE_LABELS } from '@features/cheques/models/cheque.dto';

@Component({
  selector: 'app-job-details',
  imports: [DxButtonModule, DxDataGridModule, DxLoadIndicatorModule,DatePipe,DecimalPipe],
  templateUrl: './jobs-details.html',
  styleUrl: './jobs-details.css',
})
export class JobDetailsPage implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly route = inject(ActivatedRoute);
  private readonly jobsDetailsService = inject(JobsDetailsService);

  readonly job        = signal<JobDetailsModel | null>(null);
  readonly loading    = signal(false);
  readonly refreshing = signal(false);

  private jobId = '';

  // merge each cheque with its ocr result
  readonly chequesWithOcr = computed(() => {
    const j = this.job();
    if (!j) return [];
    return j.cheques.map(cheque => ({
      ...cheque,
      ocr: j.ocrResults.find(o => o.chequeId === cheque.id) ?? null,
    }));
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.jobId = params.get('id') ?? '';
      if (this.jobId) this.loadDetails();
    });
  }
  statusLabel(status: string): string {
  return JOB_STATUS_LABELS[status] ?? status;
}

checkTypeLabel(value: number): string {
  return CHECK_TYPE_LABELS.find(t => t.id === value)?.label ?? String(value);
}

  loadDetails(): void {
    this.loading.set(true);
    this.jobsDetailsService.getJobDetails(this.jobId)
      .pipe(finalize(() => this.loading.set(false)), takeUntil(this.destroy$))
      .subscribe({
        next: data => this.job.set(data),
        error: err => console.error(err),
      });
  }

  refresh(): void {
    this.refreshing.set(true);
    this.jobsDetailsService.refreshStatus(this.jobId)
      .pipe(finalize(() => this.refreshing.set(false)), takeUntil(this.destroy$))
      .subscribe({
        next: res => {
          const current = this.job();
          if (current) this.job.set({ ...current, status: res.status as any });
          if (res.status === 'Completed') this.loadDetails();
        },
        error: err => console.error(err),
      });
  }

  isCompleted(): boolean {
    return this.job()?.status === 'Completed';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}