import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUsers, faChartLine, faEnvelope, faCog, faBars, faSignOutAlt,
    faUserCheck, faPaperPlane, faClipboardCheck
} from '@fortawesome/free-solid-svg-icons';
import CustomerManagement from './CustomerManagement';
import AdminAnalytics from './AdminAnalytics';
import EmailCampaigns from './EmailCampaigns';
import SystemSettings from './SystemSettings';
import Swal from 'sweetalert2';
import CustomerApproval from './CustomerApproval';
import CampaignApproval from './CampaignApproval';
import InteractionApproval from './InteractionApproval';

const DashboardContainer = styled.div`
    display: flex;
    min-height: 100vh;
`;
const Sidebar = styled.div`
    width: ${({ $isOpen }) => ($isOpen ? '250px' : '70px')};
    background: linear-gradient(180deg, #2c3e50 0%, #1a252f 100%);
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
    background-color: #f4f7f6;
`;

const AdminDashboard = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeLink, setActiveLink] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname.split('/')[2] || 'customers';
        setActiveLink(path);
    }, [location]);

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 768) setIsOpen(false);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleLogout = () => {
      Swal.fire({
        title: 'Logout',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#7f8c8d',
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
            <Logo $isOpen={isOpen}>CRM Admin</Logo>
            <ToggleButton $isOpen={isOpen} onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </ToggleButton>
          </SidebarHeader>
      
          <SidebarMenu>
            <MenuItem>
              <MenuLink to="/admin/customers" $isOpen={isOpen} className={activeLink === 'customers' ? 'active' : ''}>
                <FontAwesomeIcon icon={faUsers} className="icon" />
                <span className="text">Customers</span>
              </MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/admin/approval" $isOpen={isOpen} className={activeLink === 'approval' ? 'active' : ''}>
                <FontAwesomeIcon icon={faUserCheck} className="icon" />
                <span className="text">Customer Approval</span>
              </MenuLink>
            </MenuItem>
            <MenuItem>
                <MenuLink to="/admin/interaction-approval" $isOpen={isOpen} className={activeLink === 'interaction-approval' ? 'active' : ''}>
                    <FontAwesomeIcon icon={faClipboardCheck} className="icon" />
                    <span className="text">Interaction Approval</span>
                </MenuLink>
            </MenuItem>
            <MenuItem>
                <MenuLink to="/admin/campaign-approval" $isOpen={isOpen} className={activeLink === 'campaign-approval' ? 'active' : ''}>
                    <FontAwesomeIcon icon={faPaperPlane} className="icon" />
                    <span className="text">Campaign Approval</span>
                </MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/admin/analytics" $isOpen={isOpen} className={activeLink === 'analytics' ? 'active' : ''}>
                <FontAwesomeIcon icon={faChartLine} className="icon" />
                <span className="text">Analytics</span>
              </MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/admin/campaigns" $isOpen={isOpen} className={activeLink === 'campaigns' ? 'active' : ''}>
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <span className="text">Email Campaigns</span>
              </MenuLink>
            </MenuItem>
            <MenuItem>
              <MenuLink to="/admin/settings" $isOpen={isOpen} className={activeLink === 'settings' ? 'active' : ''}>
                <FontAwesomeIcon icon={faCog} className="icon" />
                <span className="text">Settings</span>
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
            <Route path="/" element={<CustomerManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/approval" element={<CustomerApproval />} />
            <Route path="/interaction-approval" element={<InteractionApproval />} />
            <Route path="/campaign-approval" element={<CampaignApproval />} />
            <Route path="/analytics" element={<AdminAnalytics />} />
            <Route path="/campaigns" element={<EmailCampaigns />} />
            <Route path="/settings" element={<SystemSettings />} />
          </Routes>
        </Content>
      </DashboardContainer>
    );
};

export default AdminDashboard;