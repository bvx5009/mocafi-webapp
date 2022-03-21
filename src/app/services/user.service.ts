import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  //GET
  public getUsers(): Observable<[User]> {
    return this.http.get<[User]>(environment.WEBSERVICE_PREFIX.concat('users'));
  }

  //POST
  public createUser(userToBeCreated: User): Observable<User> {
    return this.http.post<User>(environment.WEBSERVICE_PREFIX.concat('users'), userToBeCreated)
  }

  //PATCH
  public updateUser(userToBeUpdated: User): Observable<User> {
    return this.http.patch<User>(environment.WEBSERVICE_PREFIX.concat('users/' + userToBeUpdated.id), userToBeUpdated);
  }

  //DELETE
  public deleteUser(userToBeDeleted: User): Observable<User> {
    return this.http.delete<User>(environment.WEBSERVICE_PREFIX.concat('users/' + userToBeDeleted.id));
  }

}
