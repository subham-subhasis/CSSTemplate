import { DashboardAbstractModel } from "./DashboardAbstractModel";

export class CreditNote extends DashboardAbstractModel {
  private pcrdId: number;
  private pbipId: number;
  private pcrrId: number;
  private creditStatus: string;
  private creditReferenceNumber: string;
  private creditRemarks: string;
  private includeInNextBill: boolean;
  private currency: string;
  private curId: number;
  private creditNetAmount: number;
  private creditVatAmount: number;
  private creditTransactionBalanceAmonut: number;
  private creditTransactionDate: number;
  private creditTransactionAmount: number;
  private includedInBill: boolean;
  private creditDueDays: number;
  private creditDueDate: number;
  private creditApplySalesTaxAtLineItem: boolean;
  private pmtPscdId: string;
  private creditLineItems: object[];
  private billCredits: object[];
  private automatic: boolean;

  public getPcrdId(): number {
    return this.pcrdId;
  }

  public setPcrdId(pcrdId: number): void {
    this.pcrdId = pcrdId;
  }

  public getPbipId(): number {
    return this.pbipId;
  }

  public setPbipId(pbipId: number): void {
    this.pbipId = pbipId;
  }

  public getPcrrId(): number {
    return this.pcrrId;
  }

  public setPcrrId(pcrrId: number): void {
    this.pcrrId = pcrrId;
  }

  public getCreditStatus(): string {
    return this.creditStatus;
  }

  public setCreditStatus(creditStatus: string): void {
    this.creditStatus = creditStatus;
  }

  public getCreditReferenceNumber(): string {
    return this.creditReferenceNumber;
  }

  public setCreditReferenceNumber(creditReferenceNumber: string): void {
    this.creditReferenceNumber = creditReferenceNumber;
  }

  public getCreditRemarks(): string {
    return this.creditRemarks;
  }

  public setCreditRemarks(creditRemarks: string): void {
    this.creditRemarks = creditRemarks;
  }

  public getIncludeInNextBill(): boolean {
    return this.includeInNextBill;
  }

  public setIncludeInNextBill(includeInNextBill: boolean): void {
    this.includeInNextBill = includeInNextBill;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public setCurrency(currency: string): void {
    this.currency = currency;
  }

  public getCurId(): number {
    return this.curId;
  }

  public setCurId(curId: number): void {
    this.curId = curId;
  }

  public getCreditNetAmount(): number {
    return this.creditNetAmount;
  }

  public setCreditNetAmount(creditNetAmount: number): void {
    this.creditNetAmount = creditNetAmount;
  }

  public getCreditVatAmount(): number {
    return this.creditVatAmount;
  }

  public setCreditVatAmount(creditVatAmount: number): void {
    this.creditVatAmount = creditVatAmount;
  }

  public getCreditTransactionBalanceAmonut(): number {
    return this.creditTransactionBalanceAmonut;
  }

  public setCreditTransactionBalanceAmonut(
    creditTransactionBalanceAmonut: number
  ): void {
    this.creditTransactionBalanceAmonut = creditTransactionBalanceAmonut;
  }

  public getCreditTransactionDate(): number {
    return this.creditTransactionDate;
  }

  public setCreditTransactionDate(creditTransactionDate: number): void {
    this.creditTransactionDate = creditTransactionDate;
  }

  public getCreditTransactionAmount(): number {
    return this.creditTransactionAmount;
  }

  public setCreditTransactionAmount(creditTransactionAmount: number): void {
    this.creditTransactionAmount = creditTransactionAmount;
  }

  public getIncludedInBill(): boolean {
    return this.includedInBill;
  }

  public setIncludedInBill(includedInBill: boolean): void {
    this.includedInBill = includedInBill;
  }

  public getCreditDueDays(): number {
    return this.creditDueDays;
  }

  public setCreditDueDays(creditDueDays: number): void {
    this.creditDueDays = creditDueDays;
  }

  public getCreditDueDate(): number {
    return this.creditDueDate;
  }

  public setCreditDueDate(creditDueDate: number): void {
    this.creditDueDate = creditDueDate;
  }

  public getCreditApplySalesTaxAtLineItem(): boolean {
    return this.creditApplySalesTaxAtLineItem;
  }

  public setCreditApplySalesTaxAtLineItem(
    creditApplySalesTaxAtLineItem: boolean
  ): void {
    this.creditApplySalesTaxAtLineItem = creditApplySalesTaxAtLineItem;
  }

  public getPmtPscdId(): string {
    return this.pmtPscdId;
  }

  public setPmtPscdId(pmtPscdId: string): void {
    this.pmtPscdId = pmtPscdId;
  }

  public getCreditLineItems(): object[] {
    return this.creditLineItems;
  }

  public setCreditLineItems(creditLineItems: object[]): void {
    this.creditLineItems = creditLineItems;
  }

  public getBillCredits(): object[] {
    return this.billCredits;
  }

  public setBillCredits(billCredits: object[]): void {
    this.billCredits = billCredits;
  }

  public isAutomatic(): boolean {
    return this.automatic;
  }

  public setAutomatic(automatic: boolean): void {
    this.automatic = automatic;
  }
}
