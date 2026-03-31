import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  private destroyRef = inject(DestroyRef)

  private httpClient = inject(HttpClient)

  ngOnInit() {
   const subscription =  this.httpClient.get<{places: Place[]}>('http://localhost:3000/places', {
    observe: 'response'
   }).subscribe({
      next: (response) => {
        console.log(response);
      }
    });
    
  this.destroyRef.onDestroy(() => {
    subscription.unsubscribe();
  });
  }

}
