import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorMessage } from 'src/app/models/error-message.mode';
import { User } from 'src/app/models/user.model';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { EditUserModalComponent } from '../edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-delete-user-modal',
  templateUrl: './delete-user-modal.component.html',
  styleUrls: ['./delete-user-modal.component.scss']
})
export class DeleteUserModalComponent implements OnInit {
  deleteUser: FormGroup;
  errorMessages: ErrorMessage[] = [];

  constructor(
    public dialog: MatDialogRef<EditUserModalComponent>,
    private userService: UserService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: User,
  ) {
    this.deleteUser = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$'), Validators.maxLength(50), Validators.min(4)]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(30)]),
      gender: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.deleteUser.setValue({
      id: this.data.id,
      name: this.data.name,
      email: this.data.email,
      gender: this.data.gender,
      status: this.data.status,
    });
  }

  submitDeleteUser() {
    this.userService.deleteUser(this.deleteUser.value).subscribe(
      (response) => {
        this.snackbarService.successSnackBar("Successfully deleted user");
        this.dialog.close({ data: this.data.id })
      },
      (err) => {
        console.log('HTTP Error', err),
          err?.error?.forEach((error: ErrorMessage) => {
            this.errorMessages.push(error);
          });

        this.snackbarService.failureSnackBar("Something went wrong, sorraaay");
        this.deleteUser.setErrors({ 'invalid': true });
      },
      () => {
        console.log('completed')
      }
    )
  }

  cancelDeleteUser() {
    this.deleteUser.reset();
    this.dialog.close();
    this.snackbarService.successSnackBar('Delete user canceled')
  }
}

