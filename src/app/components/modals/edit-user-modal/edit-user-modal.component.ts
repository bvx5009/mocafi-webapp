import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorMessage } from 'src/app/models/error-message.mode';
import { User } from 'src/app/models/user.model';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent implements OnInit {
  updateUser: FormGroup;
  errorMessages: ErrorMessage[] = [];

  constructor(
    public dialog:  MatDialogRef<EditUserModalComponent>,
    private userService: UserService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: User,
  ) {
    this.updateUser = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      gender: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
    });
   }

  ngOnInit(): void {
    this.updateUser.setValue({
      id: this.data.id,
      name: this.data.name,
      email: this.data.email,
      gender: this.data.gender,
      status: this.data.status,
    });
  }

  submitUpdateUser() {
    this.userService.updateUser(this.updateUser.value).subscribe(
      (response) => {
        if (response != null) {
          this.snackbarService.successSnackBar("Successfully updated user");
          this.dialog.close({data: response})
        }
      },
      (err) => {
        console.log('HTTP Error', err),
        err?.error.forEach((error: ErrorMessage) => {
          this.errorMessages.push(error);
        });
        
        this.snackbarService.failureSnackBar("Something went wrong, sorraaay");
        this.updateUser.setErrors({ 'invalid': true });
      },
      () => {
        console.log('completed')
      }
    )
  }

  cancelUpdateUser() {
    this.updateUser.reset();
    this.dialog.close();
    this.snackbarService.successSnackBar('Update user canceled')
  }
}
