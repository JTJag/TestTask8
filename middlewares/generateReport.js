const fs = require("fs");
const ExcelJS = require("exceljs");
const errors = require("../utils/errors");
const { error } = require("console");

function validate(entries) {
  const respJson = { errors: [] };
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (!Array.isArray(entry.data)) {
      respJson.status = "error";
      respJson.errors.push({
        error: "INVALID_JSON",
        msg: `body[${i}].data == ${entry.data}. Ожидался массив данных`,
      });
    } else {
      for (let j = 0; j < entry.data.length; j++) {
        const column = entry.data[j];
        if (typeof parseInt(column.count) != "number") {
          respJson.status = "error";
          respJson.errors.push({
            error: "INVALID_JSON",
            msg: `body[${i}].data[${j}].count == ${column.count}. Ожидалось число`,
          });
        }
        if (typeof column.column_name != "string") {
          respJson.status = "error";
          respJson.errors.push({
            error: "INVALID_JSON",
            msg: `body[${i}].data[${j}].column_name == ${column.column_name}. Ожидалась строка`,
          });
        }
      }
    }
    if (typeof entry.organization != "object") {
      respJson.status = "error";
      respJson.errors.push({
        error: "INVALID_JSON",
        msg: `body[${i}].organization == ${entry.organization}. Ожидался объект`,
      });
    } else {
      if (typeof entry.organization.id != "number") {
        respJson.status = "error";
        respJson.errors.push({
          error: "INVALID_JSON",
          msg: `body[${i}].organization.id == ${entry.organization.id}. Ожидалось число`,
        });
      }
      if (typeof entry.organization.short_name != "string") {
        respJson.status = "error";
        respJson.errors.push({
          error: "INVALID_JSON",
          msg: `body[${i}].organization.short_name == ${entry.organization.short_name}. Ожидалась строка`,
        });
      }
    }
  }
  return respJson;
}

function createWorkbook(entries) {
  try {
    const sheetHeaders = {};
    let maxcolumn = 2;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Данные");

    const headingRow = worksheet.getRow(2);

    //Записываем данные организаций
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const entryRow = worksheet.getRow(i + 3);
      //Название организации
      entryRow.getCell(1).value = entry.organization.short_name;
      for (const col of entry.data) {
        if (!sheetHeaders[col.column_name]) {
          //Проверяем есть ли столбец с таким текстом
          //Если такого столбца ещё нет, добавляем
          headingRow.getCell(maxcolumn).value = col.column_name;
          sheetHeaders[col.column_name] = maxcolumn++;
        }
        const colNum = sheetHeaders[col.column_name];
        entryRow.getCell(colNum).value = parseInt(col.count);
      }
    }

    // Стиль шапки
    {
      worksheet.getRow(1).height = 50;
      worksheet.getRow(2).height = 200;
      for (let i = 1; i < maxcolumn; i++) {
        for (let j = 1; j <= 2; j++) {
          const cell = worksheet.getRow(j).getCell(i);
          cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF3B5162" },
            bgColor: { argb: "FF3B5162" },
          };
          cell.font = { name: "Segoe UI", size: 9, color: { argb: "FFFFFFFF" } };
          cell.border = {
            top: { style: "thin", color: { argb: "FFFFFFFF" } },
            left: { style: "thin", color: { argb: "FFFFFFFF" } },
            bottom: { style: "thin", color: { argb: "FFFFFFFF" } },
            right: { style: "thin", color: { argb: "FFFFFFFF" } },
          };
        }
      }
    }
    // Стиль данных
    {
      for (let i = 1; i < maxcolumn; i++) {
        for (let j = 3; j <= entries.length + 3; j++) {
          const cell = worksheet.getRow(j); //.getCell(i);
          cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF1F2F3" },
            bgColor: { argb: "FFF1F2F3" },
          };
          cell.font = { name: "Segoe UI", size: 9, color: { argb: "FF212529" } };
          cell.border = {
            top: { style: "thin", color: { argb: "FF3B5162" } },
            left: { style: "thin", color: { argb: "FF3B5162" } },
            bottom: { style: "thin", color: { argb: "FF3B5162" } },
            right: { style: "thin", color: { argb: "FF3B5162" } },
          };
        }
      }
    }
    // Ячейка A1
    {
      worksheet.mergeCells("A1:A2");
      worksheet.getCell(1, 1).value = "Наименование ОО";
    }
    // Ячейка B1
    {
      worksheet.getCell(1, 2).value = "Из них";
      worksheet.mergeCells(1, 2, 1, maxcolumn - 1); //Соединяем ячейки шапки
    }
    // Стиль столбцов
    {
      //Ширина
      for (let i = 1; i < maxcolumn; i++) {
        worksheet.getColumn(i).width = 30;
      }
    }
    //Строка итого
    {
      const totalRow = worksheet.getRow(entries.length + 3);
      totalRow.font = { bold: true };
      totalRow.getCell(1).value = "ИТОГО";

      //Устанавливаем формулу для подсчета "итого"
      totalRow.getCell(2).value = { formula: `SUM(B3:B${entries.length + 2})` };
      //Растягиваем формулу до последнего столбца
      for (let i = 3; i < maxcolumn; i++) {
        const cell = totalRow.getCell(i);
        cell.value = { sharedFormula: `B${entries.length + 3}` };
      }
    }
    return workbook;
  } catch (e) {
    console.error(e);
    throw new Error("XLSX_CREATE_ERROR");
  }
}

function makeId() {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 7; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = async function (req, res) {
  try {
    const entries = req.body;

    //Валидация входных данных. Без фреймворков валидации :)
    const respJson = validate(entries);
    if (respJson.status == "error") return res.status(400).json(respJson);

    const workbook = createWorkbook(entries);

    //TODO Сделать разбивку по 10000 файлов на каталог
    const absReportPath = process.env.REPORT_FOLDER;
    const reportPath = /public(\/.+)/.exec(absReportPath)[1];

    if (!fs.existsSync(absReportPath)) {
      fs.mkdirSync(absReportPath);
    }

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let filename = `Ежедневный_${day}_${month}_${year}_${makeId()}.xlsx`;
    while (fs.existsSync(filename)) {
      filename = `Ежедневный_${day}_${month}_${year}_${makeId()}.xlsx`;
    }

    try {
      await workbook.xlsx.writeFile(absReportPath + "/" + filename);
    } catch (e) {
      console.error(e);
      return res.status(500).json(errors.WriteFileError);
    }

    return res.status(400).json({
      status: "success",
      data: {
        report: {
          url: reportPath + "/" + filename,
          name: filename,
        },
      },
    });
  } catch (e) {
    if (e.msg == "XLSX_CREATE_ERROR") {
      return res.status(500).json(errors.XLSXCreateError);
    }
    console.error(e);
    return res.status(500).json(errors.InternalServerError);
  }
};
