package com.crm.repository;

import com.crm.model.Interaction;
import com.crm.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface InteractionRepository extends JpaRepository<Interaction, Long> {

    // Finds all interactions for a specific customer with pagination
    Page<Interaction> findByCustomer(User customer, Pageable pageable);

    // Finds interactions of a specific type for a customer with pagination
    Page<Interaction> findByCustomerAndType(User customer, String type, Pageable pageable);

    // Efficiently count interactions for a specific customer
    long countByCustomer(User customer);

    // Search interactions by type and a search term (subject or notes)
    @Query("SELECT i FROM Interaction i WHERE i.customer = :customer AND i.type = :type AND (i.subject LIKE %:searchTerm% OR i.notes LIKE %:searchTerm%)")
    Page<Interaction> findByCustomerAndTypeContaining(@Param("customer") User customer, @Param("type") String type, @Param("searchTerm") String searchTerm, Pageable pageable);

    // Search all interactions for a customer by a search term (subject or notes)
    @Query("SELECT i FROM Interaction i WHERE i.customer = :customer AND (i.subject LIKE %:searchTerm% OR i.notes LIKE %:searchTerm%)")
    Page<Interaction> findByCustomerContaining(@Param("customer") User customer, @Param("searchTerm") String searchTerm, Pageable pageable);

    // Analytics query to count interactions by type
    @Query("SELECT i.type as type, COUNT(i) as count FROM Interaction i WHERE i.customer = :customer GROUP BY i.type")
    List<Map<String, Object>> countInteractionsByType(@Param("customer") User customer);

    // Analytics query to count interactions per day within a date range
    @Query("SELECT FUNCTION('DATE', i.date), COUNT(i) FROM Interaction i WHERE i.customer = :customer AND i.date >= :startDate GROUP BY FUNCTION('DATE', i.date) ORDER BY FUNCTION('DATE', i.date) ASC")
    List<Object[]> countInteractionsPerDay(@Param("customer") User customer, @Param("startDate") LocalDateTime startDate);

    // Method to find interactions by status for the admin approval page
    Page<Interaction> findByStatus(String status, Pageable pageable);

    // Method to delete interactions when a customer is deleted
    @Modifying
    @Query("DELETE FROM Interaction i WHERE i.customer.id = :customerId")
    void deleteByCustomerId(@Param("customerId") Long customerId);
}
