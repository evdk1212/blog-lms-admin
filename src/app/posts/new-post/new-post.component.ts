import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'dk-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  permalink:string='';
  imgSrc:any='./assets/placeholder.png';
  selectedImg:any;
  categoryArray: Category[] = [
  
    // other objects...
  ];
  postForm!: FormGroup;
  post:any;
  formStatus:any='Add New';
  docId:any;
  constructor(private categoryService:CategoriesService, private fb:FormBuilder,private postService:PostService,private route:ActivatedRoute){

    this.route.queryParams.subscribe(val=>{
      this.docId=val;
      this.postService.loadOneData(val['id']).subscribe(post=>{
        this.post=post;
        this.postForm=this.fb.group(
          
          {
            title:[this.post.title,[Validators.required, Validators.minLength(10)]],
            permalink:[this.post.permalink, Validators.required],
            excerpt:[this.post.excerpt,[Validators.required, Validators.minLength(50)]],
            category:[`${this.post.category.categoryId}-${this.post.category.category}`],
            postImg:['',Validators.required],
            content:[this.post.content,Validators.required]
          }
        );
        this.imgSrc=this.post.postImgPath;
        this.formStatus='Edit';
      });
    });
    
    this.postForm=this.fb.group(
          
      {
        title:['',[Validators.required, Validators.minLength(10)]],
        permalink:['', Validators.required],
        excerpt:['',[Validators.required, Validators.minLength(50)]],
        category:[''],
        postImg:['',Validators.required],
        content:['',Validators.required]
      }
    );
  }
  ngOnInit(): void {
      this.categoryService.loadData().subscribe(val=>{
        this.categoryArray = val;
      });
  }
  get fc(){
    return this.postForm.controls;
  }

  onTitleChange($event:any){
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g,'-');
  }
  showPreview($event:any){
    const reader = new FileReader();
    reader.onload = (e)=>{
      this.imgSrc=e.target?.result;
    }
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg=$event.target.files[0];
  }
  onSubmit(){
    let splitted = this.postForm.value.category.split('-');
    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category:{
        categoryId:splitted[0],
        category:splitted[1],
      },
      postImgPath:'',
      excerpt:this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured:false,
      views:0,
      status:'new',
      createdAt: new Date().toDateString(),
    }
    this.postService.uploadImage(this.selectedImg,postData,this.formStatus,this.docId);
    this.postForm.reset();
    this.imgSrc='./assets/placeholder.png';
  }
}
