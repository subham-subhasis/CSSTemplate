import { Component, OnInit, DoCheck } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { BillModel } from '../../models/bill.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorMessages } from 'src/app/utils/constants';
import { BillAmountComponent } from './widgets/bill-amount/bill-amount.component';
import { DisputeAmountComponent } from './widgets/dispute-amount/dispute-amount.component';
import { BillViewComponent } from './widgets/bill-view/bill-view.component';
import { CreditNotesComponent } from './widgets/credit-notes/credit-notes.component';
import { SharedService } from 'src/app/modules/shared/services/shared.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isAuthorizedBool = true;
  billList: BillModel[] = [];;
  compTypes: object[] = [];
  components = [
    {
      BillAmountComponent: BillAmountComponent
    },
    {
      DisputeAmountComponent: DisputeAmountComponent
    },
    {
      BillViewComponent: BillViewComponent
    },
    {
      CreditNotesComponent: CreditNotesComponent
    }
  ];
  constructor(private generalService: GeneralService, private spinnerService: NgxSpinnerService,
    private toastr: ToastrService, private sharedService: SharedService) { }

  ngOnInit() {
    document.getElementById('leftSidenav').style.zIndex = '1000000';
    document.getElementById('leftSidenav').style.border = '1px solid';
    this.generalService.widgetData.subscribe((data) => {
      if (data) {
        const widgets = [...data['homeScreenWidget']];
        this.createWidgets(widgets);
        this.generalService.getAccountsList();
        this.generalService.getBillList().subscribe(
          billData => {
            this.hideSpinners();
            if (Array.isArray(billData) && billData.length) {
              this.generalService.spinnerToggle.next('hideWidgetSpinner');
              this.billList = billData;
              this.sharedService.billList = billData;
              this.isAuthorizedBool = true;
              this.sharedService.isAuthorized = true;

            } else {
              this.sharedService.billList = [];
              this.toastr.error(ErrorMessages.BILLLIST_ERR_MSG);
            }
          },
          err => {
            if (err && err['status'] === 401) {
              this.isAuthorizedBool = false;
              this.sharedService.isAuthorized = false;
            }
            this.toastr.error(ErrorMessages.BILLLIST_ERR_MSG);
            this.hideSpinners();
          });
      }
    });
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngDoCheck() {
    const x = 10;
  }


  private hideSpinners() {
    document.getElementById('leftSidenav').style.zIndex = '1000';
    document.getElementById('leftSidenav').style.border = 'none';
    this.generalService.spinnerToggle.next(false);
    this.spinnerService.hide('appSpinner');
  }

  private createWidgets(widgets: any[]) {
    this.compTypes = [];
    let componentType: any;
    widgets.forEach(widget => {
      const widgetObj = {};
      this.components.forEach((component: object) => {
        let found = false;
        if (!found) {
          for (const key in component) {
            if (key === widget['componentName']) {
              componentType = component[key];
              found = true;
            }
          }
        }
      });
      widgetObj[widget['label']] = componentType;
      this.compTypes.push(widgetObj);
    });
  }

}
