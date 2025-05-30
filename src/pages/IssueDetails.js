import React from 'react';
import { useParams } from 'react-router-dom';

export default function IssueDetails() {
  const { id } = useParams();
  return <div className="p-4">Issue Details Page for Issue ID: {id}</div>;
}