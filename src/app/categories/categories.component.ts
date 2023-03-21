import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../models/category';

@Component({
  selector: 'dk-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
   categoryArray: Category[] = [
    
    // other objects...
  ];
  formCategory: any;
  formStatus: any='Add';
  categoryId:any;
  constructor(private categoryService: CategoriesService){
    
  }
  ngOnInit():void{
      this.categoryService.loadData().subscribe(val=>{
        this.categoryArray = val;

      });
  }
  onSubmit(formdata: any){
    let categoryData: Category = {

      category: formdata.value.category
      
    }
    if(this.formStatus=='Add'){
      this.categoryService.saveData(categoryData);
    }
    else{
      this.categoryService.updateData(this.categoryId,categoryData);
      this.formStatus='Add';
    }
    formdata.reset();
  }
  onEdit(category:any, id:any){
    this.formCategory=category;
    this.formStatus='Edit';
    this.categoryId=id;
  }
  onDelete(id:any){
    this.categoryService.DeleteCategory(id);
  }
  
}
