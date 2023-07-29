import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'vapeshop';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    console.log("run");
    this.userService.getLoginStatus().pipe(take(1)).subscribe(data => {
      console.log("check login stat");
      console.log("check data",data);
      if (!data) {
        console.log("error login");
        this.userService.login().pipe(take(1)).subscribe(logdata => {
          console.log("done log data");
          console.log("token", logdata.token);

          localStorage.setItem('token', logdata.token);
        });
      } else {
        console.log("correct login");
        console.log("login data",data);
      }
    })
  }

  logout() {
    this.userService.logout().pipe(take(1)).subscribe(data => {
      console.log("after logout");
      console.log("logout data", data);
    });
  }

  update(){
    localStorage.setItem('myKey', 'myValue');
  }

  get lowkal() {
    return  localStorage.getItem('myKey');
  }
}
