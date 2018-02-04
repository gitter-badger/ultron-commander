import { Component, OnInit } from '@angular/core';
import axios from 'axios'
import { Router } from '@angular/router'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  public reportnames: any = []
  public clients: any = []

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
  private selectedReport: string
  private done: any
  private taskPending: boolean = false

  constructor() {
    this.s = JSON.parse(localStorage.getItem('session'))
    this.apiurl = localStorage.getItem('apiurl')
   }

  ngOnInit() {

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

  selectReport(reportname) {
    axios.get(`${this.apiurl}/reports/${this.s.username}/${reportname}`, {
      auth: { username: this.s.username, password: this.s.password }
    })
      .then(res => {
        this.selectedReport = reportname
        this.clients = this.allClients = res.data.results
        this.chartDataPing = [0, 0, 0]
        this.chartDataSSH = [0, 0, 0]
        this.clients.map(client => {
          if (client.state.online === true) {
            this.chartDataPing[0] += 1
          } else if (client.state.online === false) {
            this.chartDataPing[1] += 1
          } else if (client.state.online === undefined) {
            this.chartDataPing[2] += 1
          }

          if (client.state.ssh_accessible === true) {
            this.chartDataSSH[0] += 1
          } else if (client.state.ssh_accessible === false) {
            this.chartDataSSH[1] += 1
          } else if (client.state.ssh_accessible === undefined) {
            this.chartDataSSH[2] += 1
          }
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  deleteReport(reportname, e) {
    e.stopPropagation()
    console.log(reportname)
    axios.delete(`${this.apiurl}/reports/${this.s.username}/${reportname}`, {
      auth: { username: this.s.username, password: this.s.password }
    })
      .then(res => {
        this.reportnames.splice(this.reportnames.indexOf(reportname), 1)
      })
      .catch(err => {
        console.error(err)
      })
  }

  perform(task) {
    if ( task === 'ping' ) {
      this.taskPending = true
      this.done = []
      axios.post(`${this.apiurl}/task/${this.s.username}/${this.selectedReport}`,
        { task: task},
        { auth: { username: this.s.username, password: this.s.password } }
      )
        .then(res => {
          setInterval( () => {
            axios.get(`${this.apiurl}/task/${this.s.username}/${this.selectedReport}`, {
              auth: { username: this.s.username, password: this.s.password }
            })
              .then(res2 => {
                console.log(res2)
                for (var key in res2.data.result) {
                  if (res2.data.result[key] === true) {
                    this.done.push(key)
                  }
                }
              })
              .catch(err2 => {
                console.error(err2)
              })
          }, 5000)
          this.taskPending = false
        })
        .catch(err => {
          console.error(err)
          this.taskPending = false
        })
    } else {
      console.log(task)
    }
  }

}
