import { OnInit, Component } from '@angular/core';
import { ModelDataSource } from './model-data-source';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

  dataSource: ModelDataSource;

  constructor(
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataSource = new ModelDataSource(this.dataService);
  }

}
