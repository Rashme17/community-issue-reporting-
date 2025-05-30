import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Community Reporter</h1>
      <div>
        <Link to="/" className="mx-2">Home</Link>
        <Link to="/report" className="mx-2">Report Issue</Link>
        <Link to="/dashboard" className="mx-2">Dashboard</Link>
        <Link to="/login" className="mx-2">Login</Link>
        <Link to="/register" className="mx-2">Register</Link>
      </div>
    </nav>
  );
}