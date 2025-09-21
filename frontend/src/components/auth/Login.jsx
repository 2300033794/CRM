// src/components/auth/Login.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import Navbar from '../common/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faUserShield } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const LoginContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/src/assets/images/login-background.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
`;

const LoginContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const LoginCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ddd;
`;

const Tab = styled.button`
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? 'bold' : 'normal')};
  color: ${({ $active }) => ($active ? '#4a90e2' : '#666')};
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${({ $active }) => ($active ? '#4a90e2' : 'transparent')};
    transition: background-color 0.3s ease;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #4a90e2;
    outline: none;
  }
`;

const Icon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #357abD;
  }
  
  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const RegisterLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;

  a {
    color: #4a90e2;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [activeTab, setActiveTab] = useState('customer');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({ icon: 'error', title: 'Validation Error', text: 'Please enter both username and password' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/login`, {
        username,
        password,
        role: activeTab
      });

      const { token, userId } = response.data;
      
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('role', activeTab);
      sessionStorage.setItem('userId', userId);
      
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome back, ${username}!`,
        timer: 1500,
        showConfirmButton: false
      });
      
      navigate(activeTab === 'admin' ? '/admin/customers' : '/customer/profile');

    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.response?.data?.message || 'Invalid credentials or role. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Navbar />
      <LoginContent>
        <LoginCard>
          <Title>Login to CRM</Title>
          <Tabs>
            <Tab $active={activeTab === 'customer'} onClick={() => setActiveTab('customer')}>Customer Login</Tab>
            <Tab $active={activeTab === 'admin'} onClick={() => setActiveTab('admin')}>Admin Login</Tab>
          </Tabs>
      
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Icon><FontAwesomeIcon icon={activeTab === 'admin' ? faUserShield : faUser} /></Icon>
              <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </FormGroup>
            <FormGroup>
              <Icon><FontAwesomeIcon icon={faLock} /></Icon>
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </FormGroup>
            <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
          </Form>
          {activeTab === 'customer' && (
            <RegisterLink>Don't have an account? <Link to="/register">Register here</Link></RegisterLink>
          )}
        </LoginCard>
      </LoginContent>
    </LoginContainer>
  );
};

export default Login;