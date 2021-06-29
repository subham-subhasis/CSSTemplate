import { DashboardAbstractModel } from './DashboardAbstractModel';

export class BillPeriodModel extends DashboardAbstractModel {
  private pbpdId: number;
  private billProfile: object;
  private pbipId: number;
  private consolidatedBillPeriod: number;
  private consolidatedPbpdId: number;
  private statusCode: string;
  private fromDate: number;
  private toDate: null;
  private closeDate: null;
  private notification: boolean;

  public getPbpdId(): number {
    return this.pbpdId;
  }

  public setPbpdId(pbpdId: number): void {
    this.pbpdId = pbpdId;
  }

  public getBillProfile(): object {
    return this.billProfile;
  }

  public setBillProfile(billProfile: object): void {
    this.billProfile = billProfile;
  }

  public getPbipId(): number {
    return this.pbipId;
  }

  public setPbipId(pbipId: number): void {
    this.pbipId = pbipId;
  }

  public getConsolidatedBillPeriod(): number {
    return this.consolidatedBillPeriod;
  }

  public setConsolidatedBillPeriod(consolidatedBillPeriod: number): void {
    this.consolidatedBillPeriod = consolidatedBillPeriod;
  }

  public getConsolidatedPbpdId(): number {
    return this.consolidatedPbpdId;
  }

  public setConsolidatedPbpdId(consolidatedPbpdId: number): void {
    this.consolidatedPbpdId = consolidatedPbpdId;
  }

  public getStatusCode(): string {
    return this.statusCode;
  }

  public setStatusCode(statusCode: string): void {
    this.statusCode = statusCode;
  }

  public getFromDate(): number {
    return this.fromDate;
  }

  public setFromDate(fromDate: number): void {
    this.fromDate = fromDate;
  }

  public getToDate(): null {
    return this.toDate;
  }

  public setToDate(toDate: null): void {
    this.toDate = toDate;
  }

  public getCloseDate(): null {
    return this.closeDate;
  }

  public setCloseDate(closeDate: null): void {
    this.closeDate = closeDate;
  }

  public isNotification(): boolean {
    return this.notification;
  }

  public setNotification(notification: boolean): void {
    this.notification = notification;
  }
}
