import { OnInit, Component, OnDestroy, ViewChild, ViewContainerRef, Input } from '@angular/core';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit, OnDestroy {

  @Input() name: string;
  @Input() formId: string;
  @Input() dependencyId: string;
  @Input() dependencyName: string;
  @Input() allDataAccess = false;
  @Input() activeActions = true;
  @Input() export = false;
  @ViewChild('vc', {read: ViewContainerRef}) viewContainerRef: ViewContainerRef;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

}
