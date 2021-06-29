import { DashboardAbstractModel } from "./DashboardAbstractModel";
import { Total } from "./totals.model";

export class BillTotal extends DashboardAbstractModel {
  private pbdtId: number;
  private pbilId: number;
  private cashflow: string;
  private dueDate: number;
  private referenceNumber: string;
  private versionNumber: number;
  private paymentStatus: string;
  private status: string;
  private billPeriodFrom: number;
  private billPeriodTo: number;
  private billProfileName: string;
  private amount: number;
  private currency: string;
  private totals: Total[];

  public getPbdtId(): number {
    return this.pbdtId;
  }

  public setPbdtId(pbdtId: number): void {
    this.pbdtId = pbdtId;
  }

  public getPbilId(): number {
    return this.pbilId;
  }

  public setPbilId(pbilId: number): void {
    this.pbilId = pbilId;
  }

  public getCashflow(): string {
    return this.cashflow;
  }

  public setCashflow(cashflow: string): void {
    this.cashflow = cashflow;
  }

  public getDueDate(): number {
    return this.dueDate;
  }

  public setDueDate(dueDate: number): void {
    this.dueDate = dueDate;
  }

  public getReferenceNumber(): string {
    return this.referenceNumber;
  }

  public setReferenceNumber(referenceNumber: string): void {
    this.referenceNumber = referenceNumber;
  }

  public getVersionNumber(): number {
    return this.versionNumber;
  }

  public setVersionNumber(versionNumber: number): void {
    this.versionNumber = versionNumber;
  }

  public getPaymentStatus(): string {
    return this.paymentStatus;
  }

  public setPaymentStatus(paymentStatus: string): void {
    this.paymentStatus = paymentStatus;
  }

  public getStatus(): string {
    return this.status;
  }

  public setStatus(status: string): void {
    this.status = status;
  }

  public getBillPeriodFrom(): number {
    return this.billPeriodFrom;
  }

  public setBillPeriodFrom(billPeriodFrom: number): void {
    this.billPeriodFrom = billPeriodFrom;
  }

  public getBillPeriodTo(): number {
    return this.billPeriodTo;
  }

  public setBillPeriodTo(billPeriodTo: number): void {
    this.billPeriodTo = billPeriodTo;
  }

  public getBillProfileName(): string {
    return this.billProfileName;
  }

  public setBillProfileName(billProfileName: string): void {
    this.billProfileName = billProfileName;
  }

  public getAmount(): number {
    return this.amount;
  }

  public setAmount(amount: number): void {
    this.amount = amount;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public setCurrency(currency: string): void {
    this.currency = currency;
  }

  public getTotals(): Total[] {
    return this.totals;
  }

  public setTotals(totals: Total[]): void {
    this.totals = totals;
  }
}
