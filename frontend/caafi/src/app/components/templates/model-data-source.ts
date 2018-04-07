import { Output,EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/of';
import { Data } from '../../common/data';
import { MatPaginator } from '@angular/material';
/**
* Fuente de datos para proporcionar qué datos se deben presentar en la tabla. El observable proporcionado
* en connect debe emitir exactamente los datos que debe generar la tabla. Si los datos son
* alterados, el observable debe emitir ese nuevo conjunto de datos en la secuencia.
*/
export class ModelDataSource extends DataSource<any> {

    _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    _size: number;
    @Output() _dataEmisorSize: EventEmitter<number> = new EventEmitter();

    getDataSize():any {
      return this._dataEmisorSize;
    }
    ChangeDataSize(size : number){
      this._dataEmisorSize.emit(size);
    }


   constructor(private _data_list: Data[],
     private _paginator: MatPaginator) {
       super();
   }

   /** Esta función es llamada por el data table para obtener lo que será renderizado */
   connect(): Observable<Data[]> {
     const displayDataChanges = [
           this._data_list,
           this._filterChange,
           this._paginator.page
       ];

       return Observable.merge(...displayDataChanges).map(() => {

       // filtors
       const filtered_list = this._data_list.slice().filter((item: Data) => {
         let searchInput = (item.template).toLowerCase();
         return searchInput.indexOf(this.filter.toLowerCase()) != -1;
       });
       // Obtenemos el tamaño de la lista filtrada
       this._size = filtered_list.length;
       this.ChangeDataSize( this._size );

       const data = filtered_list.slice();

       // Se toma la porción de datos de la página.
       const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
       return data.splice(startIndex, this._paginator.pageSize);
      });

   }

   disconnect() { }
}
