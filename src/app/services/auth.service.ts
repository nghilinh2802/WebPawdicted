import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Database, ref, get, child } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  constructor(private auth: Auth, private db: Database) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => {
        const dbRef = ref(this.db);
        return from(get(child(dbRef, 'customers/customers'))).pipe(
          switchMap((snapshot) => {
            if (snapshot.exists()) {
              const users = snapshot.val();
              const user = Object.values(users).find((u: any) => 
                u.customer_email === email && u.role === 'Admin'
              );
              if (user) {
                this.currentUser = { ...user, uid: userCredential.user.uid };
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                return from([this.currentUser]);
              } else {
                throw new Error('User is not an admin');
              }
            } else {
              throw new Error('No users found');
            }
          })
        );
      }),
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  isAdmin(): boolean {
    return this.currentUser && this.currentUser.role === 'Admin';
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  logout(): Observable<void> {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    return from(this.auth.signOut());
  }
}