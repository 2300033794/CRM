import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faLock,
  faSave,
  faCamera
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
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

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSidebar = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
`;

const ProfileAvatar = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 0 auto 20px;
  overflow: hidden;
  border: 5px solid #f8f9fa;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarUpload = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const ProfileName = styled.h3`
  margin: 0 0 5px;
  color: #333;
  font-size: 1.5rem;
`;

const ProfileRole = styled.p`
  margin: 0 0 20px;
  color: #666;
  font-size: 1rem;
`;

const ProfileInfo = styled.div`
  text-align: left;
  margin-top: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  .icon {
    width: 20px;
    margin-right: 10px;
    color: #e74c3c;
  }
`;

const ProfileContent = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? '#e74c3c' : '#333'};
  border-bottom: ${props => props.active ? '2px solid #e74c3c' : 'none'};
  
  &:hover {
    color: #e74c3c;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  
  &:focus {
    border-color: #e74c3c;
    outline: none;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #c0392b;
  }
  
  .icon {
    margin-right: 8px;
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
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    avatar: '',
    department: '',
    position: '',
    bio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // This is a placeholder for the actual API call
      // Replace with your actual API endpoint when backend is ready
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/admin/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // For now, we'll use dummy data
      const dummyProfile = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        role: 'Administrator',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        department: 'Management',
        position: 'CRM Administrator',
        bio: 'Experienced CRM administrator with over 5 years of experience in customer relationship management systems.'
      };
      
      setProfile(response.data || dummyProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // For demo purposes, set dummy data
      const dummyProfile = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        role: 'Administrator',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        department: 'Management',
        position: 'CRM Administrator',
        bio: 'Experienced CRM administrator with over 5 years of experience in customer relationship management systems.'
      };
      
      setProfile(dummyProfile);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load profile. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (field, value) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };
  
  const handlePasswordChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value
    });
  };
  
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfile({
        ...profile,
        avatar: event.target.result
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // This is a placeholder for the actual API call
      // Replace with your actual API endpoint when backend is ready
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/admin/profile`,
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully!',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile. Please try again later.'
      });
    }
  };
  
  const handleChangePassword = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'New passwords do not match!'
      });
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Password must be at least 8 characters long!'
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // This is a placeholder for the actual API call
      // Replace with your actual API endpoint when backend is ready
      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/admin/change-password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Password changed successfully!',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error changing password:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to change password. Please check your current password and try again.'
      });
    }
  };
  
  if (loading) {
    return (
      <Container>
        <PageTitle>My Profile</PageTitle>
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      </Container>
    );
  }
  
  return (
    <Container>
      <PageTitle>My Profile</PageTitle>
      
      <ProfileGrid>
        <ProfileSidebar>
          <ProfileAvatar>
            <AvatarImage src={profile.avatar || 'https://via.placeholder.com/150'} alt={profile.name} />
            <AvatarUpload>
              <label htmlFor="avatar-upload" style={{ cursor: 'pointer', display: 'block' }}>
                <FontAwesomeIcon icon={faCamera} style={{ marginRight: '5px' }} />
                Change Photo
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleAvatarUpload}
              />
            </AvatarUpload>
          </ProfileAvatar>
          
          <ProfileName>{profile.name}</ProfileName>
          <ProfileRole>{profile.role}</ProfileRole>
          
          <ProfileInfo>
            <InfoItem>
              <FontAwesomeIcon icon={faEnvelope} className="icon" />
              {profile.email}
            </InfoItem>
            <InfoItem>
              <FontAwesomeIcon icon={faPhone} className="icon" />
              {profile.phone}
            </InfoItem>
            <InfoItem>
              <FontAwesomeIcon icon={faUser} className="icon" />
              {profile.department} - {profile.position}
            </InfoItem>
          </ProfileInfo>
        </ProfileSidebar>
        
        <ProfileContent>
          <TabsContainer>
            <Tab 
              active={activeTab === 'personal'} 
              onClick={() => setActiveTab('personal')}
            >
              Personal Information
            </Tab>
            <Tab 
              active={activeTab === 'password'} 
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </Tab>
          </TabsContainer>
          
          {activeTab === 'personal' ? (
            <>
              <FormGroup>
                <Label>Full Name</Label>
                <Input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Email Address</Label>
                <Input 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Phone Number</Label>
                <Input 
                  type="text" 
                  value={profile.phone} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Department</Label>
                <Input 
                  type="text" 
                  value={profile.department} 
                  onChange={(e) => handleInputChange('department', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Position</Label>
                <Input 
                  type="text" 
                  value={profile.position} 
                  onChange={(e) => handleInputChange('position', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Bio</Label>
                <Input 
                  as="textarea" 
                  rows="4" 
                  value={profile.bio} 
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              </FormGroup>
              
              <Button onClick={handleSaveProfile}>
                <FontAwesomeIcon icon={faSave} className="icon" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <FormGroup>
                <Label>Current Password</Label>
                <Input 
                  type="password" 
                  value={passwordData.currentPassword} 
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>New Password</Label>
                <Input 
                  type="password" 
                  value={passwordData.newPassword} 
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Confirm New Password</Label>
                <Input 
                  type="password" 
                  value={passwordData.confirmPassword} 
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                />
              </FormGroup>
              
              <Button onClick={handleChangePassword}>
                <FontAwesomeIcon icon={faLock} className="icon" />
                Change Password
              </Button>
            </>
          )}
        </ProfileContent>
      </ProfileGrid>
    </Container>
  );
};

export default UserProfile;