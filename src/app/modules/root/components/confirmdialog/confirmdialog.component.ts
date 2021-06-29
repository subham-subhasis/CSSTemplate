import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.scss']
})
export class ConfirmdialogComponent implements OnInit {

  @Output() fireModalEvent = new EventEmitter();
  constructor() { }

  ngOnInit() {}

  fireEvent(parameter: string) {
    if (parameter === 'close') {
      this.fireModalEvent.emit('close');
    } else if (parameter === 'logout') {
      this.fireModalEvent.emit('logout');
    }
  }

}
