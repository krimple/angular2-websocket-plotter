import {Component, Input, ElementRef, OnInit, OnChanges,
        ChangeDetectorRef, ChangeDetectionStrategy, NgZone} from '@angular/core';
import {ReplaySubject} from 'rxjs/Rx';
import {SmoothieChart} from "smoothie";
import {TimeSeries} from "smoothie";

@Component({
  selector: 'plotter',
  inputs: [
    'dataSet', 'width', 'height', 'id'
  ],
  template: `
    <h3>Plot</h3>
    <canvas id="{{id}}" width="{{width}}" height="{{height}}"></canvas>
    <h3>Type in the text area</h3>
    {{ data }}
  `
})
export class Plotter implements OnInit, OnChanges {
  @Input() id: string;
  @Input() width: number;
  @Input() height: number;
  @Input() incomingData$: Array<string>;
  chart: any;
  sineLine: any;
  data: string = "";

  constructor(private element: ElementRef, private ngZone: NgZone) {
  }

  ngOnInit() {
    this.chart = new SmoothieChart();
    this.sineLine = new TimeSeries();
    this.chart.addTimeSeries(this.sineLine);
    this.chart.streamTo(this.element.nativeElement.getElementsByTagName('canvas')[0]);
    console.log(`initialized plotter with id: ${this.id}, 
                 width: ${this.width}, height: ${this.height}, dataSet: ${this.incomingData$}`);
   }

   ngOnChanges(data) {
       if (data.incomingData$) {
           if (data.incomingData$.currentValue) {
               this.ngZone.runOutsideAngular(() => {
                 this.sineLine.append(new Date().getTime(),
                    JSON.parse(data.incomingData$.currentValue).value);
               });
           }
       }
   }
}
