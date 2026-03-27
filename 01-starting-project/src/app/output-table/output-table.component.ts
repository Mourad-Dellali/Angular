import { Component, Input } from '@angular/core';
import { annualData } from '../annualData.model';

@Component({
  selector: 'app-output-table',
  standalone: true,
  imports: [],
  templateUrl: './output-table.component.html',
  styleUrl: './output-table.component.css'
})
export class OutputTableComponent {
@Input() outputTable!:annualData[];


}
