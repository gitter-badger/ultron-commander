import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';


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
  public published: boolean = false
  public pending: boolean = false
  public clients: any
  public error: string

  private s: any = JSON.parse(localStorage.getItem('session'))

  constructor(private router: Router, private api: ApiService) { }

  ngOnInit() {
  }

  generateReport(e) {
    e.preventDefault()
    this.pending = true
    this.error = ''
    this.api.post(`/reports/${this.s.username}/${this.reportname}`,
    {clientnames: this.clientnames, props: this.props})
    .subscribe(res => {
      this.clients = res.results
      this.pending = false
      this.router.navigate(['reports'])
    })
  }

}
