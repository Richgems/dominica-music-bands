import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { name, email, phone, subject, type, message } = payload;

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    // Format submission type label
    const typeLabels = {
      data_correction: 'Data Correction',
      data_addition: 'Add Missing Band/Info',
      photo_audio: 'Photo or Audio Submission',
      enquiry: 'Research Enquiry',
      other: 'Other',
    };
    const typeLabel = typeLabels[type] || type;

    // Email body for Richard
    const emailBody = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone || '(not provided)'}
Type: ${typeLabel}
Subject: ${subject || '(none)'}

Message:
${message}

---
Reply to: ${email}
Received: ${new Date().toISOString()}
    `.trim();

    // Send email to Richard
    await base44.integrations.Core.SendEmail({
      to: 'francis.richards2011@gmail.com',
      subject: `[${typeLabel}] ${subject || name}`,
      body: emailBody,
      from_name: 'Dominica Music Archive',
    });

    // Send confirmation email to submitter
    const confirmationBody = `
Thank you for contacting the Dominica Music Archive!

Your submission has been received and will be reviewed by Richard. You'll receive a response via email shortly.

---
Submission Details:
Type: ${typeLabel}
Subject: ${subject || '(none)'}
Message: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}

---
Dominica Music Archive
    `.trim();

    await base44.integrations.Core.SendEmail({
      to: email,
      subject: 'Thank you for your submission',
      body: confirmationBody,
      from_name: 'Dominica Music Archive',
    });

    return Response.json({
      success: true,
      message: 'Submission received. Check your email for confirmation.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return Response.json(
      { error: error.message || 'Failed to process submission' },
      { status: 500 }
    );
  }
});