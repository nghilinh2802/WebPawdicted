// import { Injectable } from '@angular/core';
// import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
// import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
// import { Observable, from, of } from 'rxjs';
// import { switchMap, catchError, map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private currentUser: any = null;

//   constructor(private auth: Auth, private firestore: Firestore) {
//     const savedUser = localStorage.getItem('currentUser');
//     if (savedUser) {
//       this.currentUser = JSON.parse(savedUser);
//     }
//   }

//   login(email: string, password: string): Observable<any> {
//     return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
//       switchMap((userCredential: UserCredential) => {
//         const customersCollection = collection(this.firestore, 'customers');
//         const q = query(customersCollection, where('customer_email', '==', email));
//         return from(getDocs(q)).pipe(
//           map((querySnapshot) => {
//             if (!querySnapshot.empty) {
//               const userDoc = querySnapshot.docs[0].data() as { customer_email: string; role?: string; password: string; [key: string]: any };
//               if (userDoc.password === password) { // Note: In production, hash passwords
//                 if (userDoc.role === 'Admin' || userDoc.role === 'Staff') {
//                   this.currentUser = { ...userDoc, uid: userCredential.user.uid };
//                   localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
//                   return this.currentUser;
//                 } else {
//                   throw new Error('Bạn không có quyền truy cập với vai trò này.');
//                 }
//               } else {
//                 throw new Error('Mật khẩu không đúng.');
//               }
//             } else {
//               throw new Error('Email không tồn tại.');
//             }
//           })
//         );
//       }),
//       catchError((error) => {
//         if (error.code === 'auth/invalid-credential') {
//           return of({ error: 'Email hoặc mật khẩu không đúng.' });
//         } else if (error.message) {
//           return of({ error: error.message });
//         }
//         console.error('Login error:', error);
//         return of({ error: 'Đã xảy ra lỗi không xác định.' });
//       })
//     );
//   }

//   isAdmin(): boolean {
//     return this.currentUser && this.currentUser.role === 'Admin';
//   }

//   getCurrentUser(): any {
//     return this.currentUser;
//   }

//   logout(): Observable<void> {
//     this.currentUser = null;
//     localStorage.removeItem('currentUser');
//     return from(this.auth.signOut());
//   }
// }



import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Observable, from, of, BehaviorSubject } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser$;
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential: UserCredential) => {
        const customersCollection = collection(this.firestore, 'customers');
        const q = query(customersCollection, where('customer_email', '==', email));
        return from(getDocs(q)).pipe(
          map((querySnapshot) => {
            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0].data() as { customer_email: string; role?: string; password: string; [key: string]: any };
              if (userDoc.password === password) { // Note: In production, hash passwords
                if (userDoc.role === 'Admin' || userDoc.role === 'Staff') {
                  const user = { ...userDoc, uid: userCredential.user.uid };
                  this.currentUserSubject.next(user);
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  return user;
                } else {
                  throw new Error('Bạn không có quyền truy cập với vai trò này.');
                }
              } else {
                throw new Error('Mật khẩu không đúng.');
              }
            } else {
              throw new Error('Email không tồn tại.');
            }
          })
        );
      }),
      catchError((error) => {
        if (error.code === 'auth/invalid-credential') {
          return of({ error: 'Email hoặc mật khẩu không đúng.' });
        } else if (error.message) {
          return of({ error: error.message });
        }
        console.error('Login error:', error);
        return of({ error: 'Đã xảy ra lỗi không xác định.' });
      })
    );
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user && user.role === 'Admin' || user.role === 'Staff';
  }

  logout(): Observable<void> {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    return from(this.auth.signOut());
  }
}