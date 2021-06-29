import { Component, Input, OnChanges, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralService } from 'src/app/modules/dashboard/services/general.service';
import { Router } from '@angular/router';
import { RootService } from '../../services/root-service.service';
import { ToolBar } from '../../models/toolbar.model';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() images: ToolBar[];
  @ViewChild('rightArrow', { static: false }) rightArrow: ElementRef;
  selectedImage = {};
  showSubMenus = false;
  constructor(private gService: GeneralService,
    private router: Router, private renderer: Renderer2, private rootService: RootService) { }

  ngOnInit() { }

  ngOnChanges() {
    if (this.images.length > 0) {
      this.selectedImage = this.images[0];
    }
  }

  ngAfterViewInit() {
    this.renderer.listen('document', 'click', (event) => {
      this.showSubMenus = false;
    });
  }

  showSubMenu(image: object[], event: MouseEvent) {
    event.stopPropagation();
    const rightArrow = this.rightArrow.nativeElement;
    if (!this.showSubMenus && image['toolBarItems'].length > 0) {
      if (rightArrow) {
        this.rightArrow.nativeElement.style.transform = 'rotate(90deg)';
      }
      this.showSubMenus = true;
    } else {
      if (rightArrow) {
        this.rightArrow.nativeElement.style.transform = 'rotate(360deg)';
      }
      this.showSubMenus = false;
    }
  }

  openNav(event: MouseEvent) {
    this.rootService.onMenuClick.next(false);
    event.stopPropagation();
    document.getElementById('leftSidenav').style.width = '13rem';
    const el = document.getElementById('leftSidenav').firstChild;
    this.renderer.setStyle(el, 'justify-content', 'flex-end');
    this.renderer.setStyle(el, 'cursor', 'pointer');
  }

  closeNav() {
    document.getElementById('leftSidenav').style.width = '0';
  }

  addActiveClass(image: object) {
    this.selectedImage = image;
  }

  showWidgetSpinner(mevent: MouseEvent, image: object) {
    this.addActiveClass(image);
    mevent.stopPropagation();
    this.router.events.subscribe((event: any) => {
      if (event) {
        this.gService.spinnerToggle.next('showWidgetSpinner');
      }
    });
    this.closeNav();
  }

  onSubDirectoryClick(subImage: object) {
    // this.closeNav()
    if (subImage) {
      const subTab = subImage['toolBarItemName'] ? subImage['toolBarItemName'].replace(/ +/g, '').toLowerCase() : '';
      switch (subTab) {
        case 'bills': {
          const url = `${subImage['toolBarItemName']}/BillViewer`;
          this.router.navigate([url]);
          break;
        }
        default: {
          const url = `${subImage['toolBarItemName'].replace(/ +/g, '')}`;
          this.router.navigate([url]);
          break;
        }
      }
    }
  }
  onDirectoryClick(image: any, event: MouseEvent) {
    if (image) {
      this.addActiveClass(image);
      if (image.toolBarItems && image.toolBarItems.length > 1) {
        this.showSubMenu(image, event);
      } else {
        this.showWidgetSpinner(event, image);
        const url = image.toolBarName ? image.toolBarName.replace(/ +/g, '') : '';
        this.router.navigate([url]);
      }
    }
  }
}
