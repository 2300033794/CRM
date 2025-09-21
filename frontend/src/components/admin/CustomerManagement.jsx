// src/components/admin/CustomerManagement.jsx

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, faTrash, faPlus, faSearch,
  faSort, faSortUp, faSortDown
} from '@fortawesome/free-solid-svg-icons';
import api from '../../api';
import Swal from 'sweetalert2';
import { useDebounce } from '../../hooks/useDebounce';

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
  background-color: ${props => props.$edit ? '#3498db' : '#e74c3c'};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${props => props.$edit ? '#2980b9' : '#c0392b'};
  }
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

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/customers', {
          params: {
            sort: `${sortField},${sortDirection}`,
            page: currentPage,
            size: 10,
            search: debouncedSearchTerm
          },
      });
      setCustomers(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error fetching customers:', error);
      Swal.fire('Error', 'Failed to load customers.', 'error');
    } finally {
      setLoading(false);
    }
  }, [sortField, sortDirection, currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSort = (field) => {
    const direction = (sortField === field && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    setCurrentPage(0);
  };
  
  const handlePageChange = (page) => setCurrentPage(page);
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
  
  const getSortIcon = (field) => {
    if (sortField !== field) return <FontAwesomeIcon icon={faSort} className="sort-icon" />;
    return sortDirection === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
      : <FontAwesomeIcon icon={faSortDown} className="sort-icon" />;
  };
  
  // ** NEW: ADD CUSTOMER LOGIC **
  const handleAddCustomer = () => {
    Swal.fire({
      title: 'Add New Customer',
      html: `
        <input id="username" class="swal2-input" placeholder="Username" required>
        <input id="email" type="email" class="swal2-input" placeholder="Email" required>
        <input id="password" type="password" class="swal2-input" placeholder="Password" required>
        <input id="phone" class="swal2-input" placeholder="Phone Number">
      `,
      showCancelButton: true,
      confirmButtonText: 'Add Customer',
      confirmButtonColor: '#e74c3c',
      preConfirm: () => {
        const username = Swal.getPopup().querySelector('#username').value;
        const email = Swal.getPopup().querySelector('#email').value;
        const password = Swal.getPopup().querySelector('#password').value;
        if (!username || !email || !password) {
          Swal.showValidationMessage('Username, Email, and Password are required');
          return false;
        }
        return {
          username, email, password,
          phone: Swal.getPopup().querySelector('#phone').value,
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post('/admin/customers', result.value);
          Swal.fire('Success!', 'Customer added successfully.', 'success');
          fetchCustomers();
        } catch (error) {
          Swal.fire('Error!', error.response?.data?.message || 'Failed to add customer.', 'error');
        }
      }
    });
  };

  // ** NEW: EDIT CUSTOMER LOGIC **
  const handleEditCustomer = (customer) => {
    Swal.fire({
      title: 'Edit Customer',
      html: `
        <input id="username" class="swal2-input" placeholder="Username" value="${customer.username}" required>
        <input id="email" type="email" class="swal2-input" placeholder="Email" value="${customer.email}" required>
        <input id="phone" class="swal2-input" placeholder="Phone Number" value="${customer.phone || ''}">
        <select id="status" class="swal2-input">
            <option value="ACTIVE" ${customer.status === 'ACTIVE' ? 'selected' : ''}>Active</option>
            <option value="PENDING" ${customer.status === 'PENDING' ? 'selected' : ''}>Pending</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      preConfirm: () => {
        const username = Swal.getPopup().querySelector('#username').value;
        const email = Swal.getPopup().querySelector('#email').value;
        if (!username || !email) {
          Swal.showValidationMessage('Username and Email are required');
          return false;
        }
        return {
          username, email,
          phone: Swal.getPopup().querySelector('#phone').value,
          status: Swal.getPopup().querySelector('#status').value,
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/admin/customers/${customer.id}`, result.value);
          Swal.fire('Updated!', 'Customer details have been updated.', 'success');
          fetchCustomers();
        } catch (error) {
          Swal.fire('Error!', error.response?.data?.message || 'Failed to update customer.', 'error');
        }
      }
    });
  };

  // ** NEW: DELETE CUSTOMER LOGIC **
  const handleDeleteCustomer = (customerId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/customers/${customerId}`);
          Swal.fire('Deleted!', 'The customer has been deleted.', 'success');
          fetchCustomers();
        } catch (error) {
          Swal.fire('Error!', 'Failed to delete customer.', 'error');
        }
      }
    });
  };
  
  if (loading) {
    return (
      <Container>
        <PageTitle>Customer Management</PageTitle>
        <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
      </Container>
    );
  }
  
  return (
    <Container>
      <PageTitle>Customer Management</PageTitle>
      
      <ControlsContainer>
        <SearchBox>
          <SearchIcon><FontAwesomeIcon icon={faSearch} /></SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        <AddButton onClick={handleAddCustomer}><FontAwesomeIcon icon={faPlus} /> Add Customer</AddButton>
      </ControlsContainer>
      
      {customers.length > 0 ? (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader $sortable onClick={() => handleSort('username')}>Username {getSortIcon('username')}</TableHeader>
                <TableHeader $sortable onClick={() => handleSort('email')}>Email {getSortIcon('email')}</TableHeader>
                <TableHeader>Phone</TableHeader>
                <TableHeader $sortable onClick={() => handleSort('status')}>Status {getSortIcon('status')}</TableHeader>
                <TableHeader $sortable onClick={() => handleSort('joinDate')}>Join Date {getSortIcon('joinDate')}</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {customers.map(customer => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.username}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || 'N/A'}</TableCell>
                  <TableCell><span style={{ color: customer.status === 'ACTIVE' ? '#27ae60' : '#f39c12', fontWeight: 'bold' }}>{customer.status}</span></TableCell>
                  <TableCell>{formatDate(customer.joinDate)}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <ActionButton $edit onClick={() => handleEditCustomer(customer)}><FontAwesomeIcon icon={faEdit} /></ActionButton>
                      <ActionButton onClick={() => handleDeleteCustomer(customer.id)}><FontAwesomeIcon icon={faTrash} /></ActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
          
          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => i).map(page => (
              <PageButton key={page} $active={currentPage === page} onClick={() => handlePageChange(page)}>{page + 1}</PageButton>
            ))}
          </Pagination>
        </>
      ) : (
        <NoData>No customers found.</NoData>
      )}
    </Container>
  );
};

export default CustomerManagement;