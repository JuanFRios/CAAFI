import {Injectable} from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable()
export class ExcelService {

  constructor() {
  }

  static toExportFileName(excelFileName: string): string {
    return `${excelFileName}_export_${new Date().getTime()}.xlsx`;
  }

  public exportAsExcelFile(json: any[], excelFileName: string, sheetName: string): void {
    const arr = new Array();
    arr.push(json);
    this.exportAsExcelFileMultipleSheets(arr, excelFileName, [sheetName]);
  }

  public exportAsExcelFileMultipleSheets(jsonArray: Array<any[]>, excelFileName: string, sheetNames: string[]): void {
    let worksheet: XLSX.WorkSheet;
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    let i = 0;
    for (const json of jsonArray) {
        worksheet = XLSX.utils.json_to_sheet(json);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetNames[i]);
        i++;
    }
    XLSX.writeFile(workbook, ExcelService.toExportFileName(excelFileName));
  }
}
