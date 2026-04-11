export interface JobDto {
  id: string;
  status: string;
  createdAt: string;
}

export const JOB_STATUS_LABELS: Record<string, string> = {
  'Pending':    'En attente',
  'Processing': 'En cours',
  'Completed':  'Terminé',
  'Failed':     'Échoué',
};