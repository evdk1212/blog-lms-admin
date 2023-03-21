import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'dk-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent implements OnInit {
  postArray: Post[] = [
    
    // other objects...
  ];

  constructor(private postService: PostService){}
  ngOnInit(): void {
      this.postService.loadData().subscribe(val=>{
        this.postArray=val;
      });
  }
  onDelete(postImgPath:any,id:any){
    this.postService.deleteImg(postImgPath,id);
  }
  onFeatured(id:any,val:boolean){
    const featuredData={
      isFeatured:val,
    };
    this.postService.markFeatured(id,featuredData);
  }
}
