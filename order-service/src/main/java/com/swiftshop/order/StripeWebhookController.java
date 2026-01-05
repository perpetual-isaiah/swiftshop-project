package com.swiftshop.order;

import com.swiftshop.order.model.Order;
import com.swiftshop.order.model.OrderStatus;
import com.swiftshop.order.repository.OrderRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
public class StripeWebhookController {

    @Value("${stripe.webhookSecret}")
    private String webhookSecret;

    private final OrderRepository orderRepository;

    public StripeWebhookController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Stripe sends raw JSON here
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) throws SignatureVerificationException {

        Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

        // Checkout payment successful
        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElse(null);

            if (session != null) {
                String orderIdStr = session.getMetadata().get("orderId");
                if (orderIdStr != null) {
                    Long orderId = Long.valueOf(orderIdStr);
                    Optional<Order> opt = orderRepository.findById(orderId);
                    if (opt.isPresent()) {
                        Order order = opt.get();
                        order.setStatus(OrderStatus.PAID);
                        orderRepository.save(order);
                    }
                }
            }
        }

        return ResponseEntity.ok("ok");
    }
}
