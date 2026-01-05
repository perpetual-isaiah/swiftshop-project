package com.swiftshop.order;

import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    // DTO classes for cart checkout
    public static class CartItem {
        private Long id;
        private String name;
        private Double price;
        private Integer quantity;
        private String image;

        // Getters and setters
        public Long getId() { 
            return id; 
        }
        
        public void setId(Long id) { 
            this.id = id; 
        }
        
        public String getName() { 
            return name; 
        }
        
        public void setName(String name) { 
            this.name = name; 
        }
        
        public Double getPrice() { 
            return price; 
        }
        
        public void setPrice(Double price) { 
            this.price = price; 
        }
        
        public Integer getQuantity() { 
            return quantity; 
        }
        
        public void setQuantity(Integer quantity) { 
            this.quantity = quantity; 
        }
        
        public String getImage() { 
            return image; 
        }
        
        public void setImage(String image) { 
            this.image = image; 
        }
    }

    public static class CheckoutSessionRequest {
        private List<CartItem> items;
        private Double totalAmount;
        private String currency = "usd";
        private String successUrl;
        private String cancelUrl;

        // Getters and setters
        public List<CartItem> getItems() { 
            return items; 
        }
        
        public void setItems(List<CartItem> items) { 
            this.items = items; 
        }
        
        public Double getTotalAmount() { 
            return totalAmount; 
        }
        
        public void setTotalAmount(Double totalAmount) { 
            this.totalAmount = totalAmount; 
        }
        
        public String getCurrency() { 
            return currency; 
        }
        
        public void setCurrency(String currency) { 
            this.currency = currency; 
        }
        
        public String getSuccessUrl() { 
            return successUrl; 
        }
        
        public void setSuccessUrl(String successUrl) { 
            this.successUrl = successUrl; 
        }
        
        public String getCancelUrl() { 
            return cancelUrl; 
        }
        
        public void setCancelUrl(String cancelUrl) { 
            this.cancelUrl = cancelUrl; 
        }
    }

    /**
     * NEW ENDPOINT: Create Stripe Checkout Session with cart items
     * POST /api/payments/checkout-session
     * 
     * This endpoint is called by the Cart component when user clicks "Proceed to Checkout"
     * 
     * Expected request body:
     * {
     *   "items": [
     *     {"id": 1, "name": "Product 1", "price": 29.99, "quantity": 2, "image": "url"},
     *     {"id": 2, "name": "Product 2", "price": 15.50, "quantity": 1, "image": "url"}
     *   ],
     *   "totalAmount": 75.48,
     *   "currency": "usd",
     *   "successUrl": "http://localhost:3000/orders?success=1",
     *   "cancelUrl": "http://localhost:3000/cart?canceled=1"
     * }
     * 
     * Response:
     * {
     *   "success": true,
     *   "url": "https://checkout.stripe.com/...",
     *   "sessionId": "cs_test_..."
     * }
     */
    @PostMapping("/checkout-session")
    public ResponseEntity<?> createCheckoutSession(@RequestBody CheckoutSessionRequest request) {
        try {
            System.out.println("🔵 Creating Stripe checkout session");
            System.out.println("   Items count: " + (request.getItems() != null ? request.getItems().size() : 0));
            System.out.println("   Total amount: $" + request.getTotalAmount());

            // Validate request
            if (request.getItems() == null || request.getItems().isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("error", "No items in cart");
                return ResponseEntity.badRequest().body(error);
            }

            // Build line items for Stripe Checkout
            List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
            
            for (CartItem item : request.getItems()) {
                System.out.println("   - " + item.getName() + 
                                 " x" + item.getQuantity() + 
                                 " @ $" + item.getPrice());
                
                // Build product data
                SessionCreateParams.LineItem.PriceData.ProductData.Builder productBuilder =
                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                        .setName(item.getName());
                
                // Add product image if available
                if (item.getImage() != null && !item.getImage().isEmpty()) {
                    productBuilder.addImage(item.getImage());
                }

                // Build price data (Stripe requires price in cents)
                SessionCreateParams.LineItem.PriceData priceData =
                    SessionCreateParams.LineItem.PriceData.builder()
                        .setCurrency(request.getCurrency() != null ? request.getCurrency() : "usd")
                        .setUnitAmount((long) (item.getPrice() * 100)) // Convert dollars to cents
                        .setProductData(productBuilder.build())
                        .build();

                // Build line item
                SessionCreateParams.LineItem lineItem =
                    SessionCreateParams.LineItem.builder()
                        .setPriceData(priceData)
                        .setQuantity(item.getQuantity().longValue())
                        .build();

                lineItems.add(lineItem);
            }

            // Create Stripe Checkout Session parameters
            SessionCreateParams params =
                SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(request.getSuccessUrl() != null ? 
                        request.getSuccessUrl() : "http://localhost:3000/orders?success=1")
                    .setCancelUrl(request.getCancelUrl() != null ? 
                        request.getCancelUrl() : "http://localhost:3000/cart?canceled=1")
                    .addAllLineItem(lineItems)
                    .build();

            // Create the session with Stripe
            Session session = Session.create(params);

            System.out.println("✅ Stripe checkout session created successfully");
            System.out.println("   Session ID: " + session.getId());
            System.out.println("   Redirect URL: " + session.getUrl());

            // Build success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("url", session.getUrl());
            response.put("sessionId", session.getId());

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            System.err.println("❌ Stripe API error: " + e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Stripe error: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
            
        } catch (Exception e) {
            System.err.println("❌ Payment processing error: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Payment processing error: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * EXISTING ENDPOINT: Simple checkout with order ID and amount
     * POST /api/payments/checkout
     * 
     * This is your original checkout endpoint (kept for backward compatibility)
     * 
     * Expected request body:
     * {
     *   "orderId": 123,
     *   "amount": 99.99
     * }
     * 
     * Response:
     * {
     *   "url": "https://checkout.stripe.com/..."
     * }
     */
    @PostMapping("/checkout")
    public Map<String, String> createCheckoutSession(@RequestBody Map<String, Object> payload)
            throws StripeException {

        System.out.println("🔵 Creating simple checkout session");
        
        Long orderId = Long.valueOf(payload.get("orderId").toString());
        Double amount = Double.valueOf(payload.get("amount").toString());

        System.out.println("   Order ID: " + orderId);
        System.out.println("   Amount: $" + amount);

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:3000/orders?success=true")
                        .setCancelUrl("http://localhost:3000/cart?cancelled=true")
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount((long) (amount * 100)) // cents
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName("Order #" + orderId)
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .build();

        Session session = Session.create(params);

        System.out.println("✅ Stripe checkout session created");
        System.out.println("   Session ID: " + session.getId());

        return Map.of("url", session.getUrl());
    }
}