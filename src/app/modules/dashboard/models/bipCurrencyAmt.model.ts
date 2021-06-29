import { DashboardAbstractModel } from "./DashboardAbstractModel";

export class BipCurrencyAmount extends DashboardAbstractModel {
  private curId: string;
  curName: string;
  curCd: string;
  disputeAmount: number;

  public getCurId(): string {
    return this.curId;
  }

  public setCurId(curId: string): void {
    this.curId = curId;
  }

  public getCurName(): string {
    return this.curName;
  }

  public setCurName(curName: string): void {
    this.curName = curName;
  }

  public getCurCd(): string {
    return this.curCd;
  }

  public setCurCd(curCd: string): void {
    this.curCd = curCd;
  }

  public getDisputeAmount(): number {
    return this.disputeAmount;
  }

  public setDisputeAmount(disputeAmount: number): void {
    this.disputeAmount = disputeAmount;
  }
}
