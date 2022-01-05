import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

import { IWinWheel } from '@app/interfaces/win-wheel.interface';
import { IStoreState } from '@app/interfaces/store.interface';
import { winWheelDataSelector } from '@app/store/selectors/win-wheel.selector';
import { IGenericReducerState } from '@app/interfaces/general-reducer-state.interface';
import {
  spinTheWheel,
  spinTheWheelReset,
} from '@app/store/actions/spin.actions';
import { ISpinResult } from '@app/interfaces/spin.interface';
import { spinDataSelector } from '@app/store/selectors/spin.selector';
import { customerInfoDataSelector } from '@app/store/selectors/customerInfo.selector';
import { ICustomerReducerState } from '@app/interfaces/customerInfo.interface';

declare let Winwheel: any;

@Component({
  selector: 'app-win-wheel',
  templateUrl: './win-wheel.component.html',
  styleUrls: ['./win-wheel.component.scss'],
})
export class WinWheelComponent implements OnInit, AfterViewInit {
  constructor(
    private store: Store<IStoreState>,
    private spinner: NgxSpinnerService
  ) {
    this.winWheelData$ = this.store.select(winWheelDataSelector);
    this.spinData$ = this.store.select(spinDataSelector);
    this.winWheelData$.subscribe((data) => {
      this.winWheelRawData = data;
      this.setUpWinWheel();
      console.log(this.winWheelRawData);
    });
    this.spinData$.subscribe((data) => {
      this.spinRawData = data;
      const { isLoading, data: spinData } = this.spinRawData;
      if (!isLoading) this.spinner.hide();
      if (!isLoading && spinData) this.showSpinResult();
    });

    this.customerInfo$ = this.store.select(customerInfoDataSelector);
    this.customerInfo$.subscribe((data) => {
      this.customerInfoRawData = data;
    });
  }

  winWheelData$: Observable<IGenericReducerState<IWinWheel>>;
  winWheelRawData: IGenericReducerState<IWinWheel> | null = null;
  spinData$: Observable<IGenericReducerState<ISpinResult>>;
  spinRawData: IGenericReducerState<ISpinResult> | null = null;
  customerInfo$: Observable<ICustomerReducerState>;
  customerInfoRawData: ICustomerReducerState | null = null;
  theWheel: any;
  wheelPower = 0;
  wheelSpinning = false;
  winningSegment: string = '';
  audio = new Audio('/assets/media/tick.mp3');

  setUpWinWheel() {
    if (!this.winWheelRawData?.isLoading && this.winWheelRawData?.data) {
      for (let i = 0; i < this.winWheelRawData.data.spinSegments.length; i++) {
        const { id, color, segmentContent, obtainContent } =
          this.winWheelRawData.data.spinSegments[i];
        this.theWheel.addSegment(
          {
            id,
            strokeStyle: 'transparent',
            fillStyle: color,
            text: segmentContent,
            obtainContent,
          },
          i + 1
        );
      }
      this.theWheel.draw();
    }
  }

  playSound() {
    // Stop and rewind the sound (stops it if already playing).
    console.log(this.audio);
    this.audio.pause();
    this.audio.currentTime = 0;

    // Play the sound.
    this.audio.play();
  }
  ngAfterViewInit(): void {
    this.theWheel = new Winwheel({
      outerRadius: 154, // Use these three properties to
      innerRadius: 34, // Set inner radius to make wheel hollow.
      centerX: 200.8, // correctly position the wheel
      centerY: 225, // over the background.
      lineWidth: 2,
      numSegments: 0,
      textFontSize: 10,
      responsive: true, // This wheel is responsive!
      segments: [],
      animation: {
        type: 'spinToStop',
        duration: 5,
        spins: 8,
        callbackFinished: this.alertPrize.bind(this),
        callbackSound: () => this.playSound(), // Specify function to call when sound is to be triggered
      },
    });
  }

  ngOnInit(): void {}

  resetWheel(): void {
    this.theWheel.stopAnimation(false);
    this.theWheel.rotationAngle = 0;
    // this.theWheel.draw();
    this.wheelSpinning = false;
  }

  alertPrize(): void {
    this.winningSegment = this.theWheel.getIndicatedSegment().text;
    alert('You have won ' + this.theWheel.getIndicatedSegment().text);
    this.resetWheel();
  }

  public startSpin(): void {
    this.checkAvailable();
  }

  checkAvailable() {
    const isSpinEnd = this.spinRawData?.isLoaded;
    const remainingTurns = isSpinEnd
      ? this.spinRawData?.data?.remainingTurns
      : this.customerInfoRawData?.data?.remainingTurns;
    debugger;
    if (remainingTurns && !this.wheelSpinning) {
      if (this.wheelPower === 1) {
        this.theWheel.animation.spins = 3;
      } else if (this.wheelPower === 2) {
        this.theWheel.animation.spins = 8;
      } else if (this.wheelPower === 3) {
        this.theWheel.animation.spins = 15;
      }
      this.store.dispatch(spinTheWheelReset());
      this.store.dispatch(
        spinTheWheel({
          campaignId: this.winWheelRawData?.data?.id,
          headerConfig: new HttpHeaders()
            .append(
              'X-Auth-Code',
              this.customerInfoRawData?.loginInfo?.contractNumber + '' || ''
            )
            .append(
              'X-Auth-Phone',
              this.customerInfoRawData?.loginInfo?.phoneNumber + '' || ''
            )
            .append(
              'X-Auth-Campaign-Version',
              this.winWheelRawData?.data?.version + '' || ''
            ),
        })
      );
      this.spinner.show();
    }
  }

  showSpinResult() {
    const data = this.spinRawData?.data;
    const isLoading = this.spinRawData?.isLoading;
    if (!isLoading && data) {
      const { obtainSpinSegmentId } = data;
      const segmentIndex = this.winWheelRawData?.data?.spinSegments.findIndex(
        (value) => value.id === obtainSpinSegmentId
      );
      if (segmentIndex && segmentIndex >= 0) {
        // Get random angle inside specified segment of the wheel.
        let stopAt = this.theWheel.getRandomForSegment(segmentIndex + 1);

        // Important thing is to set the stopAngle of the animation before stating the spin.
        this.theWheel.animation.stopAngle = stopAt;

        // Start the spin animation here.
        this.wheelSpinning = true;
        this.theWheel.startAnimation();
      }
    }
  }
}
