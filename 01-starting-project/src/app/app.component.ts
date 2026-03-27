import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { UserInputComponent } from "./user-input/user-input.component";
import { datan } from './data.model';
import { OutputTableComponent } from "./output-table/output-table.component";
import { annualData } from './annualData.model';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [HeaderComponent, UserInputComponent, OutputTableComponent],
})

export class AppComponent {
  anualDataTable!:annualData[];
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
this.anualDataTable=annualData;
  //return annualData;
}
}
