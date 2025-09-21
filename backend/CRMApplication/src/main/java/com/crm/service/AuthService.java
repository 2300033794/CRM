package com.crm.service;

import com.crm.dto.AuthRequest;
import com.crm.dto.AuthResponse;
import com.crm.dto.UserDto;
import com.crm.model.User;

/**
 * Service interface for handling authentication logic,
 * such as user registration and login.
 */
public interface AuthService {

    /**
     * Registers a new user in the system.
     * @param userDto DTO containing the new user's information.
     * @return The created User entity.
     */
    User registerUser(UserDto userDto);

    /**
     * Authenticates a user and generates a JWT token upon successful login.
     * @param authRequest DTO containing the user's login credentials.
     * @return An AuthResponse containing the JWT token and user ID.
     */
    AuthResponse login(AuthRequest authRequest);
}