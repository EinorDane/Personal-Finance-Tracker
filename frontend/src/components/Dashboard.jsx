// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [editTransactionId, setEditTransactionId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch data when component loads
  useEffect(() => {
    api.get('/api/transactions')
      .then(res => setTransactions(res.data))
      .catch(err => console.error('Error fetching transactions:', err));
    api.get('/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setDate('');
    setEditTransactionId(null);
  };

  const addTransaction = async () => {
    try {
      const res = await api.post('/api/transactions', {
        description,
        amount: parseFloat(amount),
        category,
        date,
      });
      setTransactions([...transactions, res.data]);
      resetForm();
    } catch {
      alert('Error adding transaction');
    }
  };

  const updateTransaction = async () => {
    try {
      const res = await api.put(`/api/transactions/${editTransactionId}`, {
        description,
        amount: parseFloat(amount),
        category,
        date,
      });
      setTransactions(transactions.map(t => (t.id === editTransactionId ? res.data : t)));
      resetForm();
    } catch {
      alert('Error updating transaction');
    }
  };

  const deleteTransaction = (id) => {
    api.delete(`/api/transactions/${id}`)
      .then(() => {
        setTransactions(transactions.filter(t => t.id !== id));
      })
      .catch(() => alert('Error deleting'));
  };

  const handleEdit = (t) => {
    setDescription(t.description);
    setAmount(t.amount);
    setCategory(t.category);
    setDate(t.date);
    setEditTransactionId(t.id);
  };

  const filteredTransactions = transactions.filter(t => !selectedCategory || t.category === selectedCategory);

  return (
    <div className="container py-4">
      {/* Transaction list and CRUD */}
      <h2>Transactions</h2>
      <ul>
        {filteredTransactions.map(t => (
          <li key={t.id} className="mb-2 p-2 border rounded d-flex justify-content-between align-items-center">
            {t.description} (${t.amount}) [{t.category}] {t.date}
            <div>
              <button className="btn btn-sm btn-danger me-2" onClick={() => deleteTransaction(t.id)}>Delete</button>
              <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(t)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add/Edit Transaction form */}
      <h3 className="mt-4">{editTransactionId ? 'Edit' : 'Add'} Transaction</h3>
      <div className="mb-3">
        <input
          placeholder="Description"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          placeholder="Amount"
          type="number"
          className="form-control"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <select
          className="form-select"
          value={category}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <input
          placeholder="Date"
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={editTransactionId ? updateTransaction : addTransaction}>
          {editTransactionId ? 'Update' : 'Add'}
        </button>
        {editTransactionId && (
          <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
        )}
      </div>
    </div>
  );
}

export default Dashboard;