import { DashboardAbstractModel } from './DashboardAbstractModel';
import { BillPeriodModel } from './billperiod.model';

export class BillChartModel extends DashboardAbstractModel {
  private billName:string;
  private pbilId: number;
  private billProfile: object;
  private pbipId: number;
  private billPeriod: BillPeriodModel;
  private pbpdId: number;
  private billVersionNumber: number;
  private billReferenceNumber: number;
  private settlement: string;
  private pstlId: number;
  private billCreatedDate: number;
  private billStatusCode: string;
  private billNextStatusCode: number;
  private currency: string;
  private curId: number;
  private billNetAmount: number;
  private billVatAmount: number;
  private billTransactionDate: number;
  private billTransactionAmount: number;
  private billTransactionBalanceAmount: number;
  private billOriginalDueDate: number;
  private billDueDate: number;
  private billNumber: number;
  private billPeriodChangeText: string;
  private billCreatedUserTbl: string;
  private billCreatedUsrId: number;
  private billModifiedUserTbl: string;
  private billModifiedUsrId: number;
  private billLineItems: object[];
  private billFiles: object[];
  private billBillPeriods: object[];
  private billCredits: object[];
  private applySalesTaxAtLineItem: string;
  private transactionDelete: boolean;
  private billAdjustmentTask: boolean;
  private billPeriodChange: boolean;
  private billAdjustment: boolean;
  private recreating: boolean;
  private dispute: boolean;

  public getPbilId(): number {
    return this.pbilId;
  }

  public setPbilId(pbilId: number): void {
    this.pbilId = pbilId;
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

  public getBillPeriod(): BillPeriodModel {
    return this.billPeriod;
  }

  public setBillPeriod(billPeriod: BillPeriodModel): void {
    this.billPeriod = billPeriod;
  }

  public getPbpdId(): number {
    return this.pbpdId;
  }

  public setPbpdId(pbpdId: number): void {
    this.pbpdId = pbpdId;
  }

  public getBillVersionNumber(): number {
    return this.billVersionNumber;
  }

  public setBillVersionNumber(billVersionNumber: number): void {
    this.billVersionNumber = billVersionNumber;
  }

  public getBillReferenceNumber(): number {
    return this.billReferenceNumber;
  }

  public setBillReferenceNumber(billReferenceNumber: number): void {
    this.billReferenceNumber = billReferenceNumber;
  }

  public getSettlement(): string {
    return this.settlement;
  }

  public setSettlement(settlement: string): void {
    this.settlement = settlement;
  }

  public getPstlId(): number {
    return this.pstlId;
  }

  public setPstlId(pstlId: number): void {
    this.pstlId = pstlId;
  }

  public getBillCreatedDate(): number {
    return this.billCreatedDate;
  }

  public setBillCreatedDate(billCreatedDate: number): void {
    this.billCreatedDate = billCreatedDate;
  }

  public getBillStatusCode(): string {
    return this.billStatusCode;
  }

  public setBillStatusCode(billStatusCode: string): void {
    this.billStatusCode = billStatusCode;
  }

  public getBillNextStatusCode(): number {
    return this.billNextStatusCode;
  }

  public setBillNextStatusCode(billNextStatusCode: number): void {
    this.billNextStatusCode = billNextStatusCode;
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

  public getBillNetAmount(): number {
    return this.billNetAmount;
  }

  public setBillNetAmount(billNetAmount: number): void {
    this.billNetAmount = billNetAmount;
  }

  public getBillVatAmount(): number {
    return this.billVatAmount;
  }

  public setBillVatAmount(billVatAmount: number): void {
    this.billVatAmount = billVatAmount;
  }

  public getBillTransactionDate(): number {
    return this.billTransactionDate;
  }

  public setBillTransactionDate(billTransactionDate: number): void {
    this.billTransactionDate = billTransactionDate;
  }

  public getBillTransactionAmount(): number {
    return this.billTransactionAmount;
  }

  public setBillTransactionAmount(billTransactionAmount: number): void {
    this.billTransactionAmount = billTransactionAmount;
  }

  public getBillTransactionBalanceAmount(): number {
    return this.billTransactionBalanceAmount;
  }

  public setBillTransactionBalanceAmount(
    billTransactionBalanceAmount: number
  ): void {
    this.billTransactionBalanceAmount = billTransactionBalanceAmount;
  }

  public getBillOriginalDueDate(): number {
    return this.billOriginalDueDate;
  }

  public setBillOriginalDueDate(billOriginalDueDate: number): void {
    this.billOriginalDueDate = billOriginalDueDate;
  }

  public getBillDueDate(): number {
    return this.billDueDate;
  }

  public setBillDueDate(billDueDate: number): void {
    this.billDueDate = billDueDate;
  }

  public getBillNumber(): number {
    return this.billNumber;
  }

  public setBillNumber(billNumber: number): void {
    this.billNumber = billNumber;
  }

  public getBillPeriodChangeText(): string {
    return this.billPeriodChangeText;
  }

  public setBillPeriodChangeText(billPeriodChangeText: string): void {
    this.billPeriodChangeText = billPeriodChangeText;
  }

  public getBillCreatedUserTbl(): string {
    return this.billCreatedUserTbl;
  }

  public setBillCreatedUserTbl(billCreatedUserTbl: string): void {
    this.billCreatedUserTbl = billCreatedUserTbl;
  }

  public getBillCreatedUsrId(): number {
    return this.billCreatedUsrId;
  }

  public setBillCreatedUsrId(billCreatedUsrId: number): void {
    this.billCreatedUsrId = billCreatedUsrId;
  }

  public getBillModifiedUserTbl(): string {
    return this.billModifiedUserTbl;
  }

  public setBillModifiedUserTbl(billModifiedUserTbl: string): void {
    this.billModifiedUserTbl = billModifiedUserTbl;
  }

  public getBillModifiedUsrId(): number {
    return this.billModifiedUsrId;
  }

  public setBillModifiedUsrId(billModifiedUsrId: number): void {
    this.billModifiedUsrId = billModifiedUsrId;
  }

  public getBillLineItems(): object[] {
    return this.billLineItems;
  }

  public setBillLineItems(billLineItems: object[]): void {
    this.billLineItems = billLineItems;
  }

  public getBillFiles(): object[] {
    return this.billFiles;
  }

  public setBillFiles(billFiles: object[]): void {
    this.billFiles = billFiles;
  }

  public getBillBillPeriods(): object[] {
    return this.billBillPeriods;
  }

  public setBillBillPeriods(billBillPeriods: object[]): void {
    this.billBillPeriods = billBillPeriods;
  }

  public getBillCredits(): object[] {
    return this.billCredits;
  }

  public setBillCredits(billCredits: object[]): void {
    this.billCredits = billCredits;
  }

  public getApplySalesTaxAtLineItem(): string {
    return this.applySalesTaxAtLineItem;
  }

  public setApplySalesTaxAtLineItem(applySalesTaxAtLineItem: string): void {
    this.applySalesTaxAtLineItem = applySalesTaxAtLineItem;
  }

  public getTransactionDelete(): boolean {
    return this.transactionDelete;
  }

  public setTransactionDelete(transactionDelete: boolean): void {
    this.transactionDelete = transactionDelete;
  }

  public getBillAdjustmentTask(): boolean {
    return this.billAdjustmentTask;
  }

  public setBillAdjustmentTask(billAdjustmentTask: boolean): void {
    this.billAdjustmentTask = billAdjustmentTask;
  }

  public getBillPeriodChange(): boolean {
    return this.billPeriodChange;
  }

  public setBillPeriodChange(billPeriodChange: boolean): void {
    this.billPeriodChange = billPeriodChange;
  }

  public getBillAdjustment(): boolean {
    return this.billAdjustment;
  }

  public setBillAdjustment(billAdjustment: boolean): void {
    this.billAdjustment = billAdjustment;
  }

  public getRecreating(): boolean {
    return this.recreating;
  }

  public setRecreating(recreating: boolean): void {
    this.recreating = recreating;
  }

  public isDispute(): boolean {
    return this.dispute;
  }

  public setDispute(dispute: boolean): void {
    this.dispute = dispute;
  }
}
