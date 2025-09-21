// src/components/customer/MyCampaigns.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faClock, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';

const Container = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
  border-bottom: 2px solid #4a90e2;
  padding-bottom: 10px;
`;

const ControlsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abD;
  }
`;

const CampaignGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const CampaignCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const CampaignTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
`;

const CampaignDescription = styled.p`
    flex-grow: 1;
    color: #666;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: capitalize;
  margin-top: 15px;
  align-self: flex-start;
  
  ${props => {
    switch (props.status) {
      case 'APPROVED': // Completed
        return `background-color: rgba(46, 204, 113, 0.2); color: #27ae60;`;
      case 'REJECTED': // Pending
        return `background-color: rgba(231, 76, 60, 0.2); color: #c0392b;`;
      case 'PENDING': // Scheduled
        return `background-color: rgba(241, 196, 15, 0.2); color: #f39c12;`;
      default:
        return `background-color: rgba(149, 165, 166, 0.2); color: #7f8c8d;`;
    }
  }}
`;

const getStatusInfo = (status) => {
    switch(status) {
        case 'APPROVED': return { text: 'Completed', icon: faCheckCircle };
        case 'REJECTED': return { text: 'Pending', icon: faTimesCircle };
        case 'PENDING': return { text: 'Scheduled', icon: faClock };
        default: return { text: status, icon: faClock };
    }
};

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #4a90e2;
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

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmittedCampaigns = async () => {
    setLoading(true);
    try {
      const userId = sessionStorage.getItem('userId');
      const token = sessionStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/customers/${userId}/customer-campaigns`, {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCampaigns(response.data);
    } catch (error) {
      Swal.fire('Error', 'Failed to load your campaigns.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmittedCampaigns();
  }, []);

  const handleAddCampaign = () => {
    Swal.fire({
      title: 'Submit New Campaign for Review',
      html: `
        <input id="title" class="swal2-input" placeholder="Campaign Title">
        <textarea id="description" class="swal2-textarea" placeholder="Describe your campaign..."></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit for Review',
      confirmButtonColor: '#4a90e2',
      preConfirm: () => {
        const title = Swal.getPopup().querySelector('#title').value;
        const description = Swal.getPopup().querySelector('#description').value;
        if (!title || !description) {
          Swal.showValidationMessage('Title and description are required');
          return false;
        }
        return { title, description };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const userId = sessionStorage.getItem('userId');
          const token = sessionStorage.getItem('token');
          await axios.post(
            `${import.meta.env.VITE_APP_API_URL}/customers/${userId}/campaigns`,
            result.value,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire('Success!', 'Campaign submitted for admin review.', 'success');
          fetchSubmittedCampaigns();
        } catch (error) {
          Swal.fire('Error!', error.response?.data?.message || 'Failed to submit campaign.', 'error');
        }
      }
    });
  };

  if (loading) {
    return (
      <Container>
        <PageTitle>My Campaigns</PageTitle>
        <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>My Submitted Campaigns</PageTitle>
      
      <ControlsContainer>
        <AddButton onClick={handleAddCampaign}>
            <FontAwesomeIcon icon={faPlus} />
            Submit New Campaign
        </AddButton>
      </ControlsContainer>
      
      {campaigns.length > 0 ? (
        <CampaignGrid>
          {campaigns.map(campaign => {
            const statusInfo = getStatusInfo(campaign.status);
            return (
              <CampaignCard key={campaign.id}>
                  <CampaignTitle>{campaign.title}</CampaignTitle>
                  <CampaignDescription>{campaign.description}</CampaignDescription>
                  <StatusBadge status={campaign.status}>
                      <FontAwesomeIcon icon={statusInfo.icon} />
                      <span>{statusInfo.text}</span>
                  </StatusBadge>
              </CampaignCard>
            )
          })}
        </CampaignGrid>
      ) : (
        <NoData>You have not submitted any campaigns yet. Click the button above to create one!</NoData>
      )}
    </Container>
  );
};

export default MyCampaigns;