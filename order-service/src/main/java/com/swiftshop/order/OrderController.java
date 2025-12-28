package com.swiftshop.order;

import com.swiftshop.order.model.Order;
import com.swiftshop.order.model.OrderStatus;
import com.swiftshop.order.repository.OrderRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // POST /api/orders
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderRepository.save(order);
    }

    // GET /api/orders/user/{userId}
    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        return orderRepository.findByUserId(userId);
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

}
