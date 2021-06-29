import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GeneralService } from '../../../dashboard/services/general.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { AppUtils } from '../../../../utils/app.util';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SettingsService } from 'src/app/services/settings.service';
import { ApiConfigService } from 'src/app/config.service';
@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  labelList = [];
  clonedLabelMap = {};
  labelMap = {};
  iframeUrl: any;
  @ViewChild('labelSerach', { static: true }) labelSerach: ElementRef;
  constructor(private settingService: SettingsService, private generalService: GeneralService, private sanitizer: DomSanitizer, private appUtils: AppUtils) { }

  ngOnInit() {
    this.labelList = this.generalService.toolBarArray;
   // this.labelList = data['toolbarList'];
    if (this.labelList && this.labelList.length) {
      this.labelList.forEach(l1Level => {
        if (!this.labelMap[l1Level.toolBarName]) {
          this.labelMap[l1Level.toolBarName] = <any>{};
          if (l1Level.toolBarItems && l1Level.toolBarItems.length > 1) {
            this.labelMap[l1Level.toolBarName].isExpand = false;
            this.labelMap[l1Level.toolBarName].L2Keys = l1Level.toolBarItems.map((item: any) => {
              return item.toolBarItemName;
            });
          } else {
            this.labelMap[l1Level.toolBarName].isExpand = false;
            this.labelMap[l1Level.toolBarName].L2Keys = [];
          }
        }
      });
    }
    this.clonedLabelMap = { ...this.labelMap };
    this.onLinkClick('Dashboard', 'L1level');

  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.labelSerach && this.labelSerach.nativeElement) {
      const $Obs = fromEvent(this.labelSerach.nativeElement, 'input').pipe(
        map((event: any) => event.target.value),
        debounceTime(100),
        distinctUntilChanged(),
      );
      $Obs.subscribe((searchString) => {
        this.search(searchString);
      });
    }
  }
  getKeys(obj: any) {
    return Object.keys(obj);
  }

  search(searchKey: string) {
    const filteredlabelMap = {};
    if (!this.labelMap) {
      return {};
    }
    if (!searchKey) {
      this.labelMap = { ...this.clonedLabelMap };
      return this.labelMap;
    }
    searchKey = searchKey.toLowerCase();
    const _this = this;
    // tslint:disable-next-line: prefer-const
    let addlabel = function (l1Code: string, l2Code?: string) {
      if (l1Code && !filteredlabelMap[l1Code]) {
        filteredlabelMap[l1Code] = <any>{};
        filteredlabelMap[l1Code].L2Keys = [];
        if (l2Code) { filteredlabelMap[l1Code].L2Keys.push(l2Code); }
      } else if (l1Code && filteredlabelMap[l1Code]) {
        filteredlabelMap[l1Code].L2Keys.push(l2Code);
      }
    };
    // tslint:disable-next-line: forin
    for (const l1Key in this.labelMap) {
      const l1Obj = this.labelMap[l1Key];
      if (l1Obj.L2Keys && l1Obj.L2Keys.length) {
        l1Obj.L2Keys.forEach(l2Key => {
          if (l2Key.toLowerCase().includes(searchKey)) {
            addlabel(l1Key, l2Key);
            filteredlabelMap[l1Key].isExpand = true;
          }
        });
      }
      if (!filteredlabelMap[l1Key]) {
        if (l1Key.toLowerCase().includes(searchKey)) {
          addlabel(l1Key);
        }
      }
    }
    this.labelMap = { ...filteredlabelMap };
  }

  onLinkClick(levelData: any, level: string, event?: MouseEvent) {
    if (level === 'L1level') {
      // tslint:disable-next-line: forin
      for (const key in this.labelMap) {
        const l1Data = this.labelMap[key];
        l1Data['isExpand'] = false;
      }
      if (levelData && this.labelMap[levelData] && this.labelMap[levelData].L2Keys && this.labelMap[levelData].L2Keys.length) {
        this.labelMap[levelData]['isExpand'] = true;
        const filePath = `${this.labelMap[levelData].L2Keys[0].replace(/ +/g, '')}`;
        this.iframeUrl = this.getiFrameUrl(filePath);
      } else {
        const filePath = `${levelData.replace(/ +/g, '')}`;
        this.iframeUrl = this.getiFrameUrl(filePath);
      }
    } else if (level === 'L2level') {
      event.stopPropagation();
      const filePath = `${levelData.replace(/ +/g, '')}`;
      this.iframeUrl = this.getiFrameUrl(filePath);
    }

  }

  getiFrameUrl(filePath: string) {
    let url = '';
    const localeid = 'en_GB_csh';
    if (!environment.production) {
      url = `http://10.113.116.113:8080/rocpartnerportal/PartnerPortalClient/help/${localeid}/${filePath}.htm?userName=Administrator&password=welcome1`;
    } else {
      const href: string = window.location.href;
      const path = this.appUtils.generateDynamicUrl(href);
      const protocol = this.settingService.applicationProperties['protocol'];
      const host = window.location.host;
      url = `${protocol}://${host}/${path}/${ApiConfigService.authProperties['partnerPortalHelpDocPath']}/help/${localeid}/${filePath}.htm`;
    }
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return safeUrl;
  }

}
