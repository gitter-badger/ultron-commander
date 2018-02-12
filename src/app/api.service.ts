import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class ApiService {

  public apiurl: string
  public httpOptions: any = {
    headers: new HttpHeaders({
      'Authorization': ''
    })
  }

  constructor(private http: HttpClient) {
    this.apiurl = localStorage.getItem('apiurl')
    let s = localStorage.getItem('session')
    if (s) {
      this.httpOptions.headers = new HttpHeaders({
        'Authorization': 'Bearer '+ JSON.parse(s).token
      })
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(`Backend returned code ${error.status}, `,
                    error.error)
      if (error.status == 401) {
        // Session is no longer valid
        localStorage.removeItem('session')
      }
    }
    return new ErrorObservable('Something bad happened; please try again later.');
  };

  login(apiurl, username, password): Observable<any> {
    localStorage.removeItem('session')
    this.apiurl = apiurl
    this.httpOptions.headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    })
    return this.http.get(`${apiurl}/token/${username}`, this.httpOptions)
                    .pipe(retry(3), catchError(this.handleError))
  }

  resetHeader() {
    let s = localStorage.getItem('session')
    if (s) {
      this.httpOptions.headers = new HttpHeaders({
        'Authorization': 'Bearer '+ JSON.parse(s).token
      })
    }
  }

  get(url): Observable<any> {
    return this.http.get(this.apiurl+url, this.httpOptions)
                    .pipe(retry(3), catchError(this.handleError))
  }

  post(url, data={}): Observable<any> {
    return this.http.post(this.apiurl+url, data, this.httpOptions)
                    .pipe(retry(3), catchError(this.handleError))
  }

  delete(url): Observable<any> {
    return this.http.delete(this.apiurl+url, this.httpOptions)
                    .pipe(retry(3), catchError(this.handleError))
  }
}
