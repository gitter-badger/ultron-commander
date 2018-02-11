import { Component, OnInit } from '@angular/core'
import { ApiService } from '../api.service'
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
  private selectedReport: string
  private clientsFilter: any = undefined
  private taskFinished: number = -1
  private refreshId: any

  constructor(private api: ApiService) {
    this.s = JSON.parse(localStorage.getItem('session'))
    this.apiurl = localStorage.getItem('apiurl')
   }

  ngOnInit() {

    this.api.get(`${this.apiurl}/admin/${this.s.username}`)
    .subscribe(res => {
      this.reportnames = res.result.reportnames
    })
  }

  filteredClients() {
    if (this.clientsFilter === undefined) {
      return this.clients
    }
    var filtered = []
    this.clients.forEach(client => {
      if (this.clientsFilter(client)) {
        filtered.push(client)
      }
    });
    return filtered
  }

  removeFilters() {
    this.clientsFilter = undefined
  }

  pingChartClicked(e) {
    let index = e.active[0]._index
    let maps = [true, false, undefined]
    this.clientsFilter = client => client.state.online === maps[index]
  }

  sshChartClicked(e) {
    let index = e.active[0]._index
    let maps = [true, false, undefined]
    this.clientsFilter = client => client.state.ssh_accessible === maps[index]
  }

  keys(obj) {
    return Object.keys(obj)
  }

  values(obj) {
    return Object.values(obj)
  }

  selectReport(reportname) {
    this.api.get(`${this.apiurl}/reports/${this.s.username}/${reportname}`)
    .subscribe(res => {
      this.selectedReport = reportname
      this.clients = res.results
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
  }

  deleteReport(reportname, e) {
    e.stopPropagation()
    console.log(reportname)
    this.api.delete(`${this.apiurl}/reports/${this.s.username}/${reportname}`)
    .subscribe(res => {
      this.reportnames.splice(this.reportnames.indexOf(reportname), 1)
    })
  }

  finished(self) {
    this.api.get(`${self.apiurl}/task/${self.s.username}/${self.selectedReport}`)
    .subscribe(res => {
      self.selectReport(self.selectedReport)
      self.taskFinished = Object.values(res.result).reduce((k,v) => {
        return v ? k+1 : k
      }, 0)
      console.log(self.taskFinished, Object.keys(self.filteredClients()).length)
      if (self.taskFinished == Object.keys(res.result).length) {
        self.taskFinished = -1
        clearInterval(self.refreshId);
      }
    })
  }

  // perform(task) {
  //   if ( task === 'ping' ) {
  //     this.taskFinished = 0
  //     axios.post(`${this.apiurl}/task/${this.s.username}/${this.selectedReport}`,
  //       { task, clientnames: this.filteredClients().map(x => x.clientname).join(',') },
  //       { auth: { username: this.s.username, password: this.s.password } }
  //     )
  //       .then(res => {
  //         this.refreshId = setInterval( () => {this.finished(this)}, 5000 )
  //       })
  //       .catch(err => {
  //         console.error(err)
  //         this.taskFinished = -1
  //       })
  //   } else {
  //     console.log(task)
  //   }
  // }
  //
  // cancel() {
  //   axios.delete(`${this.apiurl}/task/${this.s.username}/${this.selectedReport}`, {
  //     auth: { username: this.s.username, password: this.s.password }
  //   })
  //     .then(res => {
  //       clearInterval(this.refreshId);
  //       this.taskFinished = -1
  //       this.selectReport(this.selectedReport)
  //     })
  //     .catch(err => {
  //       console.error(err)
  //     })
  // }

}
