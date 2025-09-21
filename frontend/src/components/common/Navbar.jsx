import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faSignOutAlt, faHome, faAddressCard, faPhone } from '@fortawesome/free-solid-svg-icons';

const NavContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(0, 0, 0, 0.8);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    font-size: inherit;
    font-family: inherit;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
    &:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: ${({ $isOpen }) => ($isOpen ? '0' : '-100%')};
  width: 250px;
  height: 100vh;
  background-color: #1a1a1a;
  padding: 2rem;
  transition: left 0.3s ease;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MobileNavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;

  &:hover {
    color: #4a90e2;
  }
`;

const MobileLogoutButton = styled.button`
    background: none;
    border: none;
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    width: 100%;
    text-align: left;
    font-size: 1.1rem;

    &:hover {
        color: #4a90e2;
    }
`

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  z-index: 1000;
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    } else {
      setIsLoggedIn(false);
      setUserRole('');
    }
  }, [location.pathname]); // Re-check on route change

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserRole('');
    navigate('/');
  };

  return (
    <>
      <NavContainer>
        <Logo to="/">CRM Project</Logo>
        
        <NavLinks>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {!isLoggedIn ? (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          ) : (
            <>
              <NavLink to={userRole === 'admin' ? '/admin/customers' : '/customer/profile'}>Dashboard</NavLink>
              <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </>
          )}
        </NavLinks>
        
        <MobileMenuButton onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </MobileMenuButton>
      </NavContainer>
      
      <MobileMenu $isOpen={isOpen}>
        <CloseButton onClick={toggleMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
        
        <MobileNavLink to="/" onClick={toggleMenu}><FontAwesomeIcon icon={faHome} /> Home</MobileNavLink>
        <MobileNavLink to="/about" onClick={toggleMenu}><FontAwesomeIcon icon={faAddressCard} /> About</MobileNavLink>
        <MobileNavLink to="/contact" onClick={toggleMenu}><FontAwesomeIcon icon={faPhone} /> Contact</MobileNavLink>
        
        {!isLoggedIn ? (
          <>
            <MobileNavLink to="/login" onClick={toggleMenu}><FontAwesomeIcon icon={faUser} /> Login</MobileNavLink>
            <MobileNavLink to="/register" onClick={toggleMenu}><FontAwesomeIcon icon={faUser} /> Register</MobileNavLink>
          </>
        ) : (
          <>
            <MobileNavLink to={userRole === 'admin' ? '/admin/customers' : '/customer/profile'} onClick={toggleMenu}><FontAwesomeIcon icon={faUser} /> Dashboard</MobileNavLink>
            <MobileLogoutButton onClick={() => { toggleMenu(); handleLogout(); }}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</MobileLogoutButton>
          </>
        )}
      </MobileMenu>
      
      <Overlay $isOpen={isOpen} onClick={toggleMenu} />
    </>
  );
};

export default Navbar;

