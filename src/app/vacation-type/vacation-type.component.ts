import { Component } from '@angular/core';
import { HttpRequests } from '../services/http-requests.service';

@Component({
  selector: 'app-vacation-type',
  templateUrl: './vacation-type.component.html',
  styleUrls: ['./vacation-type.component.css'],
})
export class VacationTypeComponent {
  vacationType = 'annual';
  constructor(private readonly httpRequests: HttpRequests) {}
  onChooseVacationType() {
    this.httpRequests.vacationType = this.vacationType;
  }
}
