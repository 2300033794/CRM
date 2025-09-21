package com.crm.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Interaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    private String type; // e.g., 'call', 'email', 'meeting'
    private String subject;
    private LocalDateTime date;
    private String status; // e.g., 'completed', 'scheduled', 'pending'
    
    @Lob
    private String notes;

    // **NEW**: Add this empty constructor for JPA
    public Interaction() {
    }

    // **NEW**: Add this constructor for the DataSeeder
    public Interaction(User customer, String type, String subject, LocalDateTime date, String status, String notes) {
        this.customer = customer;
        this.type = type;
        this.subject = subject;
        this.date = date;
        this.status = status;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}