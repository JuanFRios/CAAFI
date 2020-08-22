import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormularioService } from '../service/formulario.service';
import { Formulario } from '../model/template/formulario/formulario';
import { TableConfig } from '../model/resource/table/table-config'

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {

  public formulario: Formulario;
  public tableConfig: TableConfig;
  public loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private formularioService: FormularioService
  ) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const template: string = params.get('formulario');
      this.formularioService.findById(template).subscribe(formulario => {
        this.formulario = formulario;
        this.tableConfig = {
          template,
          dependencia: params.get('dependencia'),
          tableId: formulario.tabla.id,
          createFormId: formulario.formulario.id,
          updateFormId: formulario.formulario.id
        };
        this.loading = true;
      });
    });
  }
}
