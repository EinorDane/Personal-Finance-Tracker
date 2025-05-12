import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [editTransactionId, setEditTransactionId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch transactions & categories on load
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/transactions')
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error('Error fetching transactions:', err));
    axios
      .get('http://localhost:8080/api/categories')
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Add Transaction
  const addTransaction = () => {
    axios
      .post('http://localhost:8080/api/transactions', {
        description,
        amount: parseFloat(amount),
        category,
        date,
      })
      .then((res) => {
        setTransactions([...transactions, res.data]);
        resetForm();
      })
      .catch(() => alert('Error adding transaction'));
  };

  // Delete Transaction
  const deleteTransaction = (id) => {
    axios
      .delete(`http://localhost:8080/api/transactions/${id}`)
      .then(() => setTransactions(transactions.filter((t) => t.id !== id)))
      .catch(() => alert('Error deleting'));
  };

  // Prepare for editing
  const handleEdit = (t) => {
    setDescription(t.description);
    setAmount(t.amount);
    setCategory(t.category);
    setDate(t.date);
    setEditTransactionId(t.id);
  };

  // Save update
  const updateTransaction = () => {
    axios
      .put(`http://localhost:8080/api/transactions/${editTransactionId}`, {
        description,
        amount: parseFloat(amount),
        category,
        date,
      })
      .then((res) => {
        setTransactions(
          transactions.map((t) => (t.id === editTransactionId ? res.data : t))
        );
        resetForm();
      })
      .catch(() => alert('Error updating'));
  };

  // Reset form fields
  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setDate('');
    setEditTransactionId(null);
  };

  // Filter transactions based on category
  const filteredTransactions = transactions.filter(
    (t) => !selectedCategory || t.category === selectedCategory
  );

  return (
    <div className="container py-5">
      {/* Header */}
      <h1 className="mb-4 text-center">Your Transactions</h1>

      {/* Category filter */}
      <div className="mb-3">
        <select
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Transactions List */}
      <ul
        className="list-group mb-4"
        style={{ maxHeight: '300px', overflowY: 'auto' }}
      >
        {filteredTransactions.map((t) => (
          <li
            key={t.id}
            className="list-group-item d-flex justify-content-between align-items-center mb-2 transition-all"
          >
            <div>
              <strong>{t.description}</strong> - ${t.amount} [{t.category}] {t.date}
            </div>
            <div>
              <button
                className="btn btn-sm btn-danger me-2"
                onClick={() => deleteTransaction(t.id)}
              >
                Delete
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => handleEdit(t)}
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Transaction Form */}
      <div className="card p-4 shadow-sm rounded-3">
        <h2 className="mb-3">{editTransactionId ? 'Edit' : 'Add'} Transaction</h2>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
          <option key={c.id} value={c.name}>{c.name}</option>
        ))}
      </select>
    </div>
    <div className="mb-3">
      <input
        className="form-control"
        placeholder="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
    </div>
    <div className="d-flex">
      <button
        className="btn btn-primary me-2"
        onClick={updateTransaction}
      >
        {editTransactionId ? 'Update' : 'Add'}
      </button>
      {editTransactionId && (
        <button className="btn btn-secondary" onClick={resetForm}>
          Cancel
        </button>
      )}
    </div>
  </div>
</div>
);
}
export default Dashboard;