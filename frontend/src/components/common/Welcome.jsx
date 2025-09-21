import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const WelcomeContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: ${fadeIn} 1s ease-out, ${pulse} 2s infinite 1s;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  opacity: 0;
  animation: ${fadeIn} 1s ease-out 0.5s forwards;
`;

const Welcome = () => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <WelcomeContainer>
      <Title>Welcome to CRM Project</Title>
      <Subtitle>Your complete customer relationship management solution</Subtitle>
    </WelcomeContainer>
  );
};

export default Welcome;