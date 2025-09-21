// src/components/admin/CustomerApproval.jsx

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';

// Re-using styles for consistency
const Container = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
  border-bottom: 2px solid #e74c3c;
  padding-bottom: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled.thead`
  background-color: #f8f9fa;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    background-color: #f1f4f9;
  }
`;

const TableHeader = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #ddd;
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ddd;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;

  background-color: ${props => props.$approve ? '#2ecc71' : '#e74c3c'};
  &:hover {
    background-color: ${props => props.$approve ? '#27ae60' : '#c0392b'};
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #e74c3c;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;

const NoData = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
  font-size: 1.2rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;


const CustomerApproval = () => {
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/admin/customers/pending`, {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setPendingCustomers(response.data.content || []);
    } catch (error) {
      console.error("Failed to fetch pending customers:", error);
      Swal.fire('Error', 'Failed to load pending customers.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingCustomers();
  }, [fetchPendingCustomers]);

  const handleApprove = async (customerId) => {
    try {
        const token = sessionStorage.getItem('token');
        await axios.put(`${import.meta.env.VITE_APP_API_URL}/admin/customers/${customerId}/approve`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('Approved!', 'Customer has been approved.', 'success');
        fetchPendingCustomers();
    } catch (error) {
        Swal.fire('Error', 'Failed to approve customer.', 'error');
    }
  };

  const handleReject = (customerId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the customer's registration request.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#7f8c8d',
      confirmButtonText: 'Yes, reject and delete!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_APP_API_URL}/admin/customers/${customerId}/reject`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Swal.fire('Rejected!', 'Customer has been removed.', 'success');
            fetchPendingCustomers();
        } catch (error) {
            Swal.fire('Error', 'Failed to reject customer.', 'error');
        }
      }
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };
  
  if (loading) {
    return (
      <Container>
        <PageTitle>Customer Approval</PageTitle>
        <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
      </Container>
    );
  }
  
  return (
    <Container>
      <PageTitle>Customer Approval</PageTitle>
      {pendingCustomers.length > 0 ? (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeader>Username</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Join Date</TableHeader>
                    <TableHeader>Actions</TableHeader>
                </TableRow>
            </TableHead>
            <tbody>
                {pendingCustomers.map(customer => (
                    <TableRow key={customer.id}>
                        <TableCell>{customer.username}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{formatDate(customer.joinDate)}</TableCell>
                        <TableCell>
                            <ActionButtons>
                                <ActionButton $approve onClick={() => handleApprove(customer.id)}>
                                    <FontAwesomeIcon icon={faCheck} /> Approve
                                </ActionButton>
                                <ActionButton onClick={() => handleReject(customer.id)}>
                                    <FontAwesomeIcon icon={faTimes} /> Reject
                                </ActionButton>
                            </ActionButtons>
                        </TableCell>
                    </TableRow>
                ))}
            </tbody>
        </Table>
      ) : (
        <NoData>No pending customer approvals at this time.</NoData>
      )}
    </Container>
  );
};

export default CustomerApproval;