import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import styled from 'styled-components';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/src/assets/images/crm-background.jpg');
  background-size: cover;
  background-position: center;
  color: white;
`;

const HeroSection = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: fadeIn 1s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  max-width: 800px;
  animation: fadeIn 1s ease-out 0.3s both;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  animation: fadeIn 1s ease-out 0.6s both;
`;

const Button = styled(Link)`
  padding: 12px 24px;
  background-color: #4a90e2;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #357abD;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

const Home = () => {
  return (
    <HomeContainer>
      <Navbar />
      <HeroSection>
        <Title>CRM Project</Title>
        <Subtitle>
          Streamline your customer relationships with our powerful CRM solution.
          Manage contacts, track interactions, and boost your business growth.
        </Subtitle>
        <ButtonContainer>
          <Button to="/register">Register Now</Button>
          <Button to="/login" style={{ backgroundColor: 'transparent', border: '2px solid white' }}>
            Login
          </Button>
        </ButtonContainer>
      </HeroSection>
    </HomeContainer>
  );
};

export default Home;