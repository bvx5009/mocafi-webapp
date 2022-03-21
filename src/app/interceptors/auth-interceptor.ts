import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const idToken = localStorage.getItem("isLoggedIn");
        
        if (idToken) {
            
            const cloned = req.clone({
                headers: req.headers.set("Authorization", 'Bearer 3e2255e9dfda54ba3ceafb4b5bbf0c78f91786d696149d39a4fae93f918cf95e')
            });
            
            return next.handle(cloned);
      
        } else {
            
            return next.handle(req);
        
        }
      
    }
      
}