import { DashboardAbstractModel } from "./DashboardAbstractModel";
import { BipCurrencyAmount } from "./bipCurrencyAmt.model";

export class DisputeModel extends DashboardAbstractModel {
  private disputeTotalAmountBipCur: string;
  private disputeFromDate: number;
  private disputeToDate: number;
  private bipId: string;
  private bipHomeCurAmount: BipCurrencyAmount;
  private currencyBreakDown: BipCurrencyAmount[];

  public getBipHomeCurAmount(): BipCurrencyAmount {
    return this.bipHomeCurAmount;
  }

  public setBipHomeCurAmount(bipHomeCurAmount: BipCurrencyAmount): void {
    this.bipHomeCurAmount = bipHomeCurAmount;
  }

  public getCurrencyBreakDown(): BipCurrencyAmount[] {
    return this.currencyBreakDown;
  }

  public setCurrencyBreakDown(currencyBreakDown: BipCurrencyAmount[]): void {
    this.currencyBreakDown = currencyBreakDown;
  }

  public getDisputeTotalAmountBipCur(): string {
    return this.disputeTotalAmountBipCur;
  }

  public setDisputeTotalAmountBipCur(disputeTotalAmountBipCur: string): void {
    this.disputeTotalAmountBipCur = disputeTotalAmountBipCur;
  }

  public getDisputeFromDate(): number {
    return this.disputeFromDate;
  }

  public setDisputeFromDate(disputeFromDate: number): void {
    this.disputeFromDate = disputeFromDate;
  }

  public getDisputeToDate(): number {
    return this.disputeToDate;
  }

  public setDisputeToDate(disputeToDate: number): void {
    this.disputeToDate = disputeToDate;
  }

  public getBipId(): string {
    return this.bipId;
  }

  public setBipId(bipId: string): void {
    this.bipId = bipId;
  }
}
