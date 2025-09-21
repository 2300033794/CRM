package com.crm.repository;

import com.crm.model.Role;
import com.crm.model.User;
import com.crm.model.User.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);

    Page<User> findByRole(Role role, Pageable pageable);

    Page<User> findByRoleAndStatus(Role role, UserStatus status, Pageable pageable);
    
    long countByRole(Role role);

    long countByRoleAndStatus(Role role, UserStatus status);

    // **NEW**: Analytics query to count new customers by month
    @Query("SELECT FUNCTION('YEAR', u.joinDate) as year, FUNCTION('MONTH', u.joinDate) as month, COUNT(u.id) as count " +
           "FROM User u WHERE u.role = com.crm.model.Role.ROLE_CUSTOMER " +
           "GROUP BY year, month ORDER BY year, month")
    List<Object[]> countCustomersByMonth();
}
