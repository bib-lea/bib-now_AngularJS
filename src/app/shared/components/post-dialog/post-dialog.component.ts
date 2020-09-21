import { Component, OnInit } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormControl} from '@angular/forms';
import {CrudService} from '../../services/crud.service';
import {Post} from '../../models/post';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from "rxjs";
import { AngularFireStorage} from "@angular/fire/storage";
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.css']
})
export class PostDialogComponent implements OnInit {

  contentControl: FormControl;
  user: any;
  posts: any[];

  types: string[] = [
    'Fundbüro',
    'Tutorium',
    'Q&A'
  ];

  downloadURL: Observable<string>;

  image: string
  topic: FormControl;
  content: FormControl;

  constructor(
    private afAuth: AngularFireAuth,
    private crudService: CrudService,

    private selfRef: MatDialogRef<PostDialogComponent>,
    private storage: AngularFireStorage
  )
  {
    this.afAuth.onAuthStateChanged(user => {
      this.user = user;
      console.log(this.user);
    });
  }

  ngOnInit(): void {
    this.contentControl = new FormControl('', []);
  }

  onPost(): void {
    let post: Post = {
      username: this.user ? this.user.email : 'Anonym',
      content: this.contentControl.value
    };

    this.crudService.createPost(post)
      .then(res => {
        console.log(res);
        this.resetControl();
      })
      .catch(err => {
        console.log(err);
      });
  }

  onPosten() {
    const postData = {
      //author: this.afAuth.authState.displayName || this.auth.authState.email,
      author: '',
      //authorId: this.afAuth.currentUserId,
      authorId: '',
      content: this.content.value,
      image: this.image || null,
      published: new Date(),
      topic: this.topic.value
    }
    this.crudService.createPost(postData).then(res => {
      this.topic.reset();
      this.content.reset();
      this.image = '';
      console.log(res);
    })}

    upload(event) {
      var n = Date.now();
      const file = event.target.files[0];
      const filePath = `posts/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`posts/${n}`, file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                this.image = url;
              }
              console.log(this.image);
            });
          })
        )
        .subscribe(url => {
          if (url) {
            console.log(url);
          }
        });
      }

  onCancel(): void {
    this.selfRef.close();
  }

  private resetControl(): void {
    this.contentControl.reset();
  }
}
