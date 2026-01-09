package com.swiftshop.order;

import com.swiftshop.order.model.Order;
import com.swiftshop.order.model.OrderStatus;
import com.swiftshop.order.repository.OrderRepository;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import org.springframework.beans.factory.annotation.Value;
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

    @Value("${app.frontendUrl}")
    private String frontendUrl;

    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {

        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.CREATED);
        }
        if (order.getCreatedAt() == null) {
            order.setCreatedAt(LocalDateTime.now());
        }

        // ✅ if items exist, validate + compute totals + link FK
        double total = 0.0;

        if (order.getItems() != null && !order.getItems().isEmpty()) {
            int i = 0;
            for (var item : order.getItems()) {
                item.setOrder(order);

                // Fail fast with 400 instead of letting DB throw 500
                if (item.getProductName() == null || item.getProductName().isBlank()) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "Order item[" + i + "] is missing productName"
                    );
                }

                double price = item.getUnitPrice() != null ? item.getUnitPrice() : 0.0;
                int qty = item.getQuantity() != null ? item.getQuantity() : 0;

                double subtotal = price * qty;
                item.setSubtotal(subtotal);

                total += subtotal;
                i++;
            }
            order.setTotalAmount(total);
        } else {
            // fallback: keep whatever totalAmount was sent
            if (order.getTotalAmount() == null) order.setTotalAmount(0.0);
        }

        Order saved = orderRepository.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        // ⭐ Use the new method with eager fetching
        return orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    @GetMapping("/user/{userId}")
    public List<Order> getOrdersByUser(@PathVariable String userId) {
        // ⭐ This now uses JOIN FETCH automatically
        return orderRepository.findByUserId(userId);
    }

    @GetMapping("/health")
    public String health() {
        return "Order Service is healthy";
    }

    @PutMapping("/{id}/pay")
    public Map<String, String> payOrder(@PathVariable Long id) {
        // ⭐ Use the new method with eager fetching
        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getStatus() == OrderStatus.PAID) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order already paid");
        }

        if (order.getTotalAmount() == null || order.getTotalAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order total");
        }

        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Stripe secret key not configured");
        }

        // ✅ Show item name in Stripe if available
        String checkoutName = "SwiftShop Order #" + order.getId();
        if (order.getItems() != null && !order.getItems().isEmpty()) {
            var first = order.getItems().get(0);
            int count = order.getItems().size();
            checkoutName = (count == 1)
                    ? first.getProductName()
                    : first.getProductName() + " + " + (count - 1) + " more";
        }

        long amountInCents = Math.round(order.getTotalAmount() * 100);

        try {
            Stripe.apiKey = stripeSecretKey;

            SessionCreateParams params =
                    SessionCreateParams.builder()
                            .setMode(SessionCreateParams.Mode.PAYMENT)
                            .setSuccessUrl(frontendUrl + "/payment/success?orderId=" + order.getId() + "&session_id={CHECKOUT_SESSION_ID}")
                            .setCancelUrl(frontendUrl + "/orders?canceled=1")
                            .addLineItem(
                                    SessionCreateParams.LineItem.builder()
                                            .setQuantity(1L)
                                            .setPriceData(
                                                    SessionCreateParams.LineItem.PriceData.builder()
                                                            .setCurrency("usd")
                                                            .setUnitAmount(amountInCents)
                                                            .setProductData(
                                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                            .setName(checkoutName)
                                                                            .build()
                                                            )
                                                            .build()
                                            )
                                            .build()
                            )
                            .putMetadata("orderId", order.getId().toString())
                            .build();

            Session session = Session.create(params);

            return Map.of(
                    "url", session.getUrl(),
                    "sessionId", session.getId()
            );

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Stripe error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/invoice")
    public Map<String, Object> getInvoice(@PathVariable Long id) {
        // ⭐ Use the new method with eager fetching
        Order order = orderRepository.findByIdWithItems(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        Map<String, Object> invoice = new HashMap<>();
        invoice.put("invoiceNumber", "INV-" + order.getId());
        invoice.put("orderId", order.getId());
        invoice.put("userId", order.getUserId());
        invoice.put("amount", order.getTotalAmount());
        invoice.put("status", order.getStatus().name());
        invoice.put("createdAt", order.getCreatedAt() != null ? order.getCreatedAt().toString() : null);
        invoice.put("issuedAt", LocalDateTime.now().toString());
        invoice.put("items", order.getItems());  // ⭐ Added items to invoice

        return invoice;
    }
}