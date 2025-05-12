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

  const addTransaction = () => {
    api.post('/api/transactions', {
      description,
      amount: parseFloat(amount),
      category,
      date,
    })
    .then(res => {
      setTransactions([...transactions, res.data]);
      resetForm();
    })
    .catch(() => alert('Error adding transaction'));
  };

  const updateTransaction = () => {
    api.put(`/api/transactions/${editTransactionId}`, {
      description,
      amount: parseFloat(amount),
      category,
      date,
    })
    .then(res => {
      setTransactions(
        transactions.map(t => (t.id === editTransactionId ? res.data : t))
      );
      resetForm();
    })
    .catch(() => alert('Error updating'));
  };

  const deleteTransaction = (id) => {
    api.delete(`/api/transactions/${id}`)
      .then(() => {
        setTransactions(transactions.filter(t => t.id !== id));
      })
      .catch(() => alert('Error deleting'));
  };

  // Minimal UI for demonstration
  return (
    <div className="container mt-4">
      <h2>Transactions</h2>
      <ul>
        {transactions.map(t => (
          <li key={t.id}>
            {t.description} - {t.amount} - {t.category} - {t.date}
            <button onClick={() => {
              setEditTransactionId(t.id);
              setDescription(t.description);
              setAmount(t.amount);
              setCategory(t.category);
              setDate(t.date);
            }}>Edit</button>
            <button onClick={() => deleteTransaction(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <h3>{editTransactionId ? 'Edit' : 'Add'} Transaction</h3>
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input placeholder="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
      </select>
      <input placeholder="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
      <button onClick={editTransactionId ? updateTransaction : addTransaction}>
        {editTransactionId ? 'Update' : 'Add'}
      </button>
      <button onClick={resetForm}>Clear</button>
    </div>
  );
}

export default Dashboard;