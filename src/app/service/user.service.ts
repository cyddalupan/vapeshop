import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environment/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';

//"Authorization: Token <your_token_key>"

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  protected mainURL = `${environment.apiURL}`;
  httpOptions: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('token')}`,
      })
    };
  }

  public getLoginStatus(): Observable<any>
  {
    "Authorization: Token <your_token_key>"
    return this.http.get<any>(this.mainURL+"checklogin/", this.httpOptions).pipe(
      catchError((error) => this.handleError(error, null))
    );
  }

  public login(): Observable<any>
  {
		const loginHttpOptions = {
				headers: new HttpHeaders({
				'Content-Type': 'application/json',
			})
		};
    const data = {
      username: 'cyddalupan',
      password: 'limangminutolangsapatna',
    };
    return this.http.post<any>(this.mainURL+"login/", data, loginHttpOptions);
  }

  public logout(): Observable<any>
  {
    return this.http.post<any>(this.mainURL+"logout/", {}, this.httpOptions);
  }

  private handleError<T>(error: HttpErrorResponse, defaultValue?: T) {
    console.error('Error occurred:', error);
    return of(defaultValue as T);
  }
}
