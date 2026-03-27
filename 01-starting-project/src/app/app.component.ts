import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { UserInputComponent } from "./user-input/user-input.component";
import { OutputTableComponent } from "./output-table/output-table.component";
import { annualData } from './annualData.model';
import { InvestmentService } from './investment-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [HeaderComponent, UserInputComponent, OutputTableComponent],
})

export class AppComponent {
  constructor (private investmentSerivce:InvestmentService) {

  }
  anualDataTable!:annualData[];
  
  
}

