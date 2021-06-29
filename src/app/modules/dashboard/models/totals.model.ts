import { DashboardAbstractModel } from "./DashboardAbstractModel";

export class Total extends DashboardAbstractModel {
  private pbsdId: string;
  private text: string;
  private amount: string;

  public getPbsdId(): string {
    return this.pbsdId;
  }

  public setPbsdId(pbsdId: string): void {
    this.pbsdId = pbsdId;
  }

  public getText(): string {
    return this.text;
  }

  public setText(text: string): void {
    this.text = text;
  }

  public getAmount(): string {
    return this.amount;
  }

  public setAmount(amount: string): void {
    this.amount = amount;
  }
}
