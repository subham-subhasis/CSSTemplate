import { DashboardAbstractModel } from "./DashboardAbstractModel";

export class ToolBarItem extends DashboardAbstractModel {
  private itemLabel: string;
  private imageUrl: string;
  private screenName: string;

  public getItemLabel(): string {
    return this.itemLabel;
  }

  public setItemLabel(itemLabel: string): void {
    this.itemLabel = itemLabel;
  }

  public getImageUrl(): string {
    return this.imageUrl;
  }

  public setImageUrl(imageUrl: string): void {
    this.imageUrl = imageUrl;
  }

  public getScreenName(): string {
    return this.screenName;
  }

  public setScreenName(screenName: string): void {
    this.screenName = screenName;
  }
}
