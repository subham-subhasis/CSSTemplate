import { DashboardAbstractModel } from "./DashboardAbstractModel";
import { Toolbar } from "./toolbar.model";

export class DashboardList extends DashboardAbstractModel {
  private toolbarList: Toolbar[];
  private isAdmin: boolean;
  private userName: string;

  public getIsAdmin(): boolean {
    return this.isAdmin;
  }

  public setIsAdmin(isAdmin: boolean): void {
    this.isAdmin = isAdmin;
  }

  public getUserName(): string {
    return this.userName;
  }

  public setUserName(userName: string): void {
    this.userName = userName;
  }

  public getToolbarList(): Toolbar[] {
    return this.toolbarList;
  }

  public setToolbarList(toolbarList: Toolbar[]): void {
    this.toolbarList = toolbarList;
  }
}
