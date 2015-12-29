import { EventEmitter } from 'angular2/core';
import { FIREBASE_AM_ONLINE } from '../../config';
import { FIREBASE_PRESENCE } from '../../config';
import {Participant} from "../card/card";


export class AuthService {
  public authData: FirebaseAuthData;
  private emitter: EventEmitter<any> = new EventEmitter();

  constructor(private ref: Firebase) {
    this.authData = this.ref.getAuth();

    this.ref.onAuth((authData: FirebaseAuthData) => {
      this.authData = authData;
      this.presence();
      this.emit();
    });
  }

  get authenticated(): boolean {
    return this.authData !== null && !this.expired;
  }

  get expired(): boolean {
    return !this.authData || (this.authData.expires * 1000) < Date.now();
  }

  get id(): string {
    return this.authenticated ? this.authData.uid : '';
  }

  get displayName(): string {
    return this.authenticated ? this.authData[this.authData.provider].displayName : '';
  }


  get profileImageURL(): string {
    return this.authenticated ? this.authData[this.authData.provider].profileImageURL : '';
  }


  signInWithGithub(): Promise<any> {
    return this.authWithOAuth('github');
  }

  signInWithGoogle(): Promise<any> {
    return this.authWithOAuth('google');
  }

  signInWithTwitter(): Promise<any> {
    return this.authWithOAuth('twitter');
  }

  signOut(): void {
    this.ref.unauth();
  }

  subscribe(next: (authenticated: boolean) => void): any {
    let subscription = this.emitter.subscribe(next);
    this.emit();
    return subscription;
  }

  private presence(): void {

    if(!this.authenticated){
      return;
    }

    let amOnline: Firebase = new Firebase(FIREBASE_AM_ONLINE);
    let userRef: Firebase = new Firebase(FIREBASE_PRESENCE +  this.id + '-' + this.displayName);

    console.log('amOnline: ' , amOnline);
    console.log('userRef: ' , userRef);

    amOnline.on('value', (snapshot) => {
      if (snapshot.val()) {
        userRef.onDisconnect().remove();


        let participant = new Participant(this.id, this.displayName, this.profileImageURL);
        console.log('Current participant: ', participant);

        userRef.set(participant);
      }
    });
  }

  private authWithOAuth(provider: string): Promise<any> {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      this.ref.authWithOAuthPopup(provider, (error: Error) => {
        if (error) {
          console.error('ERROR @ AuthService#authWithOAuth :', error);
          reject(error);
        }
        else {
          resolve();
        }
      });
    });
  }

  private emit(): void {
    this.emitter.next(this.authenticated);
  }
}
