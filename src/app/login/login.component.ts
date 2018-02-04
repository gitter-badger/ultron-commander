import { Component, OnInit } from '@angular/core';
import axios from 'axios'
import { Router } from '@angular/router'

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

  constructor(private router: Router) { }

  ngOnInit() {
    localStorage.removeItem('session')
    this.apiurl = localStorage.getItem('apiurl')
  }

  login(e) {
    e.preventDefault()
    this.error = ''
    axios.get(`${this.apiurl}/token/${this.username}`, {
      auth: {username: this.username, password: this.password}
    })
    .then(res => {
      localStorage.setItem('apiurl', this.apiurl)
      localStorage.setItem('session', JSON.stringify({
        username: this.username,
        password: this.password,
        token: res.data.token
      }))
      this.router.navigate([''])
    })
    .catch(err => {
      this.error = 'Authentication faled !'
      console.error(err);
      localStorage.removeItem('session')
    })
  }

}
