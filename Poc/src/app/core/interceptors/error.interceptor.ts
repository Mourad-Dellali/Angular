import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '@core/services/notification.service';

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
  const notify = inject(NotificationService);

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

      notify.error(message);

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
  if (status === 0)   return 'Erreur réseau. Veuillez vérifier votre connexion.';
  if (p.detail?.trim()) return p.detail;

  const firstBackendError = p.extensions?.errors?.[0]?.description;
  if (firstBackendError) return firstBackendError;

  if (status >= 500) return 'Erreur serveur. Veuillez réessayer plus tard.';
  if (status === 404) return 'Ressource introuvable.';
  if (status === 401) return 'Non autorisé.';
  if (status === 403) return 'Accès refusé.';
  if (status === 409) return 'Conflit détecté.';
  if (status === 400) return 'Erreur de validation.';
  return 'Une erreur inattendue est survenue.';
}

function defaultTitle(status: number): string {
  if (status >= 500) return 'Erreur serveur';
  if (status === 404) return 'Ressource introuvable';
  if (status === 401) return 'Non autorisé';
  if (status === 403) return 'Accès refusé';
  if (status === 409) return 'Conflit';
  if (status === 400) return 'Erreur de validation';
  return 'Erreur';
}