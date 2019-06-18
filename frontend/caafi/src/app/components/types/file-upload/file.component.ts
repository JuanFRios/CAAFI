import { Component, OnInit, OnDestroy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-formly-field-file',
  templateUrl: './file.component.html'
})
export class FormlyFieldFileComponent extends FieldType implements OnInit, OnDestroy {

  href: any = null;
  download: string = null;
  valueChangeObserver: Subscription = null;

  constructor(private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit() {
    this.valueChangeObserver = this.formControl.valueChanges.subscribe(() => {
      if (this.formControl != null && this.formControl.value != null) {
        if (this.formControl.value instanceof FileList) {
          const blob = this.formControl.value[0];
          const url = window.URL.createObjectURL(blob);
          this.href = this.sanitizer.bypassSecurityTrustUrl(url);
          this.download = this.formControl.value[0].name;
        } else {
          this.href = this.formControl.value;
        }
      } else {
        this.href = null;
      }
    });
  }

  ngOnDestroy() {
    if (this.valueChangeObserver != null) {
      this.valueChangeObserver.unsubscribe();
    }
    window.URL.revokeObjectURL(this.href);
  }
}
