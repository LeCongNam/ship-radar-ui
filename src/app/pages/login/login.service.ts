import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable()
export  class LoginService {
  private  httpClient = inject(HttpClient);


  login(data: any){
   return  this.httpClient.post('http://localhost:3001/api/auth/login', data)
  }
}
