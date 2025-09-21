// src/components/customer/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faChartLine, 
  faComments, 
  faPaperPlane,
  faEnvelopeOpenText, // New Icon
  faBars, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import CustomerProfile from './CustomerProfile';
import CustomerAnalytics from './CustomerAnalytics';
import CustomerInteractions from './CustomerInteractions';
import MyCampaigns from './MyCampaigns';
import CustomerEmails from './CustomerEmails'; // Import the new component
import Swal from 'sweetalert2';

// ... (Styled components are unchanged) ...

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f4f7f6;
`;
const Sidebar = styled.div`
  width: ${({ $isOpen }) => ($isOpen ? '250px' : '70px')};
  background: linear-gradient(180deg, #1a2a6c 0%, #2a3a7c 100%);
  color: white;
  transition: width 0.3s ease;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  height: 100vh;
  z-index: 100;
  overflow-x: hidden;
`;
const SidebarHeader = styled.div`
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: ${({ $isOpen }) => ($isOpen ? 'space-between' : 'center')};
  align-items: center;
`;
const Logo = styled.h2`
  margin: 0;
  font-size: ${({ $isOpen }) => ($isOpen ? '1.5rem' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
  transition: all 0.3s ease;
  white-space: nowrap;
`;
const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
`;
const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 20px 0;
`;
const MenuItem = styled.li`
  margin-bottom: 5px;
`;
const MenuLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  &.active {
    background-color: rgba(255, 255, 255, 0.1);
    border-left-color: #4a90e2;
  }
  .icon {
    font-size: 1.2rem;
    min-width: 30px;
    text-align: center;
  }
  .text {
    margin-left: 10px;
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transition: all 0.2s ease;
    white-space: nowrap;
  }
`;
const LogoutButton = styled.button`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 20px;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
    text-align: left;
    position: absolute;
    bottom: 20px;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      border-left-color: #e74c3c;
    }
    .icon {
      font-size: 1.2rem;
      min-width: 30px;
      text-align: center;
    }
    .text {
      margin-left: 10px;
      opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
      visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
      transition: all 0.2s ease;
      white-space: nowrap;
    }
`;
const Content = styled.div`
  flex: 1;
  margin-left: ${({ $sidebarWidth }) => $sidebarWidth};
  transition: margin-left 0.3s ease;
  padding: 20px;
`;


const CustomerDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeLink, setActiveLink] = useState('profile');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'profile';
    setActiveLink(path);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('userId');
        navigate('/login');
      }
    });
  };

  return (
    <DashboardContainer>
      <Sidebar $isOpen={isOpen}>
        <SidebarHeader $isOpen={isOpen}>
          <Logo $isOpen={isOpen}>Customer</Logo>
          <ToggleButton $isOpen={isOpen} onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </ToggleButton>
        </SidebarHeader>
        
        <SidebarMenu>
          <MenuItem>
            <MenuLink to="/customer/profile" $isOpen={isOpen} className={activeLink === 'profile' ? 'active' : ''}>
              <FontAwesomeIcon icon={faUser} className="icon" />
              <span className="text">Profile</span>
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/customer/analytics" $isOpen={isOpen} className={activeLink === 'analytics' ? 'active' : ''}>
              <FontAwesomeIcon icon={faChartLine} className="icon" />
              <span className="text">Analytics</span>
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/customer/interactions" $isOpen={isOpen} className={activeLink === 'interactions' ? 'active' : ''}>
              <FontAwesomeIcon icon={faComments} className="icon" />
              <span className="text">Interactions</span>
            </MenuLink>
          </MenuItem>
          {/* ** NEW LINK ** */}
          <MenuItem>
            <MenuLink to="/customer/email-campaigns" $isOpen={isOpen} className={activeLink === 'email-campaigns' ? 'active' : ''}>
              <FontAwesomeIcon icon={faEnvelopeOpenText} className="icon" />
              <span className="text">Email Campaigns</span>
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/customer/my-campaigns" $isOpen={isOpen} className={activeLink === 'my-campaigns' ? 'active' : ''}>
              <FontAwesomeIcon icon={faPaperPlane} className="icon" />
              <span className="text">My Campaigns</span>
            </MenuLink>
          </MenuItem>
        </SidebarMenu>
       
        <LogoutButton $isOpen={isOpen} onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
          <span className="text">Logout</span>
        </LogoutButton>
      </Sidebar>
      
      <Content $sidebarWidth={isOpen ? '250px' : '70px'}>
        <Routes>
          <Route path="/" element={<CustomerProfile />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/analytics" element={<CustomerAnalytics />} />
          <Route path="/interactions" element={<CustomerInteractions />} />
          {/* ** NEW ROUTE ** */}
          <Route path="/email-campaigns" element={<CustomerEmails />} />
          <Route path="/my-campaigns" element={<MyCampaigns />} />
        </Routes>
      </Content>
    </DashboardContainer>
  );
};

export default CustomerDashboard;