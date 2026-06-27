# Secure Rise

A Next.js 15 investment platform with crypto deposits, Paystack bank transfers, and wallet management.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Copy `.env.example` to `.env.local` and configure the following variables:

### Required
- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth session encryption
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for development)

### Email Configuration
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port (usually 465)
- `EMAIL_USER` - SMTP username
- `EMAIL_PASS` - SMTP password
- `EMAIL_FROM` - From email address

### Cloudinary (for image uploads)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Paystack Payment Gateway
- `PAYSTACK_SECRET_KEY` - Secret key from Paystack dashboard
- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` - Public key from Paystack dashboard

### App Configuration
- `NEXT_PUBLIC_APP_URL` - Your app URL for callbacks

## Paystack Setup

1. Create a Paystack account at [paystack.co](https://paystack.co)
2. Get your API keys from the Settings > API Keys section
3. Add the keys to your `.env.local` file
4. Configure your webhook URL in Paystack dashboard:
   - Production: `https://yourdomain.com/api/paystack/webhook`
   - Development: Use ngrok or similar to expose localhost

## Features

- User authentication with NextAuth
- Crypto deposits with admin approval
- Paystack bank transfer deposits
- Wallet balance management
- Investment plans
- Email notifications
- Admin dashboard

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
