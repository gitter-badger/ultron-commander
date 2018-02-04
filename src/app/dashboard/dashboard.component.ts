import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public checks: any = [
    'Ping check', 'SSH check'
  ]
  public reportname: string
  public clientnames: string
  public props: string = '{}'
  public pending: boolean = false
  public clients: any
  public error: string

  private s: any = JSON.parse(localStorage.getItem('session'))
  private apiurl: string = localStorage.getItem('apiurl')
  
  constructor(private router: Router) { }

  ngOnInit() {
  }

  generateReport(e) {
    e.preventDefault()
    this.pending = true
    this.error = ''
    axios.post(`${this.apiurl}/reports/${this.s.username}/${this.reportname}`,
    {clientnames: this.clientnames, props: this.props},
    {
      auth: { username: this.s.username, password: this.s.password }
    })
      .then(res => {
        this.clients = res.data.results
        this.pending = false
        this.router.navigate(['reports'])
      })
      .catch(err => {
        console.error(err)
        this.pending = false
        this.error = `${err.response.status}: ${err.response.statusText} !`
      })
  }

}
