import { ChequeDto } from '../../cheques/models/cheque.dto';

export interface OcrResult {
  chequeId: string;
  extractedAmount: number;
  extractedDate: string;
  confidence: number;
  rawText: string;
}

export interface JobDetailsModel {
  id: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  createdAt: string;
  cheques: ChequeDto[];
  ocrResults: OcrResult[];
}