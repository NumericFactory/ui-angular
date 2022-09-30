/**
 * @Author : Frederic Lossignol / NumericFactory
 * Instructions : this is a standalone componenent. no need to add Dependencies in ngModule
 * 1/ Install material CDK with the command : npm install @angular/material and npm install @angular/cdk
 * 2/ create a file slider.component.ts and copy/paste the script below
 * 3/ reference SliderComponent in imports:[SliderComponent] (in app.module.ts)
 * 
 * 4/ it's OK, you can use it in your Angular app exemple : 
 *  <app-slider
    (sliderChangeEvent)="onSlideChange($event)"
    [minValue]="0"
    [maxValue]="100"
    [thumbOneInitValue]="15"
    [thumbTwoInitValue]="45"
  ></app-slider>
 * 
 */
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  standalone: true,
  imports: [DragDropModule],
  selector: 'app-slider',
  template: `<div
  (window:resize)="onResize($event)"
  #sliderContainer
  class="slider-container"
>
  <div class="line"></div>

  <div
    #dragThumbOne
    cdkDragBoundary=".slider-container"
    cdkDragLockAxis="x"
    cdkDrag
    class="thumb-one"
    (cdkDragMoved)="minMove($event)"
    [cdkDragFreeDragPosition]="dragPosition1"
  ></div>

  <div
    #dragThumbTwo
    cdkDragBoundary=".slider-container"
    cdkDragLockAxis="x"
    cdkDrag
    class="thumb-two"
    (cdkDragMoved)="maxMove($event)"
    [cdkDragFreeDragPosition]="dragPosition2"
  ></div>
</div>
<div>{{ thumbOneValue }}</div>

<div>{{ thumbTwoValue }}</div>`,

  styles: [
    `.slider-container {
    position: relative;
    width: 100%;
    padding: 0.7em;
    background-color: rgb(240 242 250);
    border-radius: 25px;
  }
  .line {
    width: calc(100% - 1.4em);
    height: 10px;
    background: #b7bfda;
    border-radius: 25px;
    position: absolute;
    top: 0.5em;
    z-index: 0;
  }
  
  .thumb-one {
    width: 1.4em;
    height: 1.4em;
    background: rgb(4, 60, 245);
    border-radius: 50%;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
  }
  
  .thumb-two {
    width: 1.4em;
    height: 1.4em;
    background: rgb(255, 60, 0);
    border-radius: 50%;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
  }
  .thumb-one:hover,
  .thumb-two:hover {
    box-shadow: 0 0 0 1px #fff, 0 0 0 0.25rem rgba(110, 110, 110, 0.25);
    cursor: pointer;
  }`,
  ],
})
export class SliderComponent implements OnInit {
  // ElementRef
  @ViewChild('sliderContainer') slidercontainer: ElementRef;
  @ViewChild('dragThumbOne') dragThumbOne: ElementRef;
  @ViewChild('dragThumbTwo') dragThumbTwo: ElementRef;
  // Input data
  @Input() minValue: number; // the minValue on the slider
  @Input() maxValue: number; // the maxValue on the slider
  @Input() thumbOneInitValue: number; // initial value of the thumb 1 when the slider appear
  @Input() thumbTwoInitValue: number; // initial value of the thumb 2 when the slider appear
  // Event
  @Output() sliderChangeEvent = new EventEmitter<any>();

  // Other Values
  rangeValue: number = 100;
  sliderContainerwitdhInPixels = 300;
  stepInPixels: number = 3;

  thumbOneValue: number = 0;
  thumbTwoValue: number = 5;
  lastValue1: number = 0;
  lastValue2: number = 5;

  sliderContainerPosition = { top: 0, left: 0 };

  dragPosition1 = { x: 0, y: 0 };
  dragPosition2 = { x: 0, y: 0 };

  constructor() {}

  ngOnInit() {
    // redefine range value between minValue and maxValue of the slider
    this.rangeValue = this.maxValue - this.minValue;
    // redefine thumbOneValue and thumbTwoValue at initial values send on @Input() (on the HTML)
    this.thumbOneValue = this.thumbOneInitValue;
    this.thumbTwoValue = this.thumbTwoInitValue;
  }

  ngAfterViewInit() {
    this.dragThumbOne.nativeElement.getBoundingClientRect();
    // define "sliderContainerwitdhInPixels" "stepInPixels" "sliderContainerPosition" with real values
    this.setValues();
    // Initialize Position in pixels of thumb1 and thumb2
    let stepsthumbOne = this.thumbOneInitValue - this.minValue;
    this.dragPosition1.x = stepsthumbOne * this.stepInPixels;
    let stepsthumbTwo = this.thumbTwoInitValue - this.minValue;
    this.dragPosition2.x = stepsthumbTwo * this.stepInPixels;
  }

  onResize(e) {
    // define "sliderContainerwitdhInPixels" "stepInPixels" "sliderContainerPosition" with real values
    this.setValues();
    // Set Position in pixels of thumb1 and thumb2
    let stepsthumbOne = this.thumbOneValue - this.minValue;
    this.dragPosition1.x = stepsthumbOne * this.stepInPixels;
    let stepsthumbTwo = this.thumbTwoValue - this.minValue;
    this.dragPosition2.x = stepsthumbTwo * this.stepInPixels;
  }

  /**
   * minMove()
   * called when user move the thumb1
   */
  minMove(e):void {
    let value: number = 0; // print value in °c
    value =
      (e.source.element.nativeElement.getBoundingClientRect().x -
        this.sliderContainerPosition.left) /
        this.stepInPixels +
      this.minValue;
    value = Math.round((value / 100) * 100);

    if (value != this.lastValue1) {
      this.lastValue1 = value;
      this.thumbOneValue = value;
      this.sliderChangeEvent.emit({
        value1: this.thumbOneValue,
        value2: this.thumbTwoValue,
      });
    }

    if (
      this.dragThumbOne.nativeElement.getBoundingClientRect().right >=
      this.dragThumbTwo.nativeElement.getBoundingClientRect().left
    ) {
      //return false;
    }
  }

  /**
   * maxMove():void
   * called when user move the thumb2
   */
  maxMove(e) {
    let value: number = 0; // print value in °c
    value =
      (e.source.element.nativeElement.getBoundingClientRect().x -
        this.sliderContainerPosition.left) /
        this.stepInPixels +
      this.minValue;
    value = Math.round((value / 100) * 100);

    if (value != this.lastValue2) {
      this.lastValue2 = value;
      this.thumbTwoValue = value;
      this.sliderChangeEvent.emit({
        value1: this.thumbOneValue,
        value2: this.thumbTwoValue,
      });
    }

    if (
      this.dragThumbOne.nativeElement.getBoundingClientRect().right >=
      this.dragThumbTwo.nativeElement.getBoundingClientRect().left
    ) {
      //return false;
    }
  }

  /**
   * SET VALUES
   * define "sliderContainerwitdhInPixels" "stepInPixels" "sliderContainerPosition" with real values
   */
  setValues():void {
    // sliderContainerwitdhInPixels
    this.sliderContainerwitdhInPixels =
      this.slidercontainer.nativeElement.getBoundingClientRect().width;
    console.log('largeur slidercontainer', this.sliderContainerwitdhInPixels);
    // stepInPixels
    this.stepInPixels = this.sliderContainerwitdhInPixels / this.rangeValue;
    console.log('stepInPixels : ', this.stepInPixels);
    // sliderContainerPosition
    this.sliderContainerPosition.top =
      this.slidercontainer.nativeElement.getBoundingClientRect().top;
    this.sliderContainerPosition.left =
      this.slidercontainer.nativeElement.getBoundingClientRect().left;
    console.log('sliderPosition', this.sliderContainerPosition);
  }
}
