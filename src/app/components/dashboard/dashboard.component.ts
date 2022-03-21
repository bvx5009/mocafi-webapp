import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user.model';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { CreateUserModalComponent } from '../modals/create-user-modal/create-user-modal.component';
import { DeleteUserModalComponent } from '../modals/delete-user-modal/delete-user-modal.component';
import { EditUserModalComponent } from '../modals/edit-user-modal/edit-user-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dataSourceUsers = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'name',
    'email',
    'gender',
    'status',
    'action'
  ];

  @ViewChild('userPaginator') set userPaginator(paginator: MatPaginator) {
    this.dataSourceUsers.paginator = paginator;
  }

  @ViewChild('userTableSort') set userTableSort(sort: MatSort) {
    this.dataSourceUsers.sort = sort;
  }

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(
      (response) => {
        if (response != null || response != undefined) {
          response.forEach(user => {
            this.dataSourceUsers.data.push(user);
          });
        }
        this.dataSourceUsers.filter = '';
      },
      (err) => {
        console.log('HTTP Error', err),
          this.snackbarService.failureSnackBar("Something went wrong, sorraaay");
      },
      () => {
        console.log('completed')
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceUsers.filter = filterValue.trim().toLowerCase();
  }

  editUser(user: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65%';
    dialogConfig.maxHeight = '40%';
    dialogConfig.data = user;
    const editUserDialogRef = this.dialog.open(EditUserModalComponent, dialogConfig);
    editUserDialogRef.afterClosed().subscribe(response => {
      if (response?.data != null || response?.data != undefined) {
        const index = this.dataSourceUsers.data.findIndex(user => user.id === response.data.id);
        this.dataSourceUsers.data[index] = {
          ...response.data
        }
        this.dataSourceUsers.data = this.dataSourceUsers.data;
      }
    })
  }

  deleteUser(user: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65%';
    dialogConfig.maxHeight = '40%';
    dialogConfig.data = user;
    const deleteUserDialogRef = this.dialog.open(DeleteUserModalComponent, dialogConfig);
    deleteUserDialogRef.afterClosed().subscribe(response => {
      if (response?.data != null || response?.data != undefined) {

        const index = this.dataSourceUsers.data.findIndex(user => user.id === response.data);
        this.dataSourceUsers.data.splice(index, 1)
        this.dataSourceUsers.data = this.dataSourceUsers.data;
      }
    })
  }

  createUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '65%';
    dialogConfig.maxHeight = '40%';
    const createUserDialogRef = this.dialog.open(CreateUserModalComponent, dialogConfig);
    createUserDialogRef.afterClosed().subscribe(response => {
      if (response?.data != null || response?.data != undefined) {
        this.dataSourceUsers.data.push(response.data);
      }
    })
  }
}

