import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { toast } from "react-toastify";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const EmployeeGrid = forwardRef(({ setSelectedEmployee }, ref) => {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(); // ✅ Create ref for AgGridReact

  const getRowId = (params) => params.data.id;

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/employees`);


      const mappedData = res.data.map((emp) => ({
        id: emp.id,
        fullName: emp.fullname,
        email: emp.email,
        department: emp.department,
        position: emp.position,
        salary: emp.salary,
        hireDate: emp.hiredate,
      }));

      setRowData(() => [...mappedData]);
    } catch (err) {
      toast.error("Failed to load employees");
    }
  };

  useImperativeHandle(ref, () => ({
    fetchEmployees,
    api: gridRef.current.api, // ✅ Expose grid API to parent (App.jsx)
  }));

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this employee?"
      );
      if (!confirmDelete) return;

      await axios.delete(`cd ../employee-management-server/employees/${id}`);
      toast.success("Employee deleted");
      fetchEmployees();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const columnDefs = [
    {
      field: "fullName",
      headerName: "Full Name",
      sortable: true,
      filter: true,
    },
    { field: "email", sortable: true },
    { field: "department", sortable: true },
    { field: "position" },
    { field: "salary" },
    {
      field: "hireDate",
      headerName: "Hire Date",
      valueFormatter: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "",
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: (params) => (
        <div>
          <button onClick={() => setSelectedEmployee(params.data)}>Edit</button>
          <button onClick={() => handleDelete(params.data.id)}>Delete</button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <>
      <h2>Employee Directory</h2>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          ref={gridRef} // ✅ Attach internal ref
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          getRowId={getRowId}
        />
      </div>
    </>
  );
});

export default EmployeeGrid;
