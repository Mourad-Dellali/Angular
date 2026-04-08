export interface ChequeDto {
  id: string;
  number: number;
  bankCode: number;
  brancheCode: number;
  accountNumber: number;
  montant: number;
  dateCheque: string;        // YYYY-MM-DD
  dateCompensation: string;  // YYYY-MM-DD
  checkType: number;         // enum numeric value
  createdAt: string;         // ISO datetime string
}