import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormNotificationToAdmins } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, contactReason, message } = await request.json();

    // Validation
    if (!firstName || !lastName || !email || !contactReason || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Name validation (no special characters, only letters and spaces)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      return NextResponse.json(
        { error: 'Name should only contain letters and spaces' },
        { status: 400 }
      );
    }

    // Message length validation
    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // Prepare contact data
    const contactData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      contactReason: contactReason.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Send email to all admin users
    try {
      await sendContactFormNotificationToAdmins(contactData);
    } catch (emailError) {
      console.error('Failed to send contact form email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send notification. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been sent successfully. Our team will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
