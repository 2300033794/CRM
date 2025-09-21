import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import api from '../../api';
import Swal from 'sweetalert2';

// **FIX**: Added missing styled component definitions
const Container = styled.div` padding: 20px; `;
const PageTitle = styled.h1`
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
  border-bottom: 2px solid #e74c3c;
  padding-bottom: 10px;
`;
const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
`;
const SettingsCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
`;
const CardTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
`;
const FormGroup = styled.div` margin-bottom: 15px; `;
const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
`;
const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  justify-content: flex-end;
`;
const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${props => props.$primary ? '#e74c3c' : '#7f8c8d'};
  color: white;
  .icon { margin-right: 8px; }
`;
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #e74c3c;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;


const SystemSettings = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [originalSettings, setOriginalSettings] = useState({});
  
  useEffect(() => {
    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/settings');
            const loadedSettings = {
                general: JSON.parse(response.data.generalSettings || '{}'),
                email: JSON.parse(response.data.emailSettings || '{}'),
                security: JSON.parse(response.data.securitySettings || '{}'),
            };
            setSettings(loadedSettings);
            setOriginalSettings(JSON.parse(JSON.stringify(loadedSettings))); // Deep copy
        } catch (error) {
            Swal.fire('Error', 'Failed to load system settings.', 'error');
        } finally {
            setLoading(false);
        }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (category, field, value) => {
    setSettings(prev => ({
        ...prev,
        [category]: {
            ...prev[category],
            [field]: value,
        }
    }));
  };

  const handleSave = async () => {
    try {
        const payload = {
            generalSettings: JSON.stringify(settings.general),
            emailSettings: JSON.stringify(settings.email),
            securitySettings: JSON.stringify(settings.security),
        };
        await api.put('/admin/settings', payload);
        Swal.fire('Success', 'Settings saved successfully!', 'success');
        setOriginalSettings(JSON.parse(JSON.stringify(settings)));
    } catch (error) {
        Swal.fire('Error', 'Failed to save settings.', 'error');
    }
  };

  const handleReset = () => {
    setSettings(JSON.parse(JSON.stringify(originalSettings)));
  };

  if (loading) {
    return (
      <Container>
        <PageTitle>System Settings</PageTitle>
        <LoadingSpinner><div className="spinner"></div></LoadingSpinner>
      </Container>
    );
  }
  
  return (
    <Container>
        <PageTitle>System Settings</PageTitle>
        <SettingsGrid>
            <SettingsCard>
                <CardTitle>General Settings</CardTitle>
                <FormGroup>
                    <Label>Company Name</Label>
                    <Input value={settings.general?.companyName || ''} onChange={e => handleInputChange('general', 'companyName', e.target.value)} />
                </FormGroup>
                 <FormGroup>
                    <Label>Support Email</Label>
                    <Input type="email" value={settings.general?.supportEmail || ''} onChange={e => handleInputChange('general', 'supportEmail', e.target.value)} />
                </FormGroup>
            </SettingsCard>
            
            <SettingsCard>
                <CardTitle>Security Settings</CardTitle>
                <FormGroup>
                    <Label>Session Timeout (minutes)</Label>
                    <Input type="number" value={settings.security?.sessionTimeout || ''} onChange={e => handleInputChange('security', 'sessionTimeout', e.target.value)} />
                </FormGroup>
            </SettingsCard>
        </SettingsGrid>
        <ButtonGroup>
            <Button onClick={handleReset}><FontAwesomeIcon icon={faUndo} className="icon" /> Reset</Button>
            <Button $primary onClick={handleSave}><FontAwesomeIcon icon={faSave} className="icon" /> Save Settings</Button>
        </ButtonGroup>
    </Container>
  );
};

export default SystemSettings;