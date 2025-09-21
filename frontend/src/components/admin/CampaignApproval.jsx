// src/components/admin/CampaignApproval.jsx

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import api from '../../api';
import Swal from 'sweetalert2';

// Styled Components
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

const CampaignGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const CampaignCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
    border-bottom: 1px solid #eee;
    margin-bottom: 15px;
    padding-bottom: 10px;
`;

const CampaignTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const CustomerInfo = styled.p`
    margin: 5px 0 0;
    font-size: 0.9rem;
    color: #777;
`;

const CampaignDescription = styled.p`
    flex-grow: 1;
    color: #555;
    line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 8px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;
  font-weight: bold;

  background-color: ${props => props.$approve ? '#2ecc71' : '#e74c3c'};
  &:hover {
    background-color: ${props => props.$approve ? '#27ae60' : '#c0392b'};
  }
`;

const LoadingSpinner = styled.div`
  // ... (same as other components)
`;

const NoData = styled.div`
  text-align: center;
  padding: 50px;
  color: #666;
  font-size: 1.2rem;
`;

const CampaignApproval = () => {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/customer-campaigns/pending');
      setPendingCampaigns(response.data || []);
    } catch (error) {
      console.error("Failed to fetch pending campaigns:", error);
      Swal.fire('Error', 'Failed to load pending campaigns.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingCampaigns();
  }, [fetchPendingCampaigns]);

  const handleStatusUpdate = async (campaignId, status) => {
    const action = status === 'APPROVED' ? 'approve' : 'reject';
    try {
      await api.put(`/admin/customer-campaigns/${campaignId}/status`, { status });
      Swal.fire(
        `${status === 'APPROVED' ? 'Approved' : 'Rejected'}!`,
        `The campaign has been ${action}ed.`,
        'success'
      );
      fetchPendingCampaigns(); // Refresh the list
    } catch (error) {
      Swal.fire('Error', `Failed to ${action} the campaign.`, 'error');
    }
  };

  if (loading) {
    return <Container><PageTitle>Campaign Approval</PageTitle><LoadingSpinner>...</LoadingSpinner></Container>;
  }

  return (
    <Container>
      <PageTitle>Campaign Approval</PageTitle>
      {pendingCampaigns.length > 0 ? (
        <CampaignGrid>
          {pendingCampaigns.map(campaign => (
            <CampaignCard key={campaign.id}>
                <CardHeader>
                    <CampaignTitle>{campaign.title}</CampaignTitle>
                    <CustomerInfo>Submitted by: {campaign.customer.username}</CustomerInfo>
                </CardHeader>
                <CampaignDescription>{campaign.description}</CampaignDescription>
                <ActionButtons>
                    <ActionButton $approve onClick={() => handleStatusUpdate(campaign.id, 'APPROVED')}>
                        <FontAwesomeIcon icon={faCheck} /> Approve
                    </ActionButton>
                    <ActionButton onClick={() => handleStatusUpdate(campaign.id, 'REJECTED')}>
                        <FontAwesomeIcon icon={faTimes} /> Reject
                    </ActionButton>
                </ActionButtons>
            </CampaignCard>
          ))}
        </CampaignGrid>
      ) : (
        <NoData>No pending campaigns for approval at this time.</NoData>
      )}
    </Container>
  );
};

export default CampaignApproval;