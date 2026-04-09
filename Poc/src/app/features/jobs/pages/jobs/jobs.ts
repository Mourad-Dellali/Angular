import { Component, inject, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DxFormModule, DxButtonModule, DxDataGridModule, DxLoadIndicatorModule } from 'devextreme-angular';
import { JobsService } from '../../services/jobs.service';
import { JobDto } from '../../models/job.dto';
import { CursorPageModel } from '../../../../shared/models/cursor-page.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-jobs-page',
  imports: [DxFormModule, DxButtonModule, DxDataGridModule, DxLoadIndicatorModule, RouterLink],
  templateUrl: './jobs.html',
  styleUrl: './jobs.css',
})
export class JobsPage implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly jobsService = inject(JobsService);

  readonly jobs        = signal<JobDto[]>([]);
  readonly loading     = signal(false);
  readonly hasMore     = signal(false);
  readonly nextCursor   = signal<string | null>(null);
  readonly nextCursorId = signal<string | null>(null);

  filters = {
    from: null as string | null,
    to:   null as string | null,
    pageSize: 20,
  };

  dateRangeError = false;

  ngOnInit(): void {
    this.loadFirstPage();
  }

  onFieldChanged(e: any): void {
    if (e.dataField === 'from' || e.dataField === 'to') {
      const { from, to } = this.filters;
      this.dateRangeError = !!(from && to && new Date(from) > new Date(to));
    }
  }

  loadFirstPage(): void {
    if (this.dateRangeError) return;
    this.fetch(null, null);
  }

  loadNextPage(): void {
    if (!this.hasMore() || this.loading()) return;
    this.fetch(this.nextCursor(), this.nextCursorId());
  }

  private fetch(cursor: string | null, cursorId: string | null): void {
    this.loading.set(true);
    this.jobsService.getJobs({
      pageSize: this.filters.pageSize,
      cursor,
      cursorId,
      from: this.filters.from ?? undefined,
      to:   this.filters.to   ?? undefined,
    })
    .pipe(finalize(() => this.loading.set(false)), takeUntil(this.destroy$))
    .subscribe({
      next: (res: CursorPageModel<JobDto>) => {
        this.jobs.set(res.items);
        this.hasMore.set(res.hasNextPage);
        this.nextCursor.set(res.nextCursor);
        this.nextCursorId.set(res.nextCursorId);
      },
      error: err => console.error(err),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}