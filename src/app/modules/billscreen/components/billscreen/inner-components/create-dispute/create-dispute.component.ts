import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BillProfileService } from 'src/app/modules/billscreen/services/bill-profile.service';
import { DisputeDetails } from 'src/app/modules/billscreen/models/disputeDetails.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { BillChartModel } from 'src/app/modules/dashboard/models/billchart.model';
import { SettingsService } from 'src/app/services/settings.service';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';

@Component({
  selector: 'app-create-dispute',
  templateUrl: './create-dispute.component.html',
  styleUrls: ['./create-dispute.component.scss']
})
export class CreateDisputeComponent implements OnInit, OnDestroy {

  routeParam = '';
  showTableAndFormComp = false;
  showCompHeader = false;
  listFetched = false;
  disputeDetails = [];
  subscription: Subscription;
  billDetails: BillChartModel;
  selected = {};
  localeProperties: any;
  config: PerfectScrollbarConfigInterface = {};
  screenActions = {};

  constructor(private router: Router, private billProfileService: BillProfileService,
    private spinnerService: NgxSpinnerService, private settingsService: SettingsService, private generalService: GeneralService) { }

  ngOnInit() {
    this.screenActions = this.generalService.getScreenActions("Bills");
    this.localeProperties = this.settingsService.properties;
    let entityId: number = this.billProfileService.entityId;
    let pbilId: number = this.billProfileService.pbilId;
    // this.loadDisputeData(entityId, pbilId);
    this.subscription = this.billProfileService.onChange.subscribe((data) => {
      if (data === 'reloadTable') {
        this.disputeDetails = [];
        this.listFetched = false;
        entityId = this.billProfileService.entityId;
        pbilId = this.billProfileService.pbilId;
        this.loadDisputeData(entityId, pbilId);
        this.showTableAndFormComp = true;
      }
    });
    this.routerListener();
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && event['url'] &&
        event['url'] === '/Bills/BillViewer/CreateDispute/Create') {
        this.showTableAndFormComp = false;
      }
    });
  }


  private loadDisputeData(entityId: number, pbilId: number) {
    this.billProfileService.getDisputeList(entityId, pbilId).subscribe((disputeDetails: DisputeDetails[]) => {
      this.spinnerService.hide('billViewerSpinner');
      this.billProfileService.onChange.next('hideForm');
      this.disputeDetails = disputeDetails;
      this.selected = this.disputeDetails.map((p) => false);
      this.listFetched = true;
    });
  }

  private routerListener() {
    if (this.router.url === '/Bills/BillViewer/CreateDispute/Create') {
      this.showCompHeader = false;
    }
  }

  loadViewer() {
    this.router.navigate(['../../Bills/BillViewer']);
    this.spinnerService.show('billViewerSpinner');
    this.billProfileService.onChange.next('loadBillView');
  }

  loadDispute() {
    this.billDetails = this.billProfileService.disputeData;
  }

  loadDisputeFormData(data: DisputeDetails, idx: number) {
    if (data['statusDisplay'].toLowerCase() !== 'draft' || !this.screenActions['edit dispute']) {
      return;
    }
    this.selected = this.disputeDetails.map((p) => false);
    this.selected[idx] = true;
    this.billProfileService.disputeTableData = data;
    this.billProfileService.onChange.next('patchFormValues');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
