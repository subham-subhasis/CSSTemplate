import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  Renderer2,
  AfterViewInit,
  ViewChildren,
  QueryList
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { BillModel } from 'src/app/modules/dashboard/models/bill.model';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { BillProfileService } from 'src/app/modules/billscreen/services/bill-profile.service';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss']
})
export class BillListComponent implements OnInit, OnChanges, AfterViewInit {
  constructor(
    private generalService: GeneralService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private billProfileService: BillProfileService,
    private renderer: Renderer2
  ) { }
  toggle = true;
  routeParam = '';
  searchText = '';
  count = 0;
  @ViewChild('billProfiles', { static: false }) billListRef: ElementRef;
  @ViewChildren('billListTemplateRef') billListTemplateRef: QueryList<any>;
  // @ViewChild('billProfileName', {static: false}) billProfileName: ElementRef;

  @Output() panelEvent = new EventEmitter();
  @Output() billProfileNameEvent = new EventEmitter();
  @Input() billList: BillModel[];
  selectedBill = {};
  public config: PerfectScrollbarConfigInterface = {};
  ngOnInit() {
    this.routeParam = this.router.url.substring(1, this.router.url.length);
    this.openPanel();
  }


  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event) => {
      const width = document.getElementById('leftSidenav').style.width;
      if (width && width === '13rem') {
        document.getElementById('leftSidenav').style.width = '0';
      }
    });
  }
  ngOnChanges() {
    if (this.billList && this.billList.length > 0) {
      this.selectedBill = this.billList[0];
      this.generalService.setSelectedBillProfile(
        this.selectedBill['billProfileName']
      );
      if (this.generalService.billId.value === 0) {
        this.generalService.billId.next(this.selectedBill['pbipId']);
      }
    } else {
      this.hideDasboardWidgetsSpinners();
    }
  }

  hideDasboardWidgetsSpinners() {
    this.spinner.hide('cardSpinner');
    this.spinner.hide('billViewSpinner');
    this.spinner.hide('creditNoteSpinner');
    this.spinner.hide('disputeSpinner');
  }

  openPanel() {
    document.getElementById('panel_expand').style.width = '15rem';
    const panelEventObj = {};
    panelEventObj['event'] = 'open';
    panelEventObj['value'] = '13rem';
    this.panelEvent.emit(panelEventObj);
    this.generalService.toggleWidth.next('increaseWidth');
    if (document.getElementById('right_content')) {
      document.getElementById('right_content').style.marginLeft = '14rem';
    }
    this.billProfileService.onChangeBillsDisplayEvent.next('open');
  }

  closePanel() {
    document.getElementById('panel_expand').style.width = '0';
    const panelEventObj = {};
    panelEventObj['event'] = 'close';
    panelEventObj['value'] = '0';
    this.panelEvent.emit(panelEventObj);
    this.generalService.toggleWidth.next('decreaseWidth');
    if (document.getElementById('right_content')) {
      document.getElementById('right_content').style.marginLeft = '0';
    }
    this.billProfileService.onChangeBillsDisplayEvent.next('close');
  }

  applyActiveClassAndGenerateData(newValue: object) {
    this.showSpinners();
    // this.billProfileName.nativeElement.value =  newValue['billProfileName'];
    this.selectedBill = newValue;
    this.generalService.setSelectedBillProfile(newValue['billProfileName']);
    this.generalService.billId.next(newValue['pbipId']);
    this.billProfileNameEvent.emit(newValue);
  }

  private showSpinners() {
    setTimeout(() => {
      this.spinner.show('billViewSpinner');
      this.spinner.show('creditNoteSpinner');
      this.spinner.show('cardSpinner');
      this.spinner.show('disputeSpinner');
    });
  }

  moveDOWN(idx: number) {
    let bill: BillModel;
    if (idx === this.billList.length - 1 && idx !== 0) {
      return;
    } else {
      this.billListTemplateRef.toArray()[idx + 1].nativeElement.focus();
      bill = this.billList[idx + 1];
      // this.billProfileName.nativeElement.value =  bill['billProfileName'];
      this.selectedBill = bill;
    }
  }

  moveUP(idx: number) {
    if (idx === 0) {
      return;
    } else {
      let bill: BillModel;
      this.billListTemplateRef.toArray()[idx - 1].nativeElement.focus();
      bill = this.billList[idx - 1];
      // this.billProfileName.nativeElement.value =  bill['billProfileName'];
      this.selectedBill = bill;
    }
  }

  onEnter() {
    this.applyActiveClassAndGenerateData(this.selectedBill);
  }
}
