# Email Setup Guide for Forgot Password Feature

## Current Status
The forgot password feature is currently showing verification codes directly on screen instead of sending real emails because email service is not configured.

## To Enable Real Email Sending:

### Option 1: EmailJS (Free & Easy)
1. Go to https://www.emailjs.com/
2. Create a free account
3. Create an email service (Gmail, Outlook, etc.)
4. Create an email template with these variables:
   - `{{to_email}}` - recipient email
   - `{{verification_code}}` - the 6-digit code
   - `{{user_name}}` - user's name
5. Get your:
   - Public Key
   - Service ID  
   - Template ID
6. Replace in `index.html`:
   - `YOUR_PUBLIC_KEY` with your actual public key
7. Replace in `enhanced-login.js`:
   - `YOUR_SERVICE_ID` with your service ID
   - `YOUR_TEMPLATE_ID` with your template ID

### Option 2: For Testing (Current Behavior)
The app currently shows the verification code directly on screen when email service is not configured. This allows you to test the forgot password flow without setting up email.

## How It Works Now:
1. User enters username and clicks "Forgot Password"
2. System generates a 6-digit verification code
3. Shows message: "Email service not configured. Your verification code is: 123456"
4. User enters the code in the modal to reset password

## Sample Email Template:
```
Subject: Password Reset - Lunar Playlist Craft

Hello {{user_name}},

Your verification code for password reset is: {{verification_code}}

This code will expire in 5 minutes.

Best regards,
Lunar Playlist Craft Team
```

## Testing:
1. Create a user account with an email
2. Try to login with wrong password
3. Click "Forgot your cosmic key?"
4. Enter username and click "🔑 FORGOT PASSWORD"
5. The verification code will be displayed on screen
6. Enter the code and set a new password