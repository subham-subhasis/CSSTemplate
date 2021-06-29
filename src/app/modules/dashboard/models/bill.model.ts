import { DashboardAbstractModel } from "./DashboardAbstractModel";

export class BillModel extends DashboardAbstractModel {
  private pbdlId: number;
  private billProfile: string;
  private pbipId: number;
  private billProfileName: string;

  public getPbdlId(): number {
    return this.pbdlId;
  }

  public setPbdlId(pbdlId: number): void {
    this.pbdlId = pbdlId;
  }

  public getBillProfile(): string {
    return this.billProfile;
  }

  public setBillProfile(billProfile: string): void {
    this.billProfile = billProfile;
  }

  public getPbipId(): number {
    return this.pbipId;
  }

  public setPbipId(pbipId: number): void {
    this.pbipId = pbipId;
  }

  public getBillProfileName(): string {
    return this.billProfileName;
  }

  public setBillProfileName(billProfileName: string): void {
    this.billProfileName = billProfileName;
  }
}
