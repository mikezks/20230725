import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { CityPipe } from '@flight-demo/shared/ui-common';
import { Flight, FlightService } from '@flight-demo/tickets/domain';
import { timer } from 'rxjs';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
})
export class FlightSearchComponent {
  from = signal('London');
  to = signal('New York');
  flights: Array<Flight> = [];
  selectedFlight: Flight | undefined;

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  flightRoute = computed(
    () => 'From' + this.from() + ' to ' + this.to() + '.'
  );

  private flightService = inject(FlightService);

  timer$ = timer(0, 1_000);
  timer = toSignal(this.timer$, {
    initialValue: -1
    // requireSync: true
  });

  constructor() {
    console.log(this.from(), this.timer());
    effect(
      () => console.log(this.from(), this.timer())
    );
    this.from.set('Berlin');
    // this.from.update(value => value + ' nach München');
    // this.from.mutate(value => value + ' nach München');


  }

  search(): void {
    if (!this.from() || !this.to()) {
      return;
    }

    // Reset properties
    this.selectedFlight = undefined;

    this.flightService.find(this.from(), this.to()).subscribe({
      next: (flights) => {
        this.flights = flights;
      },
      error: (errResp) => {
        console.error('Error loading flights', errResp);
      },
    });
  }

  select(f: Flight): void {
    this.selectedFlight = { ...f };
  }
}
