package com.swiftshop.order;

import com.swiftshop.order.model.Order;
import com.swiftshop.order.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class StripeController {

    private final OrderRepository orderRepository;

    @Value("${app.frontendUrl}")
    private String frontendUrl;

    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    public StripeController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PostMapping("/order-checkout-session")
    public Map<String, Object> createCheckoutSession(@RequestParam Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getTotalAmount() == null || order.getTotalAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order amount");
        }

        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Stripe secret key not configured");
        }

        // ✅ build checkout display name using items if available
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
                            .setSuccessUrl(frontendUrl + "/orders?success=1&orderId=" + order.getId())
                            .setCancelUrl(frontendUrl + "/cart?canceled=1&orderId=" + order.getId())
                            .addLineItem(
                                    SessionCreateParams.LineItem.builder()
                                            .setQuantity(1L)
                                            .setPriceData(
                                                    SessionCreateParams.LineItem.PriceData.builder()
                                                            .setCurrency("usd")
                                                            .setUnitAmount(amountInCents)
                                                            .setProductData(
                                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                            .setName(checkoutName) // ✅ here
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
                    "checkoutUrl", session.getUrl(),
                    "sessionId", session.getId(),
                    "orderId", order.getId()
            );
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Stripe error: " + e.getMessage()
            );
        }
    }
}
