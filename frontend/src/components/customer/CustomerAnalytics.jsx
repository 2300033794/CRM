// src/components/customer/CustomerAnalytics.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import api from '../../api';
import Swal from 'sweetalert2';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

// ... (Styled components are mostly unchanged, added some for layout) ...
const AnalyticsContainer = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
  border-bottom: 2px solid #4a90e2;
  padding-bottom: 10px;
`;
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;
const StatCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;
const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #4a90e2;
  margin-bottom: 10px;
`;
const StatLabel = styled.div`
  font-size: 1rem;
  color: #666;
`;
const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;
const Card = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
  height: 400px; /* Fixed height for consistent chart sizes */
`;
const CardTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.2rem;
  text-align: center;
`;
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #4a90e2;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CustomerAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await api.get(`/customers/${userId}/analytics`);
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        Swal.fire('Error', 'Failed to load analytics data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AnalyticsContainer>
        <PageTitle>Analytics Dashboard</PageTitle>
        <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
      </AnalyticsContainer>
    );
  }
  
  if (!analyticsData) {
    return (
      <AnalyticsContainer>
        <PageTitle>Analytics Dashboard</PageTitle>
        <p>Could not load analytics data. Please try again.</p>
      </AnalyticsContainer>
    )
  }

  // --- Prepare Chart Data ---
  
  // 1. Interaction Trend (Line Chart)
  const trendLabels = [];
  const trendDataPoints = [];
  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    const formattedDate = date.toISOString().split('T')[0];
    trendLabels.push(formattedDate);
    trendDataPoints.push(analyticsData.interactionTrend[formattedDate] || 0);
  }
  
  const interactionChartData = {
    labels: trendLabels,
    datasets: [{
      label: 'Interactions',
      data: trendDataPoints,
      fill: true,
      backgroundColor: 'rgba(74, 144, 226, 0.2)',
      borderColor: '#4a90e2',
      tension: 0.4
    }]
  };

  // 2. Interaction by Type (Doughnut Chart)
  const interactionTypeData = {
    labels: analyticsData.interactionsByType.map(item => item.type),
    datasets: [{
      label: 'Interaction Types',
      data: analyticsData.interactionsByType.map(item => item.count),
      backgroundColor: ['#4a90e2', '#2ecc71', '#9b59b6', '#e74c3c'],
      borderColor: ['#FFF'],
      borderWidth: 2
    }]
  };

  // --- Chart Options ---
  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: true, text: 'Your Interactions (Last 30 Days)' }},
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
  };
  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' }, title: { display: true, text: 'Interactions by Type' }}
  };
  
  return (
    <AnalyticsContainer>
      <PageTitle>Analytics Dashboard</PageTitle>
      
      <StatsGrid>
        <StatCard>
          <StatValue>{analyticsData.totalInteractions}</StatValue>
          <StatLabel>Total Interactions</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{analyticsData.submittedCampaignsCount}</StatValue>
          <StatLabel>Submitted Campaigns</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{analyticsData.approvedCampaignsCount}</StatValue>
          <StatLabel>Approved Campaigns</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <DashboardGrid>
        <Card>
          <CardTitle>Interaction Trend</CardTitle>
          <div style={{ height: '300px' }}>
            <Line data={interactionChartData} options={lineOptions} />
          </div>
        </Card>
        
        <Card>
          <CardTitle>Interaction Types</CardTitle>
           <div style={{ height: '300px' }}>
            <Doughnut data={interactionTypeData} options={doughnutOptions} />
          </div>
        </Card>
      </DashboardGrid>
    </AnalyticsContainer>
  );
};

export default CustomerAnalytics;