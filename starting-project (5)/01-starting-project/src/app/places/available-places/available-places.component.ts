import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
onSelectPlace(selectedPlace: Place) {
  this.httpClient.put('http://localhost:3000/user-places', {
    placeId: selectedPlace.id,
  }).subscribe({
    next: (resData) => console.log(resData),
  });
}
  places = signal<Place[] | undefined>(undefined);
  private destroyRef = inject(DestroyRef)
  isFetching = signal(false);
  private httpClient = inject(HttpClient)
  error = signal('');

  ngOnInit() {
    this.isFetching.set(true);
   const subscription =  this.httpClient.get<{places: Place[]}>('http://localhost:3000/places').pipe(
    map((resData) => resData.places)
   )
   .subscribe({
      next: (places) => {
        this.places.set(places);
      },
      error : (error) => {
        console.log(error);
        this.error.set("Something Went Wrong");
        
      },
      complete: () => {
        this.isFetching.set(false);
         },
    });
    
  this.destroyRef.onDestroy(() => {
    subscription.unsubscribe();
  });
  }

}
