import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  selectedFiles: File [] = [];

  serverData: ServerData[];
  urlArray: Object[] = [];

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private http: HttpClient){

  }

  title = 'file-upload';

  fileChange(event){
    for(var i =0; i< event.target.files.length; i++){
      this.selectedFiles.push(event.target.files[i]);
    }
  }

  onUpload(){
    const fd = new FormData();
    for(var i =0; i<this.selectedFiles.length; i++){
      fd.append('pictures', this.selectedFiles[i]);
    }
    this.http.post('http://localhost:3000/api/uploads', fd)
        .subscribe(res =>{
          console.log(res);
        });
  }

  getData(): Observable<ServerData[]>{
    return this.http
    .get<ServerData>('http://localhost:3000/api/uploads')
    .pipe(map(response => {
      const array = JSON.parse(JSON.stringify(response)) as any[];
      const datas = array.map(data => new ServerData(data));
      return datas;
    }));
    // used to test
    //console.log(this.datas);
  }

  onDownload(){
    this.getData().subscribe(
      data =>{
        for(let i=0; i<data.length; i++){
          this.urlArray[i] = data[i].url;
        }
        // used to test
        // console.log(this.urlArray.toString());
      },
      error => {
        console.log(error);
      }
    );
    // used to test
    // setTimeout(() => {console.log(this.urlArray.length)}, 3000);
  }
  
  ngOnInit(): void{
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
    },
    // max-width 800
    {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
    },
    // max-width 400
    {
        breakpoint: 400,
        preview: false
    }
  ];
  setInterval(() =>{
    this.onDownload();
    let tempArray: any[] = [];
    for(let i=0; i<this.urlArray.length; i++){
      tempArray.push({ 
        small: `${this.urlArray[i]}`,
        medium: `${this.urlArray[i]}`,
        big: `${this.urlArray[i]}`
      });
    }
    console.log(tempArray);
    this.galleryImages = tempArray;
  }, 5000);
  
  }

}

class ServerData{
  url: string;
  name: string;

  constructor(data: any){
    Object.assign(this, data);
  }
}


