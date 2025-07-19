package com.arushr.rentreturn.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StripeService {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    public PaymentIntent createPaymentIntent(Long amountCents, String currency, String receiptEmail, Map<String, String> metadata) throws StripeException {
        PaymentIntentCreateParams.Builder paramsBuilder = PaymentIntentCreateParams.builder()
                .setAmount(amountCents)
                .setCurrency(currency)
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
                );
        if (receiptEmail != null) {
            paramsBuilder.setReceiptEmail(receiptEmail);
        }
        if (metadata != null) {
            paramsBuilder.putAllMetadata(metadata);
        }
        return PaymentIntent.create(paramsBuilder.build());
    }

    public com.stripe.model.Event constructEventFromPayload(String payload, String sigHeader, String endpointSecret) throws StripeException {
        return Webhook.constructEvent(payload, sigHeader, endpointSecret);
    }
} 