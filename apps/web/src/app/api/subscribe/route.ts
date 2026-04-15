import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@parliament-audit/db';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import { Resend } from 'resend';

const RESEND_FROM = 'Parliament Audit <onboarding@resend.dev>';
// Once parliamentaudit.ca is verified in Resend, switch to:
// const RESEND_FROM = 'Parliament Audit <alerts@parliamentaudit.ca>';

const BASE_URL = 'https://parliamentaudit.ca';

function generateToken(): string {
  return randomBytes(32).toString('hex');
}

interface SubscribeBody {
  email: string;
  prefAllVotes?: boolean;
  prefBillsOnly?: boolean;
  prefWeeklyDigest?: boolean;
  source?: string;
}

export async function POST(request: NextRequest) {
  let body: SubscribeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 }
    );
  }

  // Check for existing subscriber
  const existing = await db.query.subscribers.findFirst({
    where: eq(schema.subscribers.email, email),
  });

  if (existing && !existing.unsubscribedAt) {
    return NextResponse.json(
      { ok: true, alreadySubscribed: true, message: 'You\'re already subscribed.' },
      { status: 200 }
    );
  }

  const unsubscribeToken = generateToken();
  const confirmationToken = generateToken();

  if (existing) {
    // Reactivate a previously unsubscribed email
    await db
      .update(schema.subscribers)
      .set({
        unsubscribedAt: null,
        unsubscribeToken,
        prefAllVotes: body.prefAllVotes ?? true,
        prefBillsOnly: body.prefBillsOnly ?? false,
        prefWeeklyDigest: body.prefWeeklyDigest ?? false,
        updatedAt: new Date(),
      })
      .where(eq(schema.subscribers.email, email));
  } else {
    await db.insert(schema.subscribers).values({
      email,
      prefAllVotes: body.prefAllVotes ?? true,
      prefBillsOnly: body.prefBillsOnly ?? false,
      prefWeeklyDigest: body.prefWeeklyDigest ?? false,
      confirmed: true, // single opt-in for now; switch to false when domain verified + double opt-in
      unsubscribeToken,
      confirmationToken,
      signupSource: body.source ?? 'subscribe-page',
    });
  }

  // Attempt to send welcome email (fails silently if sandbox limits hit)
  const apiKey = process.env.RESEND_API_KEY;
  let emailSent = false;

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const unsubscribeUrl = `${BASE_URL}/unsubscribe?token=${unsubscribeToken}`;
      const { error } = await resend.emails.send({
        from: RESEND_FROM,
        to: [email],
        subject: 'Welcome to Parliament Audit',
        html: buildWelcomeEmail(unsubscribeUrl),
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      });

      if (!error) {
        emailSent = true;
        await db
          .update(schema.subscribers)
          .set({
            welcomeEmailSent: true,
            welcomeEmailSentAt: new Date(),
          })
          .where(eq(schema.subscribers.email, email));
      }
    } catch (err) {
      // Silent fail — still return success; the subscriber is saved.
      // A background job can backfill welcome emails once the domain is verified.
      console.error('Welcome email failed:', err);
    }
  }

  return NextResponse.json({
    ok: true,
    message: emailSent
      ? 'You\'re subscribed! Check your inbox for a welcome email.'
      : 'You\'re subscribed! Welcome emails will go out once we finish verifying our email domain.',
  });
}

function buildWelcomeEmail(unsubscribeUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Parliament Audit</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;">
    <!-- Header -->
    <div style="background:#1a1a2e;padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:28px;letter-spacing:-0.5px;">
        <span style="color:#D71920;">Parliament</span> Audit
      </h1>
      <p style="color:#cbd5e1;margin:8px 0 0;font-size:14px;">Canada deserves to know.</p>
    </div>

    <!-- Body -->
    <div style="padding:32px 24px;color:#1a1a2e;">
      <h2 style="margin:0 0 16px;font-size:22px;">Welcome aboard.</h2>
      <p style="line-height:1.6;margin:0 0 16px;">
        Thanks for subscribing to Parliament Audit. You'll now get a clear, factual summary every time
        Canada's House of Commons or Senate holds a recorded vote.
      </p>
      <p style="line-height:1.6;margin:0 0 16px;">
        <strong>What to expect:</strong>
      </p>
      <ul style="line-height:1.8;margin:0 0 24px;padding-left:20px;">
        <li>Vote breakdowns — how each party voted, in plain English</li>
        <li>Why it matters — the real-world impact of the legislation</li>
        <li>No spin. No partisan angle. Just the record.</li>
      </ul>

      <div style="background:#f8fafc;border-left:4px solid #D71920;padding:16px;border-radius:4px;margin:24px 0;">
        <p style="margin:0;font-size:14px;color:#475569;">
          <strong>Want to see how your MP votes?</strong><br>
          <a href="${BASE_URL}/find-your-mp" style="color:#D71920;text-decoration:underline;">Find your MP by postal code</a>
        </p>
      </div>

      <p style="line-height:1.6;margin:24px 0 0;font-size:14px;color:#64748b;">
        Follow us on <a href="https://x.com/ParliamentAudit" style="color:#D71920;">X/Twitter</a> for real-time updates.
      </p>
    </div>

    <!-- Footer -->
    <div style="padding:24px;border-top:1px solid #e5e7eb;text-align:center;font-size:12px;color:#94a3b8;">
      <p style="margin:0 0 8px;">
        Parliament Audit is an independent civic project. Not affiliated with the Government of Canada.
      </p>
      <p style="margin:0;">
        <a href="${unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
