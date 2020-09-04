import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'app-base-wrapper',
  templateUrl: './base-wrapper.component.html',
  styleUrls: ['./base-wrapper.component.scss']
})
export class BaseWrapperComponent extends FieldWrapper implements OnInit {

  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;

  constructor() {
    super();
  }

  ngOnInit(): void {}

}
