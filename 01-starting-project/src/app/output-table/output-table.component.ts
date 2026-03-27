import { Component, Input } from '@angular/core';
import { annualData } from '../annualData.model';
import { CurrencyPipe } from '@angular/common';
import { InvestmentService } from '../investment-service.service';


@Component({
  selector: 'app-output-table',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './output-table.component.html',
  styleUrl: './output-table.component.css'
})
export class OutputTableComponent {
  constructor (private investmentService:InvestmentService) {}
  get results() {
    return this.investmentService.resultData;
  }


}
