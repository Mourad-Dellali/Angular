import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  clickCount = signal(0);

  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;
    const interval = setInterval(() => {
      if (timesExecuted > 3) {
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log("emitting new value");
      subscriber.next({message: 'New Value'});
      timesExecuted++;
    },2000);
  });

  
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
    this.customInterval$.subscribe({
    next: (val) => console.log(val),
    complete: () => console.log("completed"),
    error : () => console.log("error")
  });
    // const subscription = interval(1000).pipe(map((val) => val * 2)).subscribe({
    //   next:(val) => console.log(val)
    // });

    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // })
  }
}
