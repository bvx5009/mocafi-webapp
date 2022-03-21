import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorMessage } from 'src/app/models/error-message.mode';
import { User } from 'src/app/models/user.model';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss']
})

export class CreateUserModalComponent implements OnInit {
  createUser: FormGroup;
  errorMessages: ErrorMessage[] = [];

  constructor(
    public dialog:  MatDialogRef<CreateUserModalComponent>,
    private userService: UserService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: User,
  ) {
    this.createUser = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(50), Validators.min(4)]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(50)]),
      gender: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
    });
   }

  ngOnInit(): void {
  }

  
  submitCreateUser() {
    this.userService.createUser(this.createUser.value).subscribe(
      (response) => {
        if (response != null) {
          this.snackbarService.successSnackBar("Successfully created user");
          this.dialog.close({data: response})
        }
      },
      (err) => {
        console.log('HTTP Error', err),
        err?.error.forEach((error: ErrorMessage) => {
          this.errorMessages.push(error);
        });
        
        this.snackbarService.failureSnackBar("Something went wrong, sorraaay");
        this.createUser.setErrors({ 'invalid': true });
      },
      () => {
        console.log('completed')
      }
    )
  }

  cancelCreateUser() {
    this.createUser.reset();
    this.dialog.close();
    this.snackbarService.successSnackBar('Create user canceled')
  }

}
