import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelope, faPlus, faEdit, faTrash, faSearch,
  faSort, faSortUp, faSortDown, faEye, faChartLine
} from '@fortawesome/free-solid-svg-icons';
import api from '../../api';
import Swal from 'sweetalert2';

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
const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`;
const SearchBox = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  &:focus {
    border-color: #e74c3c;
    outline: none;
  }
`;
const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;
const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover { background-color: #c0392b; }
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;
const TableHead = styled.thead`
  background-color: #f8f9fa;
`;
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
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  .sort-icon { margin-left: 5px; }
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
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: ${props => {
    if (props.$edit) return '#3498db';
    if (props.$view) return '#2ecc71';
    if (props.$stats) return '#f39c12';
    return '#e74c3c'; // Default to delete color
  }};
  &:hover {
    background-color: ${props => {
      if (props.$edit) return '#2980b9';
      if (props.$view) return '#27ae60';
      if (props.$stats) return '#d35400';
      return '#c0392b';
    }};
  }
`;
const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: capitalize;
  background-color: ${props => {
    switch(props.status) {
      case 'sent': return 'rgba(46, 204, 113, 0.2)';
      case 'draft': return 'rgba(52, 152, 219, 0.2)';
      case 'scheduled': return 'rgba(241, 196, 15, 0.2)';
      default: return 'rgba(149, 165, 166, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'sent': return '#27ae60';
      case 'draft': return '#2980b9';
      case 'scheduled': return '#f39c12';
      default: return '#7f8c8d';
    }
  }};
`;
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5px;
`;
const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background-color: ${props => props.$active ? '#e74c3c' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover:not(:disabled) {
    background-color: ${props => props.$active ? '#c0392b' : '#f1f4f9'};
  }
  &:disabled { cursor: not-allowed; opacity: 0.5; }
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

const EmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/campaigns', {
          params: {
            page: currentPage,
            size: 10,
            sort: `${sortField},${sortDirection}`
          }
      });
      setCampaigns(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      Swal.fire('Error', 'Failed to load campaigns.', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortField, sortDirection]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const handleSort = (field) => {
    const direction = (sortField === field && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(0);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  const getSortIcon = (field) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faSort} className="sort-icon" />;
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
      : <FontAwesomeIcon icon={faSortDown} className="sort-icon" />;
  };
  
  const handleAddCampaign = () => {
    Swal.fire({
      title: 'Create New Campaign',
      html: `
        <input id="name" class="swal2-input" placeholder="Campaign Name">
        <input id="subject" class="swal2-input" placeholder="Email Subject">
      `,
      showCancelButton: true,
      confirmButtonText: 'Create',
      confirmButtonColor: '#e74c3c',
      preConfirm: () => {
        const name = Swal.getPopup().querySelector('#name').value;
        const subject = Swal.getPopup().querySelector('#subject').value;
        if (!name || !subject) {
          Swal.showValidationMessage('Name and Subject are required');
          return false;
        }
        return { name, subject, status: 'draft' };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post('/admin/campaigns', result.value);
          Swal.fire('Success', 'Campaign created as a draft.', 'success');
          fetchCampaigns();
        } catch (error) {
          Swal.fire('Error', 'Failed to create campaign.', 'error');
        }
      }
    });
  };

  const handleEditCampaign = (campaign) => {
    Swal.fire({
      title: 'Edit Campaign',
      html: `
        <input id="name" class="swal2-input" value="${campaign.name}" placeholder="Campaign Name">
        <input id="subject" class="swal2-input" value="${campaign.subject}" placeholder="Email Subject">
        <select id="status" class="swal2-select">
            <option value="draft" ${campaign.status === 'draft' ? 'selected' : ''}>Draft</option>
            <option value="scheduled" ${campaign.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
            <option value="sent" ${campaign.status === 'sent' ? 'selected' : ''}>Sent</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      preConfirm: () => ({
        name: Swal.getPopup().querySelector('#name').value,
        subject: Swal.getPopup().querySelector('#subject').value,
        status: Swal.getPopup().querySelector('#status').value,
      })
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/admin/campaigns/${campaign.id}`, result.value);
          Swal.fire('Updated!', 'Campaign has been updated.', 'success');
          fetchCampaigns();
        } catch (error) {
          Swal.fire('Error!', 'Failed to update campaign.', 'error');
        }
      }
    });
  };

  const handleDeleteCampaign = (campaignId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/campaigns/${campaignId}`);
          Swal.fire('Deleted!', 'The campaign has been deleted.', 'success');
          fetchCampaigns();
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete campaign.', 'error');
        }
      }
    });
  };

  const handleViewStats = (campaign) => {
    Swal.fire('Coming Soon!', `Statistics for the '${campaign.name}' campaign will be available in a future update.`, 'info');
  };

  if (loading) {
    return (
      <Container>
        <PageTitle>Email Campaigns</PageTitle>
        <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
      </Container>
    );
  }
  
  return (
    <Container>
      <PageTitle>Email Campaigns</PageTitle>
      <ControlsContainer>
        <SearchBox>
          <SearchIcon><FontAwesomeIcon icon={faSearch} /></SearchIcon>
          <SearchInput type="text" placeholder="Search campaigns..." />
        </SearchBox>
        <AddButton onClick={handleAddCampaign}><FontAwesomeIcon icon={faPlus} /> Create Campaign</AddButton>
      </ControlsContainer>
      
      {campaigns.length > 0 ? (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader $sortable onClick={() => handleSort('name')}>Name {getSortIcon('name')}</TableHeader>
                <TableHeader $sortable onClick={() => handleSort('subject')}>Subject {getSortIcon('subject')}</TableHeader>
                <TableHeader $sortable onClick={() => handleSort('status')}>Status {getSortIcon('status')}</TableHeader>
                <TableHeader $sortable onClick={() => handleSort('createdAt')}>Created {getSortIcon('createdAt')}</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {campaigns.map(campaign => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.subject}</TableCell>
                  <TableCell><StatusBadge status={campaign.status}>{campaign.status}</StatusBadge></TableCell>
                  <TableCell>{formatDate(campaign.createdAt)}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <ActionButton $edit onClick={() => handleEditCampaign(campaign)}><FontAwesomeIcon icon={faEdit} /></ActionButton>
                      <ActionButton $stats onClick={() => handleViewStats(campaign)}><FontAwesomeIcon icon={faChartLine} /></ActionButton>
                      <ActionButton onClick={() => handleDeleteCampaign(campaign.id)}><FontAwesomeIcon icon={faTrash} /></ActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          
          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => i).map(page => (
              <PageButton key={page} $active={currentPage === page} onClick={() => setCurrentPage(page)}>{page + 1}</PageButton>
            ))}
          </Pagination>
        </>
      ) : (
        <NoData>No email campaigns found.</NoData>
      )}
    </Container>
  );
};

export default EmailCampaigns;
