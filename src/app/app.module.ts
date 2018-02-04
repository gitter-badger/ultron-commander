import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms'
import { AuthGuard } from './auth.guard'


import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { ReportsComponent } from './reports/reports.component';
import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    ReportsComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard] 
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuard] 
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ])
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
