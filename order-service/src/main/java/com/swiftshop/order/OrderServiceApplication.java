package com.swiftshop.order;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class OrderServiceApplication {

    public static void main(String[] args) {
        new SpringApplicationBuilder(OrderServiceApplication.class)
                .web(WebApplicationType.SERVLET)
                .run(args);
    }
}
