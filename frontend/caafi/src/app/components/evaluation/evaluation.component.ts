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
  activeDependency: Dependency;
  errorMessage: string[] = [];
  sub: any;
  loading: false;

  constructor(
    private configService: ConfigService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.loadConfig();
    });
  }

  loadConfig() {
    this.configService.getTemplateConfig('dependencias')
      .subscribe(form => {
        this.dependencies = form.value;
      },
        error => this.errorMessage.push(error));
  }

  load(dependency: Dependency) {
    this.activeDependency = dependency;
  }

  onLoad() {
    console.log('loaded');
  }

}
