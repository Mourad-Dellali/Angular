import { Injectable } from '@angular/core';
import { datan } from './data.model';
import { annualData } from './annualData.model';

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  resultData! : annualData[]
  constructor() { }

  onCalculateInvestmentResults(enteredData:datan) {
  const annualData = [];
  let investmentValue = enteredData.initialInvestment;

  for (let i = 0; i < enteredData.duration; i++) {
    const year = i + 1;
    const interestEarnedInYear = investmentValue * (enteredData.expectedReturn / 100);
    investmentValue += interestEarnedInYear + enteredData.annualInvestment;
    const totalInterest =
      investmentValue - enteredData.annualInvestment * year - enteredData.initialInvestment;
    annualData.push({
      year: year,
      interest: interestEarnedInYear,
      valueEndOfYear: investmentValue,
      annualInvestment: enteredData.annualInvestment,
      totalInterest: totalInterest,
      totalAmountInvested: enteredData.initialInvestment + enteredData.annualInvestment * year,
    });
  }
this.resultData = annualData;
}
}
