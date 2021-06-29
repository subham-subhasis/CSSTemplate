import { DashboardAbstractModel } from '../../dashboard/models/DashboardAbstractModel';
import { CurrencyModel } from './currency.model';

export class DisputeDetails extends DashboardAbstractModel {
  private bilRefNo: string;
  private billPeriod: string;
  private curId: number;
  private currency: CurrencyModel;
  private disputeAmt: number;
  private disputeComment: string;
  private disputeCreatedDate: number;
  private disputeFromDate: number;
  private disputeResolvedAmountFavoringCarrier: string;
  private disputeResolvedAmountFavoringOtherOperator: string;
  private disputeShortPay: string;
  private disputeToDate: number;
  private disputeTypeCode: string;
  private paccId: number;
  private pbilId: number;
  private pbpdId: number;
  private pdisId: number;
  private pdptId: number;
  private pscdId: number;
  private statusDisplay: string;

  public getBilRefNo(): string {
    return this.bilRefNo;
  }

  public setBilRefNo(bilRefNo: string): void {
    this.bilRefNo = bilRefNo;
  }

  public getBillPeriod(): string {
    return this.billPeriod;
  }

  public setBillPeriod(billPeriod: string): void {
    this.billPeriod = billPeriod;
  }

  public getCurId(): number {
    return this.curId;
  }

  public setCurId(curId: number): void {
    this.curId = curId;
  }

  public getCurrency(): CurrencyModel {
    return this.currency;
  }

  public setCurrency(currency: CurrencyModel): void {
    this.currency = currency;
  }

  public getDisputeAmt(): number {
    return this.disputeAmt;
  }

  public setDisputeAmt(disputeAmt: number): void {
    this.disputeAmt = disputeAmt;
  }

  public getDisputeComment(): string {
    return this.disputeComment;
  }

  public setDisputeComment(disputeComment: string): void {
    this.disputeComment = disputeComment;
  }

  public getDisputeCreatedDate(): number {
    return this.disputeCreatedDate;
  }

  public setDisputeCreatedDate(disputeCreatedDate: number): void {
    this.disputeCreatedDate = disputeCreatedDate;
  }

  public getDisputeFromDate(): number {
    return this.disputeFromDate;
  }

  public setDisputeFromDate(disputeFromDate: number): void {
    this.disputeFromDate = disputeFromDate;
  }

  public getDisputeResolvedAmountFavoringCarrier(): string {
    return this.disputeResolvedAmountFavoringCarrier;
  }

  public setDisputeResolvedAmountFavoringCarrier(
    disputeResolvedAmountFavoringCarrier: string
  ): void {
    this.disputeResolvedAmountFavoringCarrier = disputeResolvedAmountFavoringCarrier;
  }

  public getDisputeResolvedAmountFavoringOtherOperator(): string {
    return this.disputeResolvedAmountFavoringOtherOperator;
  }

  public setDisputeResolvedAmountFavoringOtherOperator(
    disputeResolvedAmountFavoringOtherOperator: string
  ): void {
    this.disputeResolvedAmountFavoringOtherOperator = disputeResolvedAmountFavoringOtherOperator;
  }

  public getDisputeShortPay(): string {
    return this.disputeShortPay;
  }

  public setDisputeShortPay(disputeShortPay: string): void {
    this.disputeShortPay = disputeShortPay;
  }

  public getDisputeToDate(): number {
    return this.disputeToDate;
  }

  public setDisputeToDate(disputeToDate: number): void {
    this.disputeToDate = disputeToDate;
  }

  public getDisputeTypeCode(): string {
    return this.disputeTypeCode;
  }

  public setDisputeTypeCode(disputeTypeCode: string): void {
    this.disputeTypeCode = disputeTypeCode;
  }

  public getPaccId(): number {
    return this.paccId;
  }

  public setPaccId(paccId: number): void {
    this.paccId = paccId;
  }

  public getPbilId(): number {
    return this.pbilId;
  }

  public setPbilId(pbilId: number): void {
    this.pbilId = pbilId;
  }

  public getPbpdId(): number {
    return this.pbpdId;
  }

  public setPbpdId(pbpdId: number): void {
    this.pbpdId = pbpdId;
  }

  public getPdisId(): number {
    return this.pdisId;
  }

  public setPdisId(pdisId: number): void {
    this.pdisId = pdisId;
  }

  public getPdptId(): number {
    return this.pdptId;
  }

  public setPdptId(pdptId: number): void {
    this.pdptId = pdptId;
  }

  public getPscdId(): number {
    return this.pscdId;
  }

  public setPscdId(pscdId: number): void {
    this.pscdId = pscdId;
  }

  public getStatusDisplay(): string {
    return this.statusDisplay;
  }

  public setStatusDisplay(statusDisplay: string): void {
    this.statusDisplay = statusDisplay;
  }
}
