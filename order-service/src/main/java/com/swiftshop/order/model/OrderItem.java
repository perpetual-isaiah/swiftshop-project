package com.swiftshop.order.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    @JsonBackReference
    private Order order;

    private Long productId;      // ✅ Can be null (it's just a reference)
    private String productName;  // ✅ This is what matters for display
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;

    // Constructors
    public OrderItem() {}

    // Getters
    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public Integer getQuantity() { return quantity; }
    public Double getUnitPrice() { return unitPrice; }
    public Double getSubtotal() { return subtotal; }

    // Setters
    public void setOrder(Order order) { this.order = order; }
    public void setProductId(Long productId) { this.productId = productId; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
}
