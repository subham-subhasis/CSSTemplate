export class ToolBar {
    toolBarName: string;
    tolBarOrderNum:number;
    toolBarItems: Array<ToolBarItemModel>
}

export class ToolBarItemModel {
    toolBarItemName: string;
    actions: Array<String>;
}