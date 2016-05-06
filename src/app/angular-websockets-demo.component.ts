import {Component, OnInit} from '@angular/core';
import {Input} from '@angular/core';
import {SineWaveDataService} from './sinewave-data.service';
import {Plotter} from './plotter';
import {Printer} from './printer';
import {ReplaySubject} from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'angular-websockets-demo-app',
  styleUrls: ['angular-websockets-demo.component.css'],
  providers: [SineWaveDataService],
  template: `
    <plotter id="myPlotter"
          width="900"
         height="100"
         [incomingData$]="incomingData$ | async"></plotter>
`,
  directives: [Plotter]
})
export class AngularWebsocketsDemoAppComponent {
  message: string;
  incomingData$: ReplaySubject<string>;

  constructor(private dataService: SineWaveDataService) {
    this.incomingData$ = dataService.observableSineWave(0.15, 1);
  }

  ngOnInit() {
    this.incomingData$.subscribe(
        (dataPoint) => {
            ;
        },
        (error) => {
            console.error(error);
        },
        () => {
            console.log('socket complete');
        });
  }
}
