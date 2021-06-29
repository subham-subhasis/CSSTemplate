import { DashboardAbstractModel } from "./DashboardAbstractModel";

export class LoginModel extends DashboardAbstractModel {
  private usrDisplayName: string;
  private usrId: number;
  private usrName: string;
  private smcId: number;
  private pudgId: number;
  private smcGroup: number;
  private casTgc: string;
  private pwsToken: number;

  public getUsrDisplayName(): string {
    return this.usrDisplayName;
  }

  public setUsrDisplayName(usrDisplayName: string): void {
    this.usrDisplayName = usrDisplayName;
  }

  public getUsrId(): number {
    return this.usrId;
  }

  public setUsrId(usrId: number): void {
    this.usrId = usrId;
  }

  public getUsrName(): string {
    return this.usrName;
  }

  public setUsrName(usrName: string): void {
    this.usrName = usrName;
  }

  public getSmcId(): number {
    return this.smcId;
  }

  public setSmcId(smcId: number): void {
    this.smcId = smcId;
  }

  public getPudgId(): number {
    return this.pudgId;
  }

  public setPudgId(pudgId: number): void {
    this.pudgId = pudgId;
  }

  public getSmcGroup(): number {
    return this.smcGroup;
  }

  public setSmcGroup(smcGroup: number): void {
    this.smcGroup = smcGroup;
  }

  public getCasTgc(): string {
    return this.casTgc;
  }

  public setCasTgc(casTgc: string): void {
    this.casTgc = casTgc;
  }

  public getPwsToken(): number {
    return this.pwsToken;
  }

  public setPwsToken(pwsToken: number): void {
    this.pwsToken = pwsToken;
  }
}
