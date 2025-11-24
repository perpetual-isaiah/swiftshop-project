package com.swiftshop.order;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
public class OrderController {
    
    public OrderController() {
        System.out.println("========================================");
        System.out.println("OrderController has been created!");
        System.out.println("========================================");
    }
    
    @GetMapping("/")
    public ResponseEntity<String> home() {
        System.out.println("Home endpoint called!");
        return ResponseEntity.ok("Order Service is running!");
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        System.out.println("Health endpoint called!");
        return ResponseEntity.ok("Order Service is healthy!");
    }
    
    @GetMapping("/favicon.ico")
    public ResponseEntity<Void> favicon() {
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}