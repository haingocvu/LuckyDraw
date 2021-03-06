import { Component, Input, OnInit } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-reward-alert',
  templateUrl: './reward-alert.component.html',
  styleUrls: ['./reward-alert.component.scss'],
})
export class RewardAlertComponent implements OnInit {
  @Input()
  self!: SwalComponent;
  @Input()
  dataString!: string;
  @Input()
  type!: string;
  constructor() {}

  ngOnInit(): void {}

  get congratulationString() {
    return `${this.dataString}`;
  }

  closeDialog(): void {
    this.self.close();
  }
}
