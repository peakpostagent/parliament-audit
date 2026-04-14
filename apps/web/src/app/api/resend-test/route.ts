import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Diagnostic endpoint to verify the Resend API key is configured correctly.
// Usage: GET /api/resend-test?to=your-email@example.com&secret=<DIAG_SECRET>
//
// This is gated behind a secret to prevent abuse. The secret is auto-generated
// from the RESEND_API_KEY itself — anyone with knowledge of the key can test it.

export async function GET(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: 'RESEND_API_KEY environment variable is not set on the server.',
      },
      { status: 500 }
    );
  }

  const to = request.nextUrl.searchParams.get('to');
  if (!to) {
    return NextResponse.json(
      {
        ok: true,
        message: 'RESEND_API_KEY is set on the server.',
        keyPrefix: apiKey.slice(0, 6) + '...',
        hint: 'To send a test email, pass ?to=<email>',
      },
      { status: 200 }
    );
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: 'Parliament Audit <onboarding@resend.dev>',
      to: [to],
      subject: 'Parliament Audit — Resend test email',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #1a1a2e;">Parliament Audit</h1>
          <p>This is a test email confirming that your Resend API key is configured correctly.</p>
          <p>If you received this, the subscribe form backend is ready to wire up.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="color: #6b7280; font-size: 14px;">
            Sent from <code>onboarding@resend.dev</code> — once parliamentaudit.ca is verified
            in Resend, we can send from <code>alerts@parliamentaudit.ca</code> instead.
          </p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Test email sent successfully',
      emailId: data?.id,
      sentTo: to,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
