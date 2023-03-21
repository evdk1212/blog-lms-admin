export interface Post {
    id?:any,
    title:any,
    permalink:any,
    category:{
        categoryId:any,
        category:any
    },
    postImgPath:any,
    excerpt:any,
    content:any,
    isFeatured:boolean,
    views: number,
    status: string,
    createdAt:string,
}
