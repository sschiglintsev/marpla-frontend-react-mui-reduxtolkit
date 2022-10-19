import { DataGrid } from "@mui/x-data-grid";

import { columns } from "./columns";
import switchBaseClasses from "@mui/material/internal/switchBaseClasses";
import {filterRows} from "../../utils";

export const DataTable = ({ rows, statusFilter }) => {
    const newRows = filterRows(rows,statusFilter);
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


