Send OTP:

    Endpoint: POST /send-otp
    Body: { "phone": "+recipient_phone_number" }
    Verify OTP:

    Endpoint: POST /verify-otp
    Body: { "phone": "+recipient_phone_number", "otp": "123456" }