package com.swiftshop.order.webhook;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.swiftshop.order.model.Order;
import com.swiftshop.order.model.OrderStatus;
import com.swiftshop.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
public class StripeWebhookController {

    private final OrderRepository orderRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

   @Value("${stripe.webhook-secret:}")
    private String webhookSecret;

    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    public StripeWebhookController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader
    ) {
        try {
            // Basic config checks
            if (webhookSecret == null || webhookSecret.isBlank()) {
                System.out.println("❌ STRIPE_WEBHOOK_SECRET is missing");
                return ResponseEntity.status(500).body("Webhook secret not configured");
            }
            if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
                System.out.println("❌ STRIPE_SECRET_KEY is missing");
                return ResponseEntity.status(500).body("Stripe secret key not configured");
            }
            if (sigHeader == null || sigHeader.isBlank()) {
                System.out.println("❌ Missing Stripe-Signature header");
                return ResponseEntity.status(400).body("Missing signature");
            }

            // 1) Verify signature
            Event event;
            try {
                event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            } catch (SignatureVerificationException e) {
                System.out.println("❌ Invalid Stripe signature: " + e.getMessage());
                return ResponseEntity.status(400).body("Invalid signature");
            }

            System.out.println("✅ Verified event type: " + event.getType());

            // 2) Only handle successful checkout
            if (!"checkout.session.completed".equals(event.getType())) {
                return ResponseEntity.ok("ignored");
            }

            // 3) Extract session id from RAW JSON payload (reliable)
            JsonNode root = objectMapper.readTree(payload);
            String sessionId = root.path("data").path("object").path("id").asText(null);

            if (sessionId == null || sessionId.isBlank()) {
                System.out.println("❌ Could not read session id from payload");
                return ResponseEntity.status(400).body("Missing session id");
            }

            System.out.println("✅ Session ID from payload: " + sessionId);

            // 4) Retrieve the real session from Stripe (ensures metadata exists)
            Stripe.apiKey = stripeSecretKey;
            Session session = Session.retrieve(sessionId);

            String orderId = (session.getMetadata() != null)
                    ? session.getMetadata().get("orderId")
                    : null;

            System.out.println("✅ orderId from metadata: " + orderId);

            if (orderId == null || orderId.isBlank()) {
                System.out.println("❌ Missing orderId in session metadata");
                return ResponseEntity.status(400).body("Missing orderId metadata");
            }

            // 5) Update order status (idempotent)
            Order order = orderRepository.findById(Long.valueOf(orderId)).orElse(null);
            if (order == null) {
                System.out.println("❌ Order not found: " + orderId);
                return ResponseEntity.status(400).body("Order not found");
            }

            if (order.getStatus() != OrderStatus.PAID) {
                order.setStatus(OrderStatus.PAID);
                orderRepository.save(order);
                System.out.println("✅ Order marked PAID: " + order.getId());
            } else {
                System.out.println("ℹ️ Order already PAID: " + order.getId());
            }

            return ResponseEntity.ok("ok");

        } catch (Exception e) {
            System.out.println("❌ Webhook error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Webhook handler error");
        }
    }
}
