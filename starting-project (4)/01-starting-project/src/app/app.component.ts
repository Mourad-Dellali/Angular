import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  clickCount = signal(0);
onClick() {
  this.clickCount.update((prevCount) => prevCount + 1);
}
  private destroyRef = inject(DestroyRef);
  constructor () {
    effect(() => {
      console.log("Button clicked " + this.clickCount);
    });
  }
  ngOnInit(): void {
    // const subscription = interval(1000).pipe(map((val) => val * 2)).subscribe({
    //   next:(val) => console.log(val)
    // });

    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // })
  }
}
