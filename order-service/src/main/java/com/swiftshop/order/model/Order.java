package com.swiftshop.order.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Mongo-compatible user ID
    private String userId;

    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private LocalDateTime createdAt;

    public Order() {
        this.createdAt = LocalDateTime.now();
        this.status = OrderStatus.CREATED;
    }

    public Order(String userId, Double totalAmount) {
        this.userId = userId;
        this.totalAmount = totalAmount;
        this.createdAt = LocalDateTime.now();
        this.status = OrderStatus.CREATED;
    }

    public Long getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ✅ setters (important for POST requests)
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
