import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { Post } from '../models/post';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private storage:AngularFireStorage,private afs:AngularFirestore,private toastr: ToastrService,private router:Router) { }

  uploadImage(selectedImage:any,postData:any,formStatus:any,id:any){
    const filePath = `postIMG/${Date.now()}`;

    this.storage.upload(filePath,selectedImage).then(()=>{
      this.storage.ref(filePath).getDownloadURL().subscribe(URL=>{
        postData.postImgPath = URL;
        if(formStatus=='Edit'){
          console.log(id.id);
          console.log(postData);
          this.updateData(id.id,postData);
        }
        else{
          this.saveData(postData);
        }
        
      });
    });
  }
  saveData(postData:any){
    this.afs.collection('posts').add(postData).then(docRef=>{
      this.toastr.success('Post Uploaded Successfully!');
      this.router.navigate(['/posts']);
    });
  }

  loadData(): Observable<Post[]> {
    return this.afs.collection<Post>('posts').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
  loadOneData(id:any){
   return this.afs.collection('posts').doc(id).valueChanges();
  }
  updateData(id:any,postData:any){
    this.afs.collection('posts').doc(id).update(postData).then(()=>{
      this.toastr.success('Post Edited Successfully!...');
      this.router.navigate(['posts']);
    }).catch(e=>{console.log(e)}); 

  }
  deleteImg(postImgPath:any,id:any){
    this.storage.storage.refFromURL(postImgPath).delete().then(()=>{
      this.deletePost(id);
    });
  }
  deletePost(id:any){
    this.afs.collection('posts').doc(id).delete().then(()=>{
      this.toastr.error('Post Deleted!');
    });
  }
  markFeatured(id:any,data:any){
    this.afs.collection('posts').doc(id).update(data).then(()=>{
      this.toastr.info('Featured Status Updated!');
    });
  }
}
