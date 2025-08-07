import React, { useState, useRef, useEffect  } from "react";
import EmployeeForm from "./components/EmployeeForm";
import EmployeeGrid from "./components/EmployeeGrid";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const gridRef = useRef();
  const [searchText, setSearchText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
    
  // ⬛ Add/remove dark mode class to body
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);
  const handleSave = async (employee) => {
    try {
      if (employee.id) {
        await axios.put(`${process.env.REACT_APP_API_URL}/employees/${employee.id}`, employee);
        toast.success("Employee updated");
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/employees`, employee);
        toast.success("Employee created");
      }

      if (gridRef.current && gridRef.current.fetchEmployees) {
        gridRef.current.fetchEmployees();
      }

      setSelectedEmployee(null);
    } catch (err) {
    // 🛑 Show proper toast for duplicate email
    if (err.response?.status === 400 && err.response.data?.error) {
      toast.error(err.response.data.error);
    } else {
      toast.error("Failed to save employee");
    }
  }
  };

  // 🔍 Filter handler for external input
const handleFilterChange = (e) => {
  const value = e.target.value;
  setSearchText(value);

  if (gridRef.current && gridRef.current.api) {
    gridRef.current.api.setQuickFilter(value);
  }
};


  return (
    <div className="app-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

       {/* 🌓 Toggle Dark Mode Button */}
      <button
        className="dark-toggle-btn"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="form-section">
        <EmployeeForm
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          onSave={handleSave}
        />
      </div>

      <div className="grid-section">
        {/* 🔍 External filter input */}
        <input
          type="text"
          placeholder="Search across all columns..."

          value={searchText}
          onChange={handleFilterChange}
          style={{
            marginBottom: "10px",
            padding: "8px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />

        <EmployeeGrid
          ref={gridRef}
          setSelectedEmployee={setSelectedEmployee}
        />
      </div>
    </div>
  );
}

export default App;
