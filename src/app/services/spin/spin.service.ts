import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { IHttpResult } from '@app/interfaces/http.interface';
import { ISpinResult } from '@app/interfaces/spin.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpinService {
  constructor(private http: HttpClient) {}

  spin(
    campaignId: string,
    headerConfig: HttpHeaders
  ): Observable<IHttpResult<ISpinResult>> {
    return this.http.post<IHttpResult<ISpinResult>>(
      `${environment.apiURL}/my-hdsaison/campaign/${campaignId}/spin`,
      null,
      { headers: headerConfig }
    );
  }
}
