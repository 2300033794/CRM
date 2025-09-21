package com.crm.dto;

import java.time.LocalDateTime;

public class UserDto {
    private Long id;
    private String username;
    private String password; // Added for registration
    private String email;
    private Integer age;
    private String adharCard;
    private String address;
    private String phone;
    private String status;
    private LocalDateTime joinDate;
    
    // Admin fields
    private String department;
    private String position;
    private String bio;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getAdharCard() { return adharCard; }
    public void setAdharCard(String adharCard) { this.adharCard = adharCard; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getJoinDate() { return joinDate; }
    public void setJoinDate(LocalDateTime joinDate) { this.joinDate = joinDate; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}