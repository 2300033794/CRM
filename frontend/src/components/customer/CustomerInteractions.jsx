import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhone, faEnvelope, faCalendarCheck, 
  faSort, faSortUp, faSortDown, faSearch, faPlus
} from '@fortawesome/free-solid-svg-icons';
import api from '../../api';
import Swal from 'sweetalert2';
import { useDebounce } from '../../hooks/useDebounce';

const InteractionsContainer = styled.div`
  padding: 20px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const PageTitle = styled.h1`
  margin-bottom: 10px;
  color: #333;
  font-size: 2rem;
  border-bottom: 2px solid #4a90e2;
  padding-bottom: 10px;
  flex-grow: 1;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover { background-color: #27ae60; }
`;

const FilterContainer = styled.div`
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
  min-width: 250px;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  &:focus {
    border-color: #4a90e2;
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

const FilterSelect = styled.select`
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  background-color: white;
  &:focus {
    border-color: #4a90e2;
    outline: none;
  }
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
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  .sort-icon {
    margin-left: 5px;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  border-bottom: 1px solid #ddd;
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: capitalize;
  background-color: ${props => {
    switch(props.type) {
      case 'call': return 'rgba(46, 204, 113, 0.2)';
      case 'email': return 'rgba(52, 152, 219, 0.2)';
      case 'meeting': return 'rgba(155, 89, 182, 0.2)';
      default: return 'rgba(149, 165, 166, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.type) {
      case 'call': return '#27ae60';
      case 'email': return '#2980b9';
      case 'meeting': return '#8e44ad';
      default: return '#7f8c8d';
    }
  }};
`;

const StatusBadge = styled(TypeBadge)`
  background-color: ${props => {
    switch(props.status) {
      case 'completed': return 'rgba(46, 204, 113, 0.2)';
      case 'scheduled': return 'rgba(241, 196, 15, 0.2)';
      case 'pending': return 'rgba(231, 76, 60, 0.2)';
      default: return 'rgba(149, 165, 166, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'completed': return '#27ae60';
      case 'scheduled': return '#f39c12';
      case 'pending': return '#c0392b';
      default: return '#7f8c8d';
    }
  }};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 5px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background-color: ${props => props.$active ? '#4a90e2' : 'white'};
  color: ${props => props.$active ? 'white' : '#333'};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover:not(:disabled) {
    background-color: ${props => props.$active ? '#357abD' : '#f1f4f9'};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PageInfo = styled.span`
    padding: 8px 12px;
    font-size: 0.9rem;
    color: #555;
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
`;

const CustomerInteractions = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchInteractions = useCallback(async () => {
    setLoading(true);
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await api.get(`/customers/${userId}/interactions`, {
          params: {
            type: filterType === 'all' ? '' : filterType,
            search: debouncedSearchTerm,
            page: currentPage,
            size: 10,
            sort: `${sortField},${sortDirection}`
          }
      });
      setInteractions(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching interactions:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load interactions.' });
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterType, sortField, sortDirection, debouncedSearchTerm]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm, filterType]);

  const handleSort = (field) => {
    const direction = (sortField === field && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const handleAddInteraction = () => {
    Swal.fire({
        title: 'Add New Interaction',
        html: `
            <input id="subject" class="swal2-input" placeholder="Subject" required>
            <select id="type" class="swal2-select" required>
                <option value="" disabled selected>Select a type</option>
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="meeting">Meeting</option>
                <option value="other">Other</option>
            </select>
            <textarea id="notes" class="swal2-textarea" placeholder="Add notes here..."></textarea>
        `,
        confirmButtonText: 'Add Interaction',
        showCancelButton: true,
        confirmButtonColor: '#2ecc71',
        preConfirm: () => {
            const subject = Swal.getPopup().querySelector('#subject').value;
            const type = Swal.getPopup().querySelector('#type').value;
            if (!subject || !type) {
                Swal.showValidationMessage(`Please enter a subject and select a type`);
            }
            return { 
                subject, 
                type, 
                notes: Swal.getPopup().querySelector('#notes').value 
            };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const userId = sessionStorage.getItem('userId');
                await api.post(`/customers/${userId}/interactions`, result.value);
                Swal.fire('Success!', 'Interaction added successfully.', 'success');
                fetchInteractions();
            } catch (error) {
                Swal.fire('Error!', 'Could not add interaction.', 'error');
            }
        }
    });
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();
  const getSortIcon = (field) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faSort} className="sort-icon" />;
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
      : <FontAwesomeIcon icon={faSortDown} className="sort-icon" />;
  };
  const getTypeIcon = (type) => {
    switch(type) {
      case 'call': return faPhone;
      case 'email': return faEnvelope;
      case 'meeting': return faCalendarCheck;
      default: return faPhone;
    }
  };

  return (
    <InteractionsContainer>
      <HeaderContainer>
        <PageTitle>Interactions & Follow-ups</PageTitle>
        <AddButton onClick={handleAddInteraction}>
            <FontAwesomeIcon icon={faPlus} /> Add Interaction
        </AddButton>
      </HeaderContainer>
      
      <FilterContainer>
        <SearchBox>
          <SearchIcon><FontAwesomeIcon icon={faSearch} /></SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search by subject or notes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        <FilterSelect value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="call">Calls</option>
          <option value="email">Emails</option>
          <option value="meeting">Meetings</option>
        </FilterSelect>
      </FilterContainer>
      
      {loading ? (
        <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
      ) : interactions.length > 0 ? (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader $sortable onClick={() => handleSort('type')}>Type {getSortIcon('type')}</TableHeader>
                <TableHeader $sortable onClick={() => handleSort('subject')}>Subject {getSortIcon('subject')}</TableHeader>
                <TableHeader $sortable onClick={() => handleSort('date')}>Date {getSortIcon('date')}</TableHeader>
                <TableHeader $sortable onClick={() => handleSort('status')}>Status {getSortIcon('status')}</TableHeader>
                <TableHeader>Notes</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {interactions.map(interaction => (
                <TableRow key={interaction.id}>
                  <TableCell>
                    <TypeBadge type={interaction.type}>
                      <FontAwesomeIcon icon={getTypeIcon(interaction.type)} />
                      {interaction.type}
                    </TypeBadge>
                  </TableCell>
                  <TableCell>{interaction.subject}</TableCell>
                  <TableCell>{formatDate(interaction.date)}</TableCell>
                  <TableCell><StatusBadge status={interaction.status}>{interaction.status}</StatusBadge></TableCell>
                  <TableCell>{interaction.notes}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          
          <Pagination>
            <PageButton onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 0}>Prev</PageButton>
            <PageInfo>Page {currentPage + 1} of {totalPages}</PageInfo>
            <PageButton onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage >= totalPages - 1}>Next</PageButton>
          </Pagination>
        </>
      ) : (
        <NoData>No interactions found.</NoData>
      )}
    </InteractionsContainer>
  );
};

export default CustomerInteractions;