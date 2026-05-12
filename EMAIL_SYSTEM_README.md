# Secure Rise Email System - React Email Implementation

## Overview

This document describes the modernized email system for Secure Rise, built with React Email and Tailwind CSS. The system provides a premium, responsive, and maintainable email template architecture.

## Architecture

### Email Components Structure

```
emails/
├── components/
│   ├── EmailLayout.tsx      # Base layout wrapper
│   ├── EmailHeader.tsx      # Consistent header with logo
│   ├── EmailFooter.tsx      # Footer with branding
│   ├── CTAButton.tsx        # Call-to-action buttons
│   ├── HeroSection.tsx      # Hero/banner sections
│   ├── InfoCard.tsx         # Information cards
│   ├── FeatureRow.tsx       # Feature lists
│   ├── InfoGrid.tsx         # Grid layouts
│   └── index.ts            # Component exports
├── WelcomeEmail.tsx         # Welcome email template
├── PasswordResetEmail.tsx   # Password reset template
├── DepositStatusEmail.tsx   # Deposit status notifications
├── KYCStatusEmail.tsx       # KYC verification status
├── InvestmentConfirmationEmail.tsx  # Investment confirmations
├── DailyROIEmail.tsx        # Daily ROI notifications
├── WithdrawalOTPEmail.tsx   # Withdrawal verification
├── GiftEmail.tsx            # Gift notifications
├── DepositNotificationEmail.tsx    # Admin deposit alerts
├── WithdrawalNotificationEmail.tsx  # Admin withdrawal alerts
└── GiftCardNotificationEmail.tsx    # Admin gift card alerts
```

### Core Files

- `lib/email.ts` - Main email sending functions (updated to use React Email)
- `lib/email-renderer.ts` - React Email component renderers
- `package.json` - Dependencies and scripts

## Design System

### Brand Identity
- **Company**: Secure Rise
- **Style**: Premium fintech, institutional feel
- **Colors**: 
  - Primary: `#09090b` (black)
  - Success: `#22c55e` (green)
  - Danger: `#ef4444` (red)
  - Warning: `#f59e0b` (amber)
  - Muted: `#71717a` (gray)
- **Typography**: System fonts with proper fallbacks
- **Border Radius**: 12px (cards), 16px (sections), 24px (container)

### Responsive Design
- Mobile-first approach
- Grid layouts stack on mobile
- Optimized for Gmail, Outlook, Apple Mail
- Custom CSS media queries for email clients

## Email Types

### User-Facing Emails

1. **Welcome Email** (`WelcomeEmail.tsx`)
   - Sent to new users upon registration
   - Includes welcome bonus information
   - Features platform highlights

2. **Password Reset** (`PasswordResetEmail.tsx`)
   - Verification code for password reset
   - Security best practices included
   - 5-minute expiration notice

3. **Deposit Status** (`DepositStatusEmail.tsx`)
   - Approved/rejected deposit notifications
   - Transaction details included
   - CTA to view deposits

4. **KYC Status** (`KYCStatusEmail.tsx`)
   - Identity verification results
   - Rejection reasons if applicable
   - Access level updates

5. **Investment Confirmation** (`InvestmentConfirmationEmail.tsx`)
   - New investment activations
   - ROI projections and details
   - Investment tracking information

6. **Daily ROI** (`DailyROIEmail.tsx`)
   - Daily earnings notifications
   - Investment progress tracking
   - Account balance updates

7. **Withdrawal OTP** (`WithdrawalOTPEmail.tsx`)
   - Withdrawal verification codes
   - Transaction details included
   - Security warnings

8. **Gift Notifications** (`GiftEmail.tsx`)
   - Gift sent/received confirmations
   - Transaction details
   - Balance updates

### Admin Notifications

1. **Deposit Alerts** (`DepositNotificationEmail.tsx`)
   - New deposit submissions
   - Proof images included
   - Review CTAs for admins

2. **Withdrawal Requests** (`WithdrawalNotificationEmail.tsx`)
   - New withdrawal requests
   - Crypto details and addresses
   - Admin review links

3. **Gift Card Submissions** (`GiftCardNotificationEmail.tsx`)
   - New gift card uploads
   - Card images and details
   - Admin management links

## Setup Instructions

### 1. Install Dependencies

```bash
npm install @react-email/render @react-email/ui react-email
```

### 2. Environment Variables

Ensure these are configured in your `.env` file:

```env
# Email Configuration
EMAIL_HOST=your-smtp-host.com
EMAIL_PORT=465
EMAIL_USER=your-email@domain.com
EMAIL_PASS=your-email-password
EMAIL_FROM=Secure Rise <noreply@securerise.com>

# Application URLs
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Email Preview Development

To preview emails during development:

```bash
# Navigate to emails directory
cd emails

# Start React Email dev server
npm run dev
```

This will start a local preview server at `http://localhost:3000` where you can view all email templates.

### 4. Build for Production

```bash
# Build email templates
npm run build

# Export static HTML
npm run export
```

## Usage Examples

### Sending a Welcome Email

```typescript
import { sendWelcomeEmail } from '../lib/email';

await sendWelcomeEmail('user@example.com', 'John Doe');
```

### Sending a Deposit Status Email

```typescript
import { sendDepositStatusEmail } from '../lib/email';

await sendDepositStatusEmail('user@example.com', {
  username: 'John Doe',
  amount: 1000,
  paymentMethod: 'Bank Transfer',
  transactionId: 'TXN123456',
  status: 'approved'
});
```

## Customization Guidelines

### Adding New Email Templates

1. Create new email component in `emails/` directory
2. Use the established component system:
   ```tsx
   import { EmailLayout, EmailHeader, EmailFooter } from './components';
   
   export const NewEmailTemplate: React.FC<NewEmailProps> = (props) => {
     return (
       <EmailLayout preview="Email preview text">
         <EmailHeader title="Email Title" subtitle="Email subtitle" />
         {/* Email content */}
         <EmailFooter userEmail={props.userEmail} />
       </EmailLayout>
     );
   };
   ```

3. Add renderer function in `lib/email-renderer.ts`
4. Update `lib/email.ts` with sending function

### Component Customization

#### EmailLayout
- Base wrapper with responsive styles
- Preview text support
- Mobile optimization

#### EmailHeader
- Logo integration
- Title and subtitle support
- Optional logo display

#### EmailFooter
- Branding consistency
- User email display
- Unsubscribe options

#### CTAButton
- Multiple variants (primary, secondary, success, danger, warning)
- Full-width support
- Consistent styling

#### InfoCard
- Status indicators
- Grid layouts
- Color-coded variants

## Testing

### Local Testing

1. Start the React Email dev server:
   ```bash
   cd emails && npm run dev
   ```

2. Open `http://localhost:3000` to preview templates

3. Test with sample data using the preview interface

### Integration Testing

```typescript
// Test email sending
import { sendWelcomeEmail } from '../lib/email';

try {
  await sendWelcomeEmail('test@example.com', 'Test User');
  console.log('Email sent successfully');
} catch (error) {
  console.error('Email sending failed:', error);
}
```

## Best Practices

### Email Client Compatibility

- Use inline styles for critical elements
- Test across Gmail, Outlook, Apple Mail
- Avoid unsupported CSS properties
- Use table-based layouts for complex structures

### Performance

- Optimize image sizes
- Use CDN for hosted images
- Minimize CSS and HTML
- Cache email templates when possible

### Security

- Sanitize user input
- Validate email addresses
- Use secure SMTP connections
- Implement rate limiting

### Deliverability

- Set up SPF/DKIM records
- Use consistent sending domains
- Monitor bounce rates
- Implement unsubscribe mechanisms

## Troubleshooting

### Common Issues

1. **Emails not rendering correctly**
   - Check React Email component syntax
   - Verify Tailwind classes are properly applied
   - Test in different email clients

2. **Images not displaying**
   - Verify image URLs are accessible
   - Use absolute URLs for hosted images
   - Check image dimensions

3. **Styling issues**
   - Ensure Tailwind is properly configured
   - Check for CSS conflicts
   - Test responsive breakpoints

### Debug Mode

Enable debug logging in development:

```typescript
// In lib/email.ts
if (process.env.NODE_ENV === 'development') {
  console.log('Email content:', htmlContent);
}
```

## Migration Notes

This system replaces the previous HTML string-based email templates with a modern React Email architecture while maintaining:

- All existing functionality
- Email triggers and business logic
- Variable placeholders and dynamic content
- SMTP configuration and sending logic

The migration provides:
- Better maintainability
- Type safety
- Component reusability
- Modern development experience
- Improved responsive design

## Support

For questions or issues related to the email system:

1. Check this documentation first
2. Review component examples in the `emails/` directory
3. Test with the React Email preview server
4. Consult the React Email official documentation

---

**Last Updated**: May 2026
**Version**: 2.0.0 (React Email Implementation)
