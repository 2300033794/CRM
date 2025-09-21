import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const PageContainer = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const ContactContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #343a40;
  margin-bottom: 20px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 50px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const InfoCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const Icon = styled.div`
  font-size: 2.5rem;
  color: #e74c3c;
  margin-bottom: 15px;
`;

const InfoTitle = styled.h3`
  font-size: 1.25rem;
  color: #343a40;
  margin-bottom: 10px;
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
`;

const Contact = () => {
  return (
    <PageContainer>
      <Navbar />
      <ContactContainer>
        <Title>Get In Touch</Title>
        <Subtitle>We'd love to hear from you. Here's how you can reach us.</Subtitle>
        <InfoGrid>
          <InfoCard>
            <Icon><FontAwesomeIcon icon={faMapMarkerAlt} /></Icon>
            <InfoTitle>Our Office</InfoTitle>
            <InfoText>123 CRM Lane, Business City, 522502</InfoText>
          </InfoCard>
          <InfoCard>
            <Icon><FontAwesomeIcon icon={faEnvelope} /></Icon>
            <InfoTitle>Email Us</InfoTitle>
            <InfoText>support@crmproject.com</InfoText>
          </InfoCard>
          <InfoCard>
            <Icon><FontAwesomeIcon icon={faPhone} /></Icon>
            <InfoTitle>Call Us</InfoTitle>
            <InfoText>+91 (800) 555-0199</InfoText>
          </InfoCard>
        </InfoGrid>
      </ContactContainer>
    </PageContainer>
  );
};

export default Contact;

