import { DataGrid } from "@mui/x-data-grid";

import { columns } from "./columns";
import switchBaseClasses from "@mui/material/internal/switchBaseClasses";

export const DataTable = ({ rows, statusFilter }) => {
  let newRows=[];
  if (statusFilter==="total") {
    newRows = rows
  }

  if (statusFilter==="active") {
    newRows = rows.filter((el)=>{
      return el.statusId==="Активна"
    });
  }

  if (statusFilter==="pause") {
    newRows = rows.filter((el)=>{
      return el.statusId==="Приостановлено"
    });
  }

  if (statusFilter==="archive") {
    newRows = rows.filter((el)=>{
      return el.statusId==="Показы завершены"
    });
  }
  console.log(newRows)
  return (
      <DataGrid
          style={{ minHeight: 590, width: "100%" }}
          getRowId={(newRows) => newRows.Id}
          rows={newRows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 50, 100, 300]}
          checkboxSelection
      />
  )
}


