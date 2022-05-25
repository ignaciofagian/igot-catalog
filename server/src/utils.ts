import * as excelToJson from "convert-excel-to-json";
import * as path from "path";
import ctrlAttribute from "./controllers/attribute";

export class Result {
  status: 200 | 400;
  description?: string;

  constructor(status: 200 | 400, description?: string) {
    this.status = status;
    this.description = description;
  }
}

export async function loadFromExcel(fileName: string) {
  const data = excelToJson({
    sourceFile: path.join(__dirname, fileName),
    header: {
      rows: 1,
    },
    sheets: [
      {
        name: "Hoja1",
        columnToKey: {
          A: "description",
          D: "name",
        },
      },
      {
        name: "Hoja2",
        columnToKey: {
          A: "name",
          B: "abbreviature",
        },
      },
    ],
  });

  for (const row of data["Hoja2"]) {
    const result = await ctrlAttribute.addAbbreviature(row);
    console.log(`${row.name} -> ${result.status} ${result.description}`);
  }

  for (const row of data["Hoja1"]) {
    const result = await ctrlAttribute.addAttribute(row);
    console.log(`${row.name} -> ${result.status} ${result.description}`);
  }
}
