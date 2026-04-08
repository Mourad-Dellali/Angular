import { Component, computed, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { DxFormModule, DxButtonModule, DxDataGridModule, DxDataGridComponent, DxLoadIndicatorModule } from 'devextreme-angular';
import { ChequesService } from '../../services/cheques';
import { JobService } from '../../services/job';
import { ChequeDto } from '../../models/cheque.dto';
@Component({
  selector: 'app-cheques-page',
  imports: [DxFormModule, DxButtonModule, DxDataGridModule, DxLoadIndicatorModule],
  templateUrl: './cheques-page.html',
  styleUrl: './cheques-page.css',
})
export class ChequesPage implements OnInit, OnDestroy {
  @ViewChild(DxDataGridComponent) grid!: DxDataGridComponent;

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

  loadFirstPage(): void {
    if (this.dateRangeError) return;
    this.loading.set(true);
    this.chequesService.getCheques({
      from: this.toIsoOrNull(this.filters.from),
      to: this.toIsoOrNull(this.filters.to),
      pageSize: this.filters.pageSize,
      cursor: null,
      cursorId: null,
    })
    .pipe(finalize(() => this.loading.set(false)), takeUntil(this.destroy$))
    .subscribe({
      next: res => {
        this.cheques.set(res.items);
        this.nextCursor.set(res.nextCursor);
        this.nextCursorId.set(res.nextCursorId);
        this.hasMore.set(res.hasNextPage);
        // clear grid selection on new load
        this.grid?.instance.clearSelection();
      },
      error: err => console.error(err),
    });
  }

  loadNextPage(): void {
    if (this.dateRangeError) return;
    const cursor   = this.nextCursor();
    const cursorId = this.nextCursorId();
    if (!cursor || !cursorId) return;

    this.loading.set(true);
    this.chequesService.getCheques({
      from: this.toIsoOrNull(this.filters.from),
      to: this.toIsoOrNull(this.filters.to),
      pageSize: this.filters.pageSize,
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
      },
      error: err => console.error(err),
    });
  }

  onSelectionChanged(e: any): void {
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
          console.log('Job created:', res.job_id);
          this.selectedIds.set(new Set());
          this.grid?.instance.clearSelection();
        },
        error: err => console.error(err),
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}