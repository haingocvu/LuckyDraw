export interface IWinWheel {
  id: string;
  name: string;
  version: number;
  rules: string;
  spinSegments: Array<ISegment>;
  remainingRewards: IRemainingRewards;
}

export interface ISegment {
  id: string;
  segmentContent: string;
  obtainContent: string;
  color: string;
  contentColor: string;
  type: string;
  contentSize: number;
}

export interface IRemainingRewards {
  totalQuantity: number;
  details: Array<IRewardInfo>;
}

export interface IRewardInfo {
  reward: string;
  quantity: number;
}
