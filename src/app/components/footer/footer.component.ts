import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SwalPortalTargets } from '@sweetalert2/ngx-sweetalert2';
import { FocusMonitor } from '@angular/cdk/a11y';

import { IWinWheel } from '@app/interfaces/win-wheel.interface';
import { winWheelDataSelector } from '@app/store/selectors/win-wheel.selector';
import { IStoreState } from '@app/interfaces/store.interface';
import { IGenericReducerState } from '@app/interfaces/general-reducer-state.interface';

import { customerInfoDataSelector } from '@app/store/selectors/customerInfo.selector';
import { ICustomerInfo } from '@app/interfaces/customerInfo.interface';
import { ISpinResult } from '@app/interfaces/spin.interface';
import { spinDataSelector } from '@app/store/selectors/spin.selector';
import { MessageService } from '@app/services/message/message.service';
import { toDateTimeString } from '@app/utils/datetime.util';
import { getCustomerInfoReset } from '@app/store/actions/customerInfo.actions';

import {
  remainingTurnsSelector,
  remainingRewardSelector,
} from '@app/store/selectors/combine.selector';
import { IRemainingRewards } from '@app/interfaces/win-wheel.interface';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, AfterViewInit {
  @ViewChild('rulesSwal')
  public readonly rulesSwal!: SwalComponent;
  @ViewChild('signInSwal')
  public readonly signInSwal!: SwalComponent;
  winWheelData$: Observable<IGenericReducerState<IWinWheel>>;
  winWheelRawData: IGenericReducerState<IWinWheel> | null = null;
  customerInfo$: Observable<IGenericReducerState<ICustomerInfo>>;
  customerInfoRawData: IGenericReducerState<ICustomerInfo> | null = null;
  spinData$: Observable<IGenericReducerState<ISpinResult>>;
  spinRawData: IGenericReducerState<ISpinResult> | null = null;
  remainingTurns: number = 0;
  // @ts-ignore
  remainingRewards: IRemainingRewards = null;

  constructor(
    private store: Store<IStoreState>,
    public dialog: MatDialog,
    private messageService: MessageService,
    public readonly swalTargets: SwalPortalTargets,
    private _focusMonitor: FocusMonitor
  ) {
    this.winWheelData$ = this.store.select(winWheelDataSelector);
    this.winWheelData$.subscribe((data) => {
      this.winWheelRawData = data;
    });

    this.customerInfo$ = this.store.select(customerInfoDataSelector);
    this.customerInfo$.subscribe((data) => {
      this.customerInfoRawData = data;
    });

    this.spinData$ = this.store.select(spinDataSelector);
    this.spinData$.subscribe((data) => {
      this.spinRawData = data;
    });

    this.store.select(remainingTurnsSelector).subscribe((turns) => {
      this.remainingTurns = turns || 0;
    });

    this.store.select(remainingRewardSelector).subscribe((remainingRewards) => {
      // @ts-ignore
      this.remainingRewards = remainingRewards;
    });
  }
  ngAfterViewInit(): void {
    // @ts-ignore
    this._focusMonitor.stopMonitoring(document.getElementById('spinNow'));
  }

  openDialogSignIn() {
    this.signInSwal.fire();
  }

  openRulesDialog() {
    this.rulesSwal.fire();
  }

  startSpin() {
    const isLoading = this.customerInfoRawData?.isLoading;
    const rawData = this.customerInfoRawData?.data;

    if (!isLoading && rawData) {
      // spin the wheel using message service
      this.messageService.changeMessage(1);
    } else {
      // authentication
      this.store.dispatch(getCustomerInfoReset());
      this.openDialogSignIn();
    }
  }

  get isShowRemainingTurns() {
    return this.customerInfoRawData?.data?.remainingTurns;
  }

  get getRemainingTurns() {
    return this.remainingTurns;
  }

  get effectiveDate() {
    const eDate = this.customerInfoRawData?.data?.effectiveToDate;
    return eDate
      ? toDateTimeString(
          this.customerInfoRawData?.data?.effectiveToDate,
          'yyyy-MM-dd HH:mm:ss',
          'HH:mm:ss dd-MM-yyyy'
        )
      : null;
  }

  ngOnInit(): void {}
}
