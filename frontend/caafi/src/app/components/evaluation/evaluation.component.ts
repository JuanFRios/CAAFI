import { Component, OnInit } from '@angular/core';
import { Dependency } from '../../common/dependency';

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

  constructor() { }

  ngOnInit() {}

  onSelectMenuItem($event) {
    if ($event.dependencyId != null) {
      const dependency = new Dependency($event.dependencyId, null);
      dependency['evaluationDoc'] = $event.evaluationDoc;
      this.load(dependency);
    }
  }

  load(dependency: Dependency) {
    this.activeDependency = dependency;
  }

}
