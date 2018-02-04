import { Component, OnInit } from '@angular/core';
import axios from 'axios'
import { Router } from '@angular/router'
import { logging } from 'selenium-webdriver';
import { filter } from 'rxjs/operator/filter';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public reportnames: any = []
  public clients: any = []
  public selectedReport: number = -1
  public selectedClient: number = -1

  public chartType: string = 'pie';
  public chartDataPing: Array<any> = [0, 0, 0];
  public chartDataSSH: Array<any> = [0, 0, 0];
  public chartLabelsPing: Array<any> = ['online', 'offline', undefined];
  public chartLabelsSSH: Array<any> = ['ssh accessible', 'ssh inaccessible', undefined];
  public chartColors: Array<any> = [{
    hoverBorderWidth: 0,
    backgroundColor: ['rgba(0, 255, 0, 0.6)', 'rgba(255, 0, 0, 0.6)', 'rgba(10, 10, 10, 0.6)']
  }];
  public chartOptions: any = {
    responsive: true
  };

  private s: any
  private apiurl: string
  private router: Router
  private allClients: any

  constructor() {
    this.s = JSON.parse(localStorage.getItem('session'))
    this.apiurl = localStorage.getItem('apiurl')
   }

  ngOnInit() {
    if ( ! this.s ) {
      this.router.navigate(['/login'])
    }

    axios.get(`${this.apiurl}/admin/${this.s.username}`, {
      auth: {username: this.s.username, password: this.s.password}
    })
      .then(res => {
        this.reportnames = res.data.result.reportnames
      })
      .catch(err => {
        console.error(err)
      })
  }

  pingChartClicked(e) {
    let index = e.active[0]._index
    let maps = [true, false, undefined]
    var filtered = []
    this.allClients.forEach(client => {
      if (client.state.online === maps[index]) {
        filtered.push(client)
      }
    });
    this.clients = filtered
  }

  sshChartClicked(e) {
    let index = e.active[0]._index
    let maps = [true, false, undefined]
    var filtered = []
    this.allClients.forEach(client => {
      if (client.state.ssh_accessible === maps[index]) {
        filtered.push(client)
      }
    });
    this.clients = filtered
  }

  keys(obj) {
    return Object.keys(obj)
  }
  
  values(obj) {
    return Object.values(obj)
  }

  selectReport(number) {
    this.selectedReport = number
    let reportname = this.reportnames[number]
    axios.get(`${this.apiurl}/reports/${this.s.username}/${reportname}`, {
      auth: { username: this.s.username, password: this.s.password }
    })
      .then(res => {
        this.clients = this.allClients = res.data.results
        this.clients.map(client => {
          if (client.state.online === true) {
            this.chartDataPing[0] += 1
          } else if (client.state.online === false) {
            this.chartDataPing[1] += 1
          } else if (client.state === undefined) {
            this.chartDataPing[2] += 1
          }

          if (client.state.ssh_accessible === true) {
            this.chartDataSSH[0] += 1
          } else if (client.state.ssh_accessible === false) {
            this.chartDataSSH[1] += 1
          } else if (client.ssh_accessible === undefined) {
            this.chartDataSSH[2] += 1
          }
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  selectClient(number) {
    this.selectedClient = number;
  }

}
