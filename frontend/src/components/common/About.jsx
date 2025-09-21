import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';

const PageContainer = styled.div`
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const AboutContainer = styled.div`
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

const Subtitle = styled.h2`
  font-size: 1.5rem;
  color: #e74c3c;
  margin-bottom: 30px;
  font-weight: 500;
`;

const Content = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  line-height: 1.8;
  text-align: justify;
`;

const About = () => {
  return (
    <PageContainer>
      <Navbar />
      <AboutContainer>
        <Title>About Our CRM</Title>
        <Subtitle>Your Partner in Building Lasting Customer Relationships</Subtitle>
        <Content>
          Welcome to the CRM Project, an intuitive and powerful Customer Relationship Management platform designed to empower your business. Our mission is to provide a seamless, integrated solution that helps you manage customer interactions, streamline sales processes, and ultimately, drive growth. We believe that at the heart of every successful business is a strong customer relationship, and our tools are built to help you foster just that. From managing contacts to tracking analytics and launching effective email campaigns, our CRM is your all-in-one solution for success.
        </Content>
      </AboutContainer>
    </PageContainer>
  );
};

export default About;