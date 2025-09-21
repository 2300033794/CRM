import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '../../api';
import Swal from 'sweetalert2';

const Container = styled.div` padding: 20px; `;
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
const TableHead = styled.thead` background-color: #f8f9fa; `;
const TableRow = styled.tr`
  &:nth-child(even) { background-color: #f8f9fa; }
  &:hover { background-color: #f1f4f9; }
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
const ActionButtons = styled.div` display: flex; gap: 10px; `;
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
  background-color: ${props => props.$approve ? '#2ecc71' : '#f39c12'};
  &:hover {
    background-color: ${props => props.$approve ? '#27ae60' : '#d35400'};
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
`;

const InteractionApproval = () => {
  const [pendingInteractions, setPendingInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingInteractions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/interactions/pending');
      setPendingInteractions(response.data.content || []);
    } catch (error) {
      Swal.fire('Error', 'Failed to load pending interactions.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingInteractions();
  }, [fetchPendingInteractions]);

  const handleStatusUpdate = async (interactionId, status, action) => {
    try {
      await api.put(`/admin/interactions/${interactionId}/status`, { status });
      Swal.fire(`${action}!`, `The interaction has been ${action.toLowerCase()}.`, 'success');
      fetchPendingInteractions(); // Refresh the list
    } catch (error) {
      Swal.fire('Error', `Failed to update the interaction.`, 'error');
    }
  };

  if (loading) {
    return (
      <Container>
        <PageTitle>Interaction Approval</PageTitle>
        <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
      </Container>
    );
  }
  
  return (
    <Container>
      <PageTitle>Interaction Approval</PageTitle>
      {pendingInteractions.length > 0 ? (
        <Table>
            <TableHead>
                <TableRow>
                    <TableHeader>Customer</TableHeader>
                    <TableHeader>Subject</TableHeader>
                    <TableHeader>Type</TableHeader>
                    <TableHeader>Notes</TableHeader>
                    <TableHeader>Actions</TableHeader>
                </TableRow>
            </TableHead>
            <tbody>
                {pendingInteractions.map(interaction => (
                    <TableRow key={interaction.id}>
                        <TableCell>{interaction.customer.username}</TableCell>
                        <TableCell>{interaction.subject}</TableCell>
                        <TableCell>{interaction.type}</TableCell>
                        <TableCell>{interaction.notes}</TableCell>
                        <TableCell>
                            <ActionButtons>
                                <ActionButton $approve onClick={() => handleStatusUpdate(interaction.id, 'COMPLETED', 'Approved')}>
                                    <FontAwesomeIcon icon={faCheck} /> Approve
                                </ActionButton>
                                <ActionButton onClick={() => handleStatusUpdate(interaction.id, 'SCHEDULED', 'Rejected')}>
                                    <FontAwesomeIcon icon={faTimes} /> Reject
                                </ActionButton>
                            </ActionButtons>
                        </TableCell>
                    </TableRow>
                ))}
            </tbody>
        </Table>
      ) : (
        <NoData>No pending interactions for approval.</NoData>
      )}
    </Container>
  );
};

export default InteractionApproval;