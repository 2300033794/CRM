// src/components/auth/Register.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import Navbar from '../common/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faEnvelope, 
  faCalendarAlt, 
  faIdCard, 
  faMapMarkerAlt,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const RegisterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/src/assets/images/register-background.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
`;
const RegisterContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;
const RegisterCard = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
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
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const FormGroup = styled.div`
  position: relative;
  flex: 1;
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
const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: #4a90e2;
    outline: none;
  }
`;
const Icon = styled.span`
  position: absolute;
  left: 12px;
  top: ${props => props.textarea ? '20px' : '50%'};
  transform: ${props => props.textarea ? 'none' : 'translateY(-50%)'};
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
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;
const LoginLink = styled.p`
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
const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  padding-left: 40px;
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    adharCard: '',
    address: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
        newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.age) {
        newErrors.age = 'Age is required';
    } else if (isNaN(formData.age) || parseInt(formData.age) < 18) {
        newErrors.age = 'You must be at least 18 years old';
    }
    if (!formData.adharCard.trim()) {
        newErrors.adharCard = 'Aadhar Card number is required';
    } else if (!/^\d{12}$/.test(formData.adharCard)) {
        newErrors.adharCard = 'Aadhar Card must be 12 digits';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/auth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        adharCard: formData.adharCard,
        address: formData.address,
        phone: formData.phone
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Registration Submitted!',
        text: `You are registered to the Customer Management System. Your account is pending admin approval and a notification will be sent to: ${formData.email}`,
      }).then(() => {
        navigate('/login');
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.response?.data?.message || 'An error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <Navbar />
      <RegisterContent>
        <RegisterCard>
          <Title>Customer Registration</Title>
          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Icon><FontAwesomeIcon icon={faUser} /></Icon>
                <Input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
                {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Icon><FontAwesomeIcon icon={faCalendarAlt} /></Icon>
                <Input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
                {errors.age && <ErrorMessage>{errors.age}</ErrorMessage>}
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Icon><FontAwesomeIcon icon={faEnvelope} /></Icon>
              <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            <FormRow>
                <FormGroup>
                    <Icon><FontAwesomeIcon icon={faIdCard} /></Icon>
                    <Input type="text" name="adharCard" placeholder="Aadhar Card Number" value={formData.adharCard} onChange={handleChange} />
                    {errors.adharCard && <ErrorMessage>{errors.adharCard}</ErrorMessage>}
                </FormGroup>
                <FormGroup>
                    <Icon><FontAwesomeIcon icon={faPhone} /></Icon>
                    <Input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                </FormGroup>
            </FormRow>
            <FormGroup>
              <Icon textarea><FontAwesomeIcon icon={faMapMarkerAlt} /></Icon>
              <TextArea name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
              {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
            </FormGroup>
            <FormRow>
              <FormGroup>
                <Icon><FontAwesomeIcon icon={faLock} /></Icon>
                <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Icon><FontAwesomeIcon icon={faLock} /></Icon>
                <Input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
              </FormGroup>
            </FormRow>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </Form>
          <LoginLink>
            Already have an account? <Link to="/login">Login here</Link>
          </LoginLink>
        </RegisterCard>
      </RegisterContent>
    </RegisterContainer>
  );
};

export default Register;