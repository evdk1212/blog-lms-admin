import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Category } from '../models/category';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs:AngularFirestore,private toastr:ToastrService ) { }
  saveData(data:any){
    this.afs.collection('categories').add(data).then(docRef=>{

      this.toastr.success('Category Added Successfully!...');
    }).catch(e=>{console.log(e)}); 
  }
  loadData(): Observable<Category[]> {
    return this.afs.collection<Category>('categories').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
  updateData(id:any,EditDate:any){
    this.afs.collection('categories').doc(id).update(EditDate).then(docRef=>{

      this.toastr.success('Category Edited Successfully!...');
    }).catch(e=>{console.log(e)}); 

  }
  DeleteCategory(id:any){
    this.afs.collection('categories').doc(id).delete().then(docRef=>{

      this.toastr.error('Category Deleted Successfully!...');
    }).catch(e=>{console.log(e)}); 
  }
}
