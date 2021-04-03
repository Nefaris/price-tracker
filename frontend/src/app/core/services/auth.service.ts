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

  public getUserRef(uid: string): AngularFirestoreDocument<AppUser> {
    return this.firestore.doc(`users/${uid}`);
  }

  public async signInWithEmail(email: string, password: string): Promise<void> {
    const credentials = await this.fireAuth.signInWithEmailAndPassword(email, password);
    return this.updateUserData(credentials.user);
  }

  public async signOut(): Promise<boolean> {
    await this.fireAuth.signOut();
    return this.router.navigate(['/']);
  }

  private updateUserData({uid, email}: User): Promise<void> {
    const userRef: AngularFirestoreDocument<AppUser> = this.firestore.doc(`users/${uid}`);
    const data = {
      uid,
      email,
    } as AppUser;

    return userRef.set(data, {merge: true});
  }
}
