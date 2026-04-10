import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

type BackendErrorItem = {
  code: string;
  description: string;
  type: string;
};

type BackendProblemDetails = {
  title?: string;
  status?: number;
  detail?: string;
  extensions?: {
    errorCode?: string;
    errors?: BackendErrorItem[];
  };
};

export type AppHttpError = {
  status: number;
  title: string;
  message: string;
  errorCode?: string;
  errors?: BackendErrorItem[];
  original: HttpErrorResponse;
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const problem = (error.error ?? {}) as BackendProblemDetails;
      const status = error.status || problem.status || 0;

      const title = problem.title || defaultTitle(status);
      const message = resolveMessage(status, problem);
      const errorCode = problem.extensions?.errorCode;
      const errors = problem.extensions?.errors;

      console.error('[HTTP ERROR]', {
        method: req.method,
        url: req.urlWithParams,
        status,
        title,
        message,
        errorCode,
        errors,
        raw: error.error,
      });

      snackBar.open(message, 'Dismiss', {
        panelClass: ['app-snackbar-error'],
      });

      const appError: AppHttpError = {
        status,
        title,
        message,
        errorCode,
        errors,
        original: error,
      };

      return throwError(() => appError);
    })
  );
};

function resolveMessage(status: number, p: BackendProblemDetails): string {
  if (status === 0) return 'Network error. Please check your connection.';
  if (p.detail?.trim()) return p.detail;

  const firstBackendError = p.extensions?.errors?.[0]?.description;
  if (firstBackendError) return firstBackendError;

  if (status >= 500) return 'Server error. Please try again later.';
  if (status === 404) return 'Resource not found.';
  if (status === 401) return 'Unauthorized.';
  if (status === 403) return 'Forbidden.';
  if (status === 409) return 'Conflict occurred.';
  if (status === 400) return 'Validation error.';
  return 'Unexpected error occurred.';
}

function defaultTitle(status: number): string {
  if (status >= 500) return 'Internal Server Error';
  if (status === 404) return 'Resource Not Found';
  if (status === 401) return 'Unauthorized';
  if (status === 403) return 'Forbidden';
  if (status === 409) return 'Conflict';
  if (status === 400) return 'Validation Error';
  return 'Error';
}