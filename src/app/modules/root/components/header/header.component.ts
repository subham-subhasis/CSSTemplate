import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import { AppUtils } from 'src/app/utils/app.util';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { RootService } from '../../services/root-service.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges, AfterViewInit {

  userName: string;
  greetings: string;
  showLogout = false;
  @Input() headerProperties: any;
  isExternal = false;
  confirmDialog = false;
  selectedImage = {};
  showDropdown = true;
  @ViewChild('headerPanel', { static: false }) headerPanel: ElementRef;
  @ViewChild('logoutDiv', { static: false }) logoutDiv: ElementRef;
  constructor(private appUtil: AppUtils, private gs: GeneralService, private settingService: SettingsService,
    private translate: TranslateService, private renderer: Renderer2, private router: Router, private activatedRoute: ActivatedRoute, private rootService: RootService) {
    }

  ngOnChanges() {
    if (this.headerProperties['rocFlowItemList'] && this.headerProperties['rocFlowItemList'].length > 0) {
      // this.selectedImage = this.headerProperties['rocFlowItemList'][0];
      this.selectedImage = {};
    }
    this.userName = this.headerProperties['userName'];
    this.isExternal = this.gs.isExternal();
  }
  ngOnInit() {
    this.loadGreetings();
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url && event.url.toLowerCase().includes('dashboard')) {
          this.selectedImage = {};
        } else {
          if (this.headerProperties['rocFlowItemList'] && this.headerProperties['rocFlowItemList'].length > 0) {
            for (const item of this.headerProperties['rocFlowItemList']) {
              const tab = item['screenName'] ? item['screenName'].toLowerCase().replace(/ +/g, '') : '';
              if (event.url.toLowerCase().replace(/ +/g, '').includes(tab)) {
                this.selectedImage = item;
                break;
              }
            }
          }
        }
      }
    });

    this.rootService.onMenuClick.subscribe(data => {
      this.showLogout = data;
    });
  }

  ngAfterViewInit() {
    this.gs.headerPanel = this.headerPanel;
    this.renderer.listen('document', 'click', (event) => {
      if (this.logoutDiv && this.logoutDiv.nativeElement) {
        this.showLogout = false;
      }

      const rightArrow = document.getElementById('rightArrow');
      if (rightArrow) {
        rightArrow.style.transform = 'rotate(360deg)';
      }
    });
  }

  loadGreetings() {
    const myDate = new Date();
    const hrs = myDate.getHours();
    if (hrs < 12) {
      this.translate.get('GREETING.MORNING').subscribe((value) => {
        this.greetings = value;
      });
    } else if (hrs >= 12 && hrs <= 17) {
      this.translate.get('GREETING.AFTERNOON').subscribe((value) => {
        this.greetings = value;
      });
    } else if (hrs >= 17 && hrs <= 24) {
      this.translate.get('GREETING.EVENING').subscribe((value) => {
        this.greetings = value;
      });
    }
  }

  addActiveClass(event: MouseEvent, image: object) {
    this.selectedImage = image;
  }

  navigate() {
    const url = this.redirect('switch');
    location.href = url;
  }

  private redirect(param: string) {
    let url = '';
    if (!environment.production) {
      param === 'switch' ? url = 'http://10.113.116.113:8080/partnerportalv3/sparkLogin.jsp' :
        url = 'http://10.113.116.113:8080/partnerportalv3/sparkLogout.html';
    } else {
      const href: string = location.href;
      const protocol = this.settingService.applicationProperties['protocol'];
      const path = this.appUtil.generateDynamicUrl(href);
      if (param === 'switch') {
        const host = location.host;
        url = `${protocol}://${host}/${path}`;
      } else if (param === 'logout') {
        const host = location.host;
        url = `${protocol}://${host}/${path}/sparkLogout.html`;
      }
    }
    return url;
  }

  logout() {
    this.confirmDialog = true;
  }

  onPersonalSettingsClick() {
    this.showDropdown = !this.showDropdown;
    this.router.navigate(['PersonalSettings']);
  }

  changePassword() {
    this.showDropdown = !this.showDropdown;
    this.router.navigate(['ChangePassword']);
  }
  toggleLogout(event: MouseEvent) {
    event.stopPropagation();
    if (this.showLogout) {
      this.showLogout = false;
    } else {
      this.showLogout = true;
    }
  }

  onModalClick(event: any) {
    if (event === 'close') {
      this.confirmDialog = false;
    } else if (event === 'logout') {
      const url = this.redirect('logout');
      location.assign(url);
    }
  }

  navigateToRoute(image: object) {
    if (image) {
      const subTab = image['screenName'] ? image['screenName'].replace(/ +/g, '') : '';
      switch (subTab) {
        case 'Bills': {
          const url = `${subTab}`;
          this.router.navigate([url + '/BillViewer']);
          break;
        }
        case 'CreditNotes': {
          const url = `${subTab}`;
          this.router.navigate([url]);
          break;
        }
      }
    }
  }
  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.rootService.onMenuClick.unsubscribe();
  }
}
