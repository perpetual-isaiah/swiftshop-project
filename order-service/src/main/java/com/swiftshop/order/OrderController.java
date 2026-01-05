package com.swiftshop.order;

import com.swiftshop.order.model.Order;
import com.swiftshop.order.model.OrderStatus;
import com.swiftshop.order.repository.OrderRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // POST /api/orders
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {

        // Ensure defaults in case frontend sends null
        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.CREATED);
        }
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(LocalDateTime.now());
        }

        Order saved = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // GET /api/orders/{id}
    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"
                ));
    }

    // GET /api/orders/user/{userId}
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable String userId) {
        return orderRepository.findByUserId(userId);
    }

    // GET /api/orders/health
    @GetMapping("/health")
    public String health() {
        return "Order Service is healthy";
    }

    // PUT /api/orders/{id}/pay
    @PutMapping("/{id}/pay")
    public Order payOrder(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"
                ));

        order.setStatus(OrderStatus.PAID);
        return orderRepository.save(order);
    }

    // GET /api/orders/{id}/invoice
    @GetMapping("/{id}/invoice")
    public Map<String, Object> getInvoice(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"
                ));

        Map<String, Object> invoice = new HashMap<>();
        invoice.put("invoiceNumber", "INV-" + order.getId());
        invoice.put("orderId", order.getId());
        invoice.put("userId", order.getUserId());
        invoice.put("amount", order.getTotalAmount());
        invoice.put("status", order.getStatus().name());
        invoice.put("createdAt", order.getCreatedAt() != null ? order.getCreatedAt().toString() : null);
        invoice.put("issuedAt", LocalDateTime.now().toString());

        // optional: only add paidAt if it’s paid
        if (order.getStatus() == OrderStatus.PAID) {
            invoice.put("paidAt", LocalDateTime.now().toString());
        }

        return invoice;
    }
}
