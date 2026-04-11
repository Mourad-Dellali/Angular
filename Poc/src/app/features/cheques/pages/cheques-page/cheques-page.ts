import { Component, computed, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DxFormModule, DxButtonModule, DxDataGridModule, DxDataGridComponent, DxLoadIndicatorModule } from 'devextreme-angular';
import { ChequesService } from '../../services/cheques';
import { JobService } from '../../services/job';
import { CHECK_TYPE_LABELS, ChequeDto } from '../../models/cheque.dto';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-cheques-page',
  imports: [DxFormModule, DxButtonModule, DxDataGridModule, DxLoadIndicatorModule],
  templateUrl: './cheques-page.html',
  styleUrl: './cheques-page.css',
})
export class ChequesPage implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent) grid!: DxDataGridComponent

  private readonly notify = inject(NotificationService);

  readonly checkTypeOptions = CHECK_TYPE_LABELS;

  private readonly destroy$ = new Subject<void>();
  private readonly chequesService = inject(ChequesService);
  private readonly jobService = inject(JobService);

  readonly cheques    = signal<ChequeDto[]>([]);
  readonly loading    = signal(false);
  readonly creatingJob = signal(false);
  readonly nextCursor   = signal<string | null>(null);
  readonly nextCursorId = signal<string | null>(null);
  readonly hasMore    = signal(false);
  readonly selectedIds = signal<Set<string>>(new Set());
  readonly selectedCount = computed(() => this.selectedIds().size);

  // plain object instead of FormGroup
  filters = {
    from: null as string | null,
    to: null as string | null,
    pageSize: 20,
    checkType: null as number | null,
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

  private toIsoOrNull(value: string | null): string | null {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  private fetch(cursor: string | null, cursorId: string | null): void {
  this.loading.set(true);
  this.chequesService.getCheques({
    from: this.toIsoOrNull(this.filters.from),
    to: this.toIsoOrNull(this.filters.to),
    pageSize: this.filters.pageSize,
    checkType: this.filters.checkType,
    cursor,
    cursorId,
  })
  .pipe(finalize(() => this.loading.set(false)), takeUntil(this.destroy$))
  .subscribe({
    next: res => {
      this.cheques.set(res.items);
      this.nextCursor.set(res.nextCursor);
      this.nextCursorId.set(res.nextCursorId);
      this.hasMore.set(res.hasNextPage);
      if (!cursor) this.grid?.instance.clearSelection();
    },
    error: err => console.error(err),
  });
}

loadFirstPage(): void {
  if (this.dateRangeError) return;
  this.fetch(null, null);
}

loadNextPage(): void {
  if (this.dateRangeError) return;
  const cursor   = this.nextCursor();
  const cursorId = this.nextCursorId();
  if (!cursor || !cursorId) return;
  this.fetch(cursor, cursorId);
}

  onSelectionChanged(e: any): void {
    console.log('Selection changed:', e);
    this.selectedIds.set(new Set(e.selectedRowKeys));
  }

  createJobFromSelection(): void {
    const ids = Array.from(this.selectedIds());
    if (!ids.length) return;

    this.creatingJob.set(true);
    this.jobService.createJob({ checksIds: ids })
      .pipe(finalize(() => this.creatingJob.set(false)), takeUntil(this.destroy$))
      .subscribe({
        next: res => {
        this.selectedIds.set(new Set());
        this.grid?.instance.clearSelection();
        this.notify.successWithLink(
  `Traitement créé avec succès`,
  'Voir le traitement',
  ['/jobs', res.job_id]
);
      },
        error: err => console.error(err),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}