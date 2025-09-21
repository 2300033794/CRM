import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faHome } from '@fortawesome/free-solid-svg-icons';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 0 20px;
`;

const ErrorIcon = styled.div`
  font-size: 5rem;
  color: #e74c3c;
  margin-bottom: 20px;
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const ErrorMessage = styled.h2`
  font-size: 2rem;
  color: #555;
  margin: 10px 0 30px;
`;

const ErrorDescription = styled.p`
  font-size: 1.2rem;
  color: #777;
  max-width: 600px;
  margin-bottom: 30px;
`;

const HomeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  background-color: #e74c3c;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #c0392b;
  }
  
  .icon {
    margin-right: 10px;
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <ErrorIcon>
        <FontAwesomeIcon icon={faExclamationTriangle} />
      </ErrorIcon>
      <ErrorCode>404</ErrorCode>
      <ErrorMessage>Page Not Found</ErrorMessage>
      <ErrorDescription>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </ErrorDescription>
      <HomeButton to="/">
        <FontAwesomeIcon icon={faHome} className="icon" />
        Back to Home
      </HomeButton>
    </NotFoundContainer>
  );
};

export default NotFound;