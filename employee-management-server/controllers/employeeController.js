import db from '../db.js';

export const getEmployees = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM employees ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addEmployee = async (req, res) => {
  const { fullName, email, department, position, salary, hireDate } = req.body;
  try {
    await db.query(
      `INSERT INTO employees (fullName, email, department, position, salary, hireDate)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [fullName, email, department, position, salary, hireDate]
    );
    res.status(201).send("Employee created");
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email must be unique' });
    }
    res.status(500).json({ error: err.message });
  }
};


export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, department, position, salary, hireDate } = req.body;
  try {
    await db.query(
      `UPDATE employees SET fullName=$1, email=$2, department=$3, position=$4, salary=$5, hireDate=$6 WHERE id=$7`,
      [fullName, email, department, position, salary, hireDate, id]
    );
    res.send("Employee updated");
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email must be unique' });
    }
    res.status(500).json({ error: err.message });
  }
};


export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM employees WHERE id=$1', [id]);
    res.send("Employee deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
