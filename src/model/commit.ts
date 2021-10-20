export interface Author {  
    email: string
    name: string
    username: string
}
  
export interface Commit {  
    author: Author
    message: string
    timestamp: string
    url: string
}