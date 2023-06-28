import { Component } from '@angular/core';
import { HttpRequests } from './services/http-requests.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sch_vacations';
  httpError!: boolean;
  httpErrorSubs!: Subscription;
  httpErrorMessage!: string;
  httpErrorMessageSubs!: Subscription;
  constructor(private readonly httpRequests: HttpRequests) {}

  ngOnInit() {
    this.httpErrorSubs = this.httpRequests.$httpError.subscribe(
      (value) => (this.httpError = value)
    );
    this.httpErrorMessageSubs = this.httpRequests.$httpErrorMessage.subscribe(
      (value) => (this.httpErrorMessage = value)
    );
  }

  ngOnDestroy() {
    this.httpErrorSubs.unsubscribe();
  }

  removeErrorHandler() {
    this.httpRequests.$httpError.next(false);
  }
}
