import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { Footer }  from '../../footer/footer';
// import { Header }  from '../../header/header';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}