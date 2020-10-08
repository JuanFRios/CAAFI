package co.edu.udea.caafi.utils;

import co.edu.udea.caafi.model.resource.table.TableColumn;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class ExcelHelper {
  public static String TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  static String[] HEADERs = { "Id", "Title", "Description", "Published" };

  public static ByteArrayInputStream objectsToExcel(String title, List<TableColumn> columns, List<Object> objects) {

    try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream();) {
      Sheet sheet = workbook.createSheet(title);

      int rowIndex = 0;
      // Header
      Row headerRow = sheet.createRow(rowIndex);

      // COLUMNAS
      int columnIndex = 0;
      for (TableColumn column: columns) {
        if ("repeat".equals(column.getType())) {
          CellRangeAddress cellAddresses = new CellRangeAddress(rowIndex, rowIndex, columnIndex,
              columnIndex + (column.getSubColumns().size() - 1));
          sheet.addMergedRegion(cellAddresses);
          Row subHeadeRow = sheet.createRow(++rowIndex);
          int subColumnIndex = columnIndex;
          for (TableColumn subColumn: column.getSubColumns()) {
            Cell cell = subHeadeRow.createCell(subColumnIndex);
            cell.setCellValue(subColumn.getHeader());
            subColumnIndex++;
          }
        }

        Cell cell = headerRow.createCell(columnIndex);
        cell.setCellValue(column.getHeader());
        columnIndex++;
      }

      /*
      int rowIdx = 1;
      for (Object object : objects) {
        Row row = sheet.createRow(rowIdx++);

        row.createCell(0).setCellValue("1");
        row.createCell(1).setCellValue("2");
        row.createCell(2).setCellValue("3");
        row.createCell(3).setCellValue("4");
      }
       */

      workbook.write(out);
      return new ByteArrayInputStream(out.toByteArray());
    } catch (IOException e) {
      throw new RuntimeException("fail to import data to Excel file: " + e.getMessage());
    }
  }
}
