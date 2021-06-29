export class DashboardAbstractModel {
  private orderNo: number;
  private responseMessage: object;
  private systemGeneratedFl: boolean;
  private deleteFl: boolean;
  private versionId: number;
  private id: number;
  private partitionId: number;
  private displayString: string;
  private new: boolean;
  private responseCode: number;

  public getResponseCode(): number {
    return this.responseCode;
  }

  public setResponseCode(responseCode: number): void {
    this.responseCode = responseCode;
  }

  public getSystemGeneratedFl(): boolean {
    return this.systemGeneratedFl;
  }

  public setSystemGeneratedFl(systemGeneratedFl: boolean): void {
    this.systemGeneratedFl = systemGeneratedFl;
  }

  public getDeleteFl(): boolean {
    return this.deleteFl;
  }

  public setDeleteFl(deleteFl: boolean): void {
    this.deleteFl = deleteFl;
  }

  public getVersionId(): number {
    return this.versionId;
  }

  public setVersionId(versionId: number): void {
    this.versionId = versionId;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getPartitionId(): number {
    return this.partitionId;
  }

  public setPartitionId(partitionId: number): void {
    this.partitionId = partitionId;
  }

  public getDisplayString(): string {
    return this.displayString;
  }

  public setDisplayString(displayString: string): void {
    this.displayString = displayString;
  }

  public getOrderNo(): number {
    return this.orderNo;
  }

  public setOrderNo(orderNo: number): void {
    this.orderNo = orderNo;
  }

  public getResponseMessage(): object {
    return this.responseMessage;
  }

  public setResponseMessage(responseMessage: object): void {
    this.responseMessage = responseMessage;
  }

  public isNew(): boolean {
    return this.new;
  }

  public setNew(isNew: boolean): void {
    this.new = isNew;
  }
}
