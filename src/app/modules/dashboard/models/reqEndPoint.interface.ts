export class RequestEndPoint {
  private requestEndpoint: string;
  private entityId: string;
  private requestParam: object;

  public getEntityId(): string {
    return this.entityId;
  }

  public setEntityId(entityId: string): void {
    this.entityId = entityId;
  }

  public getRequestEndpoint(): string {
    return this.requestEndpoint;
  }

  public setRequestEndpoint(requestEndpoint: string): void {
    this.requestEndpoint = requestEndpoint;
  }

  public getRequestParam(): object {
    return this.requestParam;
  }

  public setRequestParam(requestParam: object): void {
    this.requestParam = requestParam;
  }
}
