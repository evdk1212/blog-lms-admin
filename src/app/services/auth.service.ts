import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean>= new BehaviorSubject<boolean>(false);
  isLoggedInGaurd: boolean=false;
  constructor(private afAuth:AngularFireAuth,private toastr:ToastrService,private router:Router) { }

  login(formdata:any){
    this.afAuth.signInWithEmailAndPassword(formdata.email,formdata.password).then(logRef=>{
      this.toastr.success('LoggedIn!');
      this.loadUser();
      this.loggedIn.next(true);
      this.isLoggedInGaurd=true
      this.router.navigate(['/']);
    }).catch(e=>{
      this.toastr.warning(e);
    });
  }
  loadUser(){
    this.afAuth.authState.subscribe(user=>{
      localStorage.setItem('user',JSON.stringify(user));
    });
  }
  logOut(){
    this.afAuth.signOut().then(()=>{
      this.toastr.success('LoggedOut!');
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGaurd=false;
      this.router.navigate(['/login']);
    });
  }
  isLoggedIn(){
    return this.loggedIn.asObservable();
  }
}
