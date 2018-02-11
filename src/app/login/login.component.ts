import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from '../api.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public username: string
  public password: string
  public apiurl: string
  public error: string
  public pending: boolean = false

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {
    localStorage.removeItem('session')
    this.apiurl = localStorage.getItem('apiurl')
  }

  login(e) {
    e.preventDefault()
    this.error = ''
    this.pending = true
    this.api.login(this.apiurl, this.username, this.password).subscribe(
      res => {
        localStorage.setItem('apiurl', this.apiurl)
        localStorage.setItem('session', JSON.stringify({
          username: this.username,
          token: res.token
        }))
        this.router.navigate([''])
      },
      err => {
        this.error = 'Authentication failed !'
        this.pending = false
      }
    )
  }

}
