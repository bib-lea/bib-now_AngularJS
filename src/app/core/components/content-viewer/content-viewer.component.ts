import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import { Post } from 'src/app/shared/models/post';
import {CrudService} from '../../../shared/services/crud.service';

@Component({
  selector: 'app-content-viewer',
  templateUrl: './content-viewer.component.html',
  styleUrls: ['./content-viewer.component.css']
})
export class ContentViewerComponent implements OnInit {

  posts: Post[];

  constructor(
    private afAuth: AngularFireAuth,
    private crudService: CrudService
  ) { }

  ngOnInit(): void {
    this.crudService.getPost().subscribe(data => {

      this.posts = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Post;
      })
      console.log(this.posts);
    })
  }


  }


