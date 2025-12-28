package com.swiftshop.order;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    public OrderController() {
        System.out.println("========================================");
        System.out.println("OrderController has been created!");
        System.out.println("========================================");
    }

    // GET /api/orders
    @GetMapping
    public ResponseEntity<String> home() {
        System.out.println("Home endpoint called!");
        return ResponseEntity.ok("Order Service is running!");
    }

    // GET /api/orders/health
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        System.out.println("Health endpoint called!");
        return ResponseEntity.ok("Order Service is healthy!");
    }
}
