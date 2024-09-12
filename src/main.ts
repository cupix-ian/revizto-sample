import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AppService } from './app.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  template: `
    <div class='wrapper'>
      <form>
        <mat-form-field>
          <input matInput placeholder="access token" [formControl]="accessToken"/>
        </mat-form-field>
        <mat-form-field>
          <input matInput placeholder="project ID" [formControl]="projectId" />
        </mat-form-field>
        <input (change)="onFileSelected()" #fileInput type="file" id="file">
        <button mat-flat-button (click)="submit()">
          submit
        </button>
      </form>
    </div>
  `,
  styles: `
    .wrapper  {
      padding: 1rem;
      form {
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 0.5rem;
      }
    }
  `,
})
export class App {
  accessToken = new FormControl();

  projectId = new FormControl();

  constructor(private service: AppService) {
    this.accessToken.valueChanges.subscribe((v) => {
      service.accessToken = v;
    });
    this.projectId.valueChanges.subscribe((v) => {
      service.projectId = v;
    });
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    this.service.file = inputNode.files[0];
  }

  submit() {
    this.service.createIssue();
  }
}

bootstrapApplication(App, {
  providers: [provideAnimationsAsync()],
});
