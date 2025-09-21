// src/components/customer/CustomerProfile.jsx

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faCalendarAlt, faMapMarkerAlt, 
  faEdit, faSave, faTimes, faPhone 
} from '@fortawesome/free-solid-svg-icons';
import api from '../../api';
import Swal from 'sweetalert2';

const ProfileContainer = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
  border-bottom: 2px solid #4a90e2;
  padding-bottom: 10px;
`;

const ProfileCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 30px;
  margin-bottom: 30px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const ProfileAvatar = styled.div`
  width: 100px;
  height: 100px;
  background-color: #4a90e2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  color: white;
  font-size: 2.5rem;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h2`
  margin: 0;
  color: #333;
  font-size: 1.8rem;
`;

const ProfileEmail = styled.p`
  margin: 5px 0 0;
  color: #666;
  font-size: 1rem;
`;

const ProfileDetails = styled.div`
  margin-top: 20px;
`;

const ProfileItem = styled.div`
  display: flex;
  margin-bottom: 15px;
  align-items: center;
`;

const ProfileLabel = styled.div`
  width: 120px;
  font-weight: bold;
  color: #555;
  display: flex;
  align-items: center;
  .icon {
    margin-right: 10px;
    color: #4a90e2;
    width: 20px;
  }
`;

const ProfileValue = styled.div`
  flex: 1;
  color: #333;
`;

const ProfileInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    border-color: #4a90e2;
    outline: none;
  }
`;

const ProfileTextarea = styled.textarea`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
  &:focus {
    border-color: #4a90e2;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  .icon { margin-right: 8px; }
  &:hover { transform: translateY(-2px); box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1); }
  &:active { transform: translateY(0); }
`;

const EditButton = styled(Button)`
  background-color: #4a90e2;
  color: white;
  &:hover { background-color: #357abD; }
`;

const SaveButton = styled(Button)`
  background-color: #2ecc71;
  color: white;
  &:hover { background-color: #27ae60; }
`;

const CancelButton = styled(Button)`
  background-color: #e74c3c;
  color: white;
  &:hover { background-color: #c0392b; }
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

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    age: '',
    address: '',
    phone: ''
  });

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const userId = sessionStorage.getItem('userId');
      if (!userId) throw new Error("User ID not found in session storage");

      const response = await api.get(`/customers/${userId}`);
      setProfile(response.data);
      setFormData({
        email: response.data.email || '',
        age: response.data.age || '',
        address: response.data.address || '',
        phone: response.data.phone || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Loading Error',
        text: 'Failed to load profile data. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      email: profile.email,
      age: profile.age,
      address: profile.address,
      phone: profile.phone
    });
  };
  
  const handleSave = async () => {
    try {
      const userId = sessionStorage.getItem('userId');
      const response = await api.put(`/customers/${userId}`, formData);
      
      setProfile(response.data);
      setEditing(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Profile updated successfully!',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update profile. Please try again later.'
      });
    }
  };
  
  if (loading) {
    return (
      <ProfileContainer>
        <PageTitle>My Profile</PageTitle>
        <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
      </ProfileContainer>
    );
  }
  
  if (!profile) {
    return (
        <ProfileContainer>
            <PageTitle>My Profile</PageTitle>
            <p>Could not load profile data. Please try refreshing the page.</p>
        </ProfileContainer>
    );
  }
  
  return (
    <ProfileContainer>
      <PageTitle>My Profile</PageTitle>
      
      <ProfileCard>
        <ProfileHeader>
          <ProfileAvatar>
            <FontAwesomeIcon icon={faUser} />
          </ProfileAvatar>
          <ProfileInfo>
            <ProfileName>{profile.username}</ProfileName>
            <ProfileEmail>{profile.email}</ProfileEmail>
          </ProfileInfo>
        </ProfileHeader>
        
        <ProfileDetails>
          <ProfileItem>
            <ProfileLabel><FontAwesomeIcon icon={faEnvelope} className="icon" /> Email</ProfileLabel>
            {editing ? (
              <ProfileInput type="email" name="email" value={formData.email} onChange={handleChange} />
            ) : ( <ProfileValue>{profile.email}</ProfileValue> )}
          </ProfileItem>

           <ProfileItem>
            <ProfileLabel><FontAwesomeIcon icon={faPhone} className="icon" /> Phone</ProfileLabel>
            {editing ? (
              <ProfileInput type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            ) : ( <ProfileValue>{profile.phone || 'N/A'}</ProfileValue> )}
          </ProfileItem>
          
          <ProfileItem>
            <ProfileLabel><FontAwesomeIcon icon={faCalendarAlt} className="icon" /> Age</ProfileLabel>
            {editing ? (
              <ProfileInput type="number" name="age" value={formData.age} onChange={handleChange} />
            ) : ( <ProfileValue>{profile.age || 'N/A'}</ProfileValue> )}
          </ProfileItem>
          
          <ProfileItem>
            <ProfileLabel><FontAwesomeIcon icon={faMapMarkerAlt} className="icon" /> Address</ProfileLabel>
            {editing ? (
              <ProfileTextarea name="address" value={formData.address} onChange={handleChange} />
            ) : ( <ProfileValue>{profile.address || 'N/A'}</ProfileValue> )}
          </ProfileItem>
        </ProfileDetails>
        
        <ButtonGroup>
          {editing ? (
            <>
              <SaveButton onClick={handleSave}><FontAwesomeIcon icon={faSave} className="icon" /> Save</SaveButton>
              <CancelButton onClick={handleCancel}><FontAwesomeIcon icon={faTimes} className="icon" /> Cancel</CancelButton>
            </>
          ) : (
            <EditButton onClick={handleEdit}><FontAwesomeIcon icon={faEdit} className="icon" /> Edit Profile</EditButton>
          )}
        </ButtonGroup>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default CustomerProfile;