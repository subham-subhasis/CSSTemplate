import { DashboardAbstractModel } from "./DashboardAbstractModel";
import { ToolBarItem } from "./toolbarItem.model";

export class Toolbar extends DashboardAbstractModel {
  private toolbarlabel: string;
  private imgUrl: string;
  private toolBarItemList: ToolBarItem[];

  public getToolBarItemList(): ToolBarItem[] {
    return this.toolBarItemList;
  }

  public setToolBarItemList(toolBarItemList: ToolBarItem[]): void {
    this.toolBarItemList = toolBarItemList;
  }

  public getToolbarlabel(): string {
    return this.toolbarlabel;
  }

  public setToolbarlabel(toolbarlabel: string): void {
    this.toolbarlabel = toolbarlabel;
  }

  public getImgUrl(): string {
    return this.imgUrl;
  }

  public setImgUrl(imgUrl: string): void {
    this.imgUrl = imgUrl;
  }
}
