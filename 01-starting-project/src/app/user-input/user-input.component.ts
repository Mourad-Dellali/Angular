import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { datan } from '../data.model';
import { InvestmentService } from '../investment-service.service';

@Component({
  selector: 'app-user-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.css'
})
export class UserInputComponent {
  constructor (private investmentSerivce:InvestmentService) {}
@Output() calculate = new EventEmitter<datan>();
enteredData: datan = {
initialInvestment: 0,
annualInvestment: 0,
expectedReturn: 5,
duration: 10
}


onSubmit() {
  this.investmentSerivce.onCalculateInvestmentResults(this.enteredData);
}

}
