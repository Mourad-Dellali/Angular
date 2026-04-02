import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private httpClient  = inject(HttpClient);
  
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', "SOmething went wrong");
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'Something went wrong').pipe(
      tap((places) => this.userPlaces.set(places)),
    );
  }

  addPlaceToUserPlaces(placeId: string) {
    return this.httpClient
      .put<{ userPlaces: Place[] }>('http://localhost:3000/user-places', {
        placeId,
      })
      .pipe(
        map((resData) => resData.userPlaces),
        tap((userPlaces) => this.userPlaces.set(userPlaces)),
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error('Something went wrong'));
        }),
      );
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url : string, errorMessage : string) {
    return this.httpClient.get<{places : Place[]}>(url).pipe(
      map((resData) => resData.places),
      catchError((error) => {
        console.log(error);
        return throwError(() => new Error(errorMessage));
      }),
    )
  }
}
