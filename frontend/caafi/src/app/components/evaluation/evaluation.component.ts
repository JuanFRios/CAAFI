import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { Dependency } from '../../common/dependency';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  dependencies: Dependency[];
  errorMessage: string[] = [];
  sub: any;

  constructor(
    private configService: ConfigService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.loadConfig();
    });

    console.log(this.dependencies);
  }

  loadConfig() {
    this.configService.getTemplateConfig('dependencias')
      .subscribe(form => {
        this.dependencies = form.value;
      },
        error => this.errorMessage.push(error));
  }

}
