package com.crm.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "system_settings")
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String generalSettings;

    @Lob
    private String emailSettings;

    @Lob
    private String securitySettings;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGeneralSettings() {
        return generalSettings;
    }

    public void setGeneralSettings(String generalSettings) {
        this.generalSettings = generalSettings;
    }

    public String getEmailSettings() {
        return emailSettings;
    }

    public void setEmailSettings(String emailSettings) {
        this.emailSettings = emailSettings;
    }

    public String getSecuritySettings() {
        return securitySettings;
    }

    public void setSecuritySettings(String securitySettings) {
        this.securitySettings = securitySettings;
    }
}