import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header-item',
  standalone: true,
  imports: [],
  templateUrl: './header-item.component.html',
  styleUrl: './header-item.component.css'
})
export class HeaderItemComponent {
image = input.required<{ src: string; alt : string}>();
title = input.required<string>();
}
