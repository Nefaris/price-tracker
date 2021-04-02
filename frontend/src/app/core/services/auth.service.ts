import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase';
import User = firebase.User;
import { AppUser } from '../../shared/interfaces/app-user.interface';


@Injectable({providedIn: 'root'})
export class AuthService {
  public user: Observable<AppUser>;

  constructor(
    private readonly fireAuth: AngularFireAuth,
    private readonly firestore: AngularFirestore,
    private readonly router: Router
  ) {
    this.user = this.fireAuth.authState.pipe(
      switchMap((user: User | null) => {
        if (user) {
          return this.firestore.doc<AppUser>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  public async signInWithEmail(email: string, password: string): Promise<any> {
    return await this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  public async signOut(): Promise<boolean> {
    await this.fireAuth.signOut();
    return this.router.navigate(['/']);
  }
}
