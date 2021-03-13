import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedFile: File = null;

  constructor(private http: HttpClient){

  }

  ngOnInit(){

  }

  title = 'file-upload';

  fileChange(event){
    this.selectedFile = <File> event.target.files[0];
  }

  onUpload(){
    const fd = new FormData();
    fd.append('picture', this.selectedFile, this.selectedFile.name);
    this.http.post('http://localhost:3000/api/upload', fd)
        .subscribe(res =>{
          console.log(res);
        });
  }
}
