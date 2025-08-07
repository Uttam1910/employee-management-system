import React, { useState, useEffect } from "react";

const departments = ["HR", "Engineering", "Marketing", "Sales"];

const defaultForm = {
  fullName: "",
  email: "",
  department: "",
  position: "",
  salary: "",
  hireDate: "",
};

const EmployeeForm = ({
  selectedEmployee,
  setSelectedEmployee,
  onSave, // ✅ Get the handler from App
}) => {
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (selectedEmployee) {
      setFormData(selectedEmployee);
    }
  }, [selectedEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setSelectedEmployee(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 👇 Send data to App's handleSave function
    await onSave({ ...formData, id: selectedEmployee?.id });

    resetForm(); // Clear form after saving
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{selectedEmployee ? "Edit Employee" : "Add New Employee"}</h2>

      <label>Full Name *</label>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
      />

      <label>Email Address *</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <label>Department *</label>
      <select
        name="department"
        value={formData.department}
        onChange={handleChange}
        required
      >
        <option value="">Select department</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <label>Position *</label>
      <input
        type="text"
        name="position"
        value={formData.position}
        onChange={handleChange}
        required
      />

      <label>Annual Salary *</label>
      <input
        type="number"
        name="salary"
        value={formData.salary}
        onChange={handleChange}
        min="0"
        required
      />

      <label>Hire Date *</label>
      <input
        type="date"
        name="hireDate"
        value={formData.hireDate}
        onChange={handleChange}
        required
      />

      <div className="button-group">
        <button type="submit" className="btn-primary">
          {selectedEmployee ? "Update Employee" : "Create Employee"}
        </button>
        <button type="button" onClick={resetForm}>
          Reset
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
