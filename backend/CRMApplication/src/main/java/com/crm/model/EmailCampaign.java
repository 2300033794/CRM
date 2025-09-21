package com.crm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class EmailCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String subject;
    private String status; // e.g., 'draft', 'sent', 'scheduled'
    private Integer recipients;
    private Integer openRate;
    private Integer clickRate;
    private LocalDateTime createdAt;
    private LocalDateTime sentAt;
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getRecipients() { return recipients; }
    public void setRecipients(Integer recipients) { this.recipients = recipients; }
    public Integer getOpenRate() { return openRate; }
    public void setOpenRate(Integer openRate) { this.openRate = openRate; }
    public Integer getClickRate() { return clickRate; }
    public void setClickRate(Integer clickRate) { this.clickRate = clickRate; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}