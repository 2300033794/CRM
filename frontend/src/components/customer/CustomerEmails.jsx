// src/components/customer/CustomerEmails.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCalendarAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import api from '../../api';
import Swal from 'sweetalert2';

const EmailsContainer = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
  border-bottom: 2px solid #4a90e2;
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
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
`;

const CampaignName = styled.h3`
  margin: 0;
  color: #333;
  font-size: 1.2rem;
`;

const CardBody = styled.div`
  padding: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  color: #555;
  margin-bottom: 12px;
  
  .icon {
    margin-right: 12px;
    color: #4a90e2;
    width: 20px;
    text-align: center;
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
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const CustomerEmails = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCampaigns = async () => {
        setLoading(true);
        try {
            const userId = sessionStorage.getItem('userId');
            const response = await api.get(`/customers/${userId}/campaigns`);
            setCampaigns(response.data || []);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            Swal.fire('Error', 'Failed to load email campaigns.', 'error');
        } finally {
            setLoading(false);
        }
    };
    fetchCampaigns();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <EmailsContainer>
        <PageTitle>Email Campaigns</PageTitle>
        <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
      </EmailsContainer>
    );
  }
  
  return (
    <EmailsContainer>
      <PageTitle>Email Campaigns from Admin</PageTitle>
      
      {campaigns.length > 0 ? (
        <CampaignGrid>
          {campaigns.map(campaign => (
            <CampaignCard key={campaign.id}>
              <CardHeader>
                <CampaignName>{campaign.name}</CampaignName>
              </CardHeader>
              <CardBody>
                <InfoItem>
                  <FontAwesomeIcon icon={faEnvelope} className="icon" />
                  <span><strong>Subject:</strong> {campaign.subject}</span>
                </InfoItem>
                <InfoItem>
                  <FontAwesomeIcon icon={faPaperPlane} className="icon" />
                  <span><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{campaign.status}</span></span>
                </InfoItem>
                 <InfoItem>
                  <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
                  <span><strong>Sent:</strong> {formatDate(campaign.sentAt)}</span>
                </InfoItem>
              </CardBody>
            </CampaignCard>
          ))}
        </CampaignGrid>
      ) : (
        <NoData>
          You have not received any email campaigns yet.
        </NoData>
      )}
    </EmailsContainer>
  );
};

export default CustomerEmails;