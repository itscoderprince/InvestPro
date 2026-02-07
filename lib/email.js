import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.EMAIL_FROM || 'InvestPro <noreply@investpro.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Generic email sender
export async function sendEmail({ to, subject, html }) {
  try {
    // Skip sending if no API key (development)
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_resend_api_key') {
      console.log('📧 Email skipped (no API key):', { to, subject });
      return { success: true, data: { id: 'dev-mode' } };
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html
    });

    if (error) {
      // Handle unverified domain error in development
      if (error.message.includes('not verified') && process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Resend: ${to} is not verified for this sandbox. Redirecting to ${FROM_EMAIL} for testing...`);

        const fallback = await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: FROM_EMAIL, // Redirecting to owner/sender's verified email
          subject: `[Dev Redirect: ${to}] ${subject}`,
          html: `
            <div style="background: #fff3cd; padding: 10px; border: 1px solid #ffeeba; margin-bottom: 20px;">
              <strong>Developer Note:</strong> This email was originally intended for <strong>${to}</strong> 
              but was redirected to you because the recipient is not verified in your Resend sandbox.
            </div>
            ${html}
          `
        });

        if (!fallback.error) {
          console.log('✅ Email redirected successfully to', FROM_EMAIL);
          return { success: true, data: fallback.data };
        }

        // If even the redirect fails, just log it but don't crash
        console.error('❌ Resend redirect failed:', fallback.error.message);
        return { success: true, data: { id: 'skipped-failed-fallback' }, warning: 'Email redirect failed' };
      }

      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    // Don't let email failures crash the entire request in non-critical paths
    return { success: false, error: error.message };
  }
}

// Email template wrapper
function emailTemplate(content) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .highlight { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .amount { font-size: 24px; color: #667eea; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        ${content}
        <div class="footer">
          <p>© ${new Date().getFullYear()} InvestPro. All rights reserved.</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Welcome email
export async function sendWelcomeEmail(user) {
  const html = emailTemplate(`
    <div class="header">
      <h1>Welcome to InvestPro! 🎉</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Thank you for registering with InvestPro. We're excited to have you on board!</p>
      <p>Start your investment journey today and enjoy weekly returns of 3-5%.</p>
      
      <div class="highlight">
        <h3>Next Steps:</h3>
        <ol>
          <li>Complete your KYC verification</li>
          <li>Choose an investment index</li>
          <li>Make your first investment</li>
          <li>Start earning weekly returns</li>
        </ol>
      </div>
      
      <center>
        <a href="${APP_URL}/kyc" class="button">Complete KYC Now</a>
      </center>
      
      <p>If you have any questions, feel free to reach out to our support team.</p>
      <p>Best regards,<br><strong>The InvestPro Team</strong></p>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: 'Welcome to InvestPro - Start Your Investment Journey!',
    html
  });
}

// Email verification
export async function sendVerificationEmail(user, token) {
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  const html = emailTemplate(`
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Please verify your email address to complete your registration.</p>
      
      <center>
        <a href="${verifyUrl}" class="button">Verify Email</a>
      </center>
      
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #667eea;">${verifyUrl}</p>
      
      <p><em>This link will expire in 24 hours.</em></p>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: 'Verify Your Email - InvestPro',
    html
  });
}

// Password reset email
export async function sendPasswordResetEmail(user, token) {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const html = emailTemplate(`
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>We received a request to reset your password. Click the button below to create a new password.</p>
      
      <center>
        <a href="${resetUrl}" class="button">Reset Password</a>
      </center>
      
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
      
      <p><em>This link will expire in 1 hour.</em></p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: 'Reset Your Password - InvestPro',
    html
  });
}

// KYC approval email
export async function sendKYCApprovalEmail(user) {
  const html = emailTemplate(`
    <div class="header">
      <h1>KYC Approved! ✅</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Great news! Your KYC verification has been approved.</p>
      <p>You can now start investing in our various indices and earn weekly returns.</p>
      
      <center>
        <a href="${APP_URL}/invest" class="button">Start Investing</a>
      </center>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: 'KYC Verification Approved - InvestPro',
    html
  });
}

// KYC rejection email
export async function sendKYCRejectionEmail(user, reason) {
  const html = emailTemplate(`
    <div class="header" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);">
      <h1>KYC Verification Update</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Unfortunately, your KYC verification could not be approved.</p>
      
      <div class="highlight">
        <strong>Reason:</strong><br>
        ${reason}
      </div>
      
      <p>Please resubmit your documents with the correct information.</p>
      
      <center>
        <a href="${APP_URL}/kyc/resubmit" class="button">Resubmit Documents</a>
      </center>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: 'KYC Verification Update - InvestPro',
    html
  });
}

// Payment request confirmation email
export async function sendPaymentConfirmationEmail(user, paymentRequest) {
  const html = emailTemplate(`
    <div class="header">
      <h1>Payment Request Submitted</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your payment request has been submitted successfully.</p>
      
      <div class="highlight">
        <p><strong>Request ID:</strong> ${paymentRequest.requestId}</p>
        <p><strong>Amount:</strong> <span class="amount">₹${paymentRequest.amount.toLocaleString()}</span></p>
        <p><strong>Status:</strong> Pending Upload</p>
      </div>
      
      <p>Please upload your payment proof within 24 hours to complete the process.</p>
      
      <center>
        <a href="${APP_URL}/payments/${paymentRequest._id}" class="button">Upload Payment Proof</a>
      </center>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: `Payment Request ${paymentRequest.requestId} - InvestPro`,
    html
  });
}

// Payment approved email
export async function sendPaymentApprovedEmail(user, paymentRequest, investment) {
  const html = emailTemplate(`
    <div class="header">
      <h1>Payment Approved! ✅</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your payment has been verified and approved.</p>
      
      <div class="highlight">
        <p><strong>Request ID:</strong> ${paymentRequest.requestId}</p>
        <p><strong>Amount Invested:</strong> <span class="amount">₹${paymentRequest.amount.toLocaleString()}</span></p>
        <p><strong>Investment ID:</strong> ${Array.isArray(investment) ? investment[0]?._id : investment?._id || 'Pending'}</p>
      </div>
      
      <p>Your investment is now active and you'll start receiving weekly returns.</p>
      
      <center>
        <a href="${APP_URL}/investments" class="button">View Investments</a>
      </center>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: 'Payment Approved - Investment Active! - InvestPro',
    html
  });
}

// Payment rejected email
export async function sendPaymentRejectionEmail(user, reason) {
  const html = emailTemplate(`
    <div class="header" style="background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);">
      <h1>Payment Rejected ❌</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>We're sorry to inform you that your payment verification was not successful.</p>
      
      <div class="highlight">
        <p><strong>Reason for rejection:</strong></p>
        <p style="color: #dc2626; font-weight: bold;">${reason}</p>
      </div>
      
      <p>Please review the reason and submit a new payment request with correct details or a valid proof of payment.</p>
      
      <center>
        <a href="${APP_URL}/indices" class="button">Try Again</a>
      </center>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: 'Payment Verification Failed - InvestPro',
    html
  });
}

// Withdrawal request confirmation
export async function sendWithdrawalRequestEmail(user, withdrawal) {
  const html = emailTemplate(`
    <div class="header">
      <h1>Withdrawal Request Received</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your withdrawal request has been submitted.</p>
      
      <div class="highlight">
        <p><strong>Request ID:</strong> ${withdrawal.requestId}</p>
        <p><strong>Amount:</strong> <span class="amount">₹${withdrawal.amount.toLocaleString()}</span></p>
        <p><strong>Bank:</strong> ${withdrawal.bankDetails.bankName}</p>
        <p><strong>Account:</strong> XXXX${withdrawal.bankDetails.accountNumber.slice(-4)}</p>
      </div>
      
      <p>Your request will be processed within 24-48 hours.</p>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: `Withdrawal Request ${withdrawal.requestId} - InvestPro`,
    html
  });
}

// Withdrawal approved email
export async function sendWithdrawalApprovedEmail(user, withdrawal) {
  const html = emailTemplate(`
    <div class="header">
      <h1>Withdrawal Processed! 💰</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your withdrawal has been processed successfully.</p>
      
      <div class="highlight">
        <p><strong>Request ID:</strong> ${withdrawal.requestId}</p>
        <p><strong>Amount:</strong> <span class="amount">₹${withdrawal.amount.toLocaleString()}</span></p>
        <p><strong>Transaction Ref:</strong> ${withdrawal.transactionReference}</p>
      </div>
      
      <p>The amount will be credited to your bank account within 1-2 business days.</p>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: 'Withdrawal Processed - InvestPro',
    html
  });
}

// Weekly returns email
export async function sendWeeklyReturnsEmail(user, returnData) {
  const html = emailTemplate(`
    <div class="header">
      <h1>Weekly Returns Credited! 📈</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your weekly returns have been credited to your account.</p>
      
      <div class="highlight">
        <p><strong>Week:</strong> ${returnData.weekStart} - ${returnData.weekEnd}</p>
        <p><strong>Return Rate:</strong> ${returnData.returnRate}%</p>
        <p><strong>Amount Credited:</strong> <span class="amount">₹${returnData.amount.toLocaleString()}</span></p>
        <p><strong>Total Investment:</strong> ₹${returnData.totalInvestment.toLocaleString()}</p>
      </div>
      
      <center>
        <a href="${APP_URL}/returns" class="button">View Returns</a>
      </center>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: 'Weekly Returns Credited - InvestPro',
    html
  });
}

// Support ticket confirmation
export async function sendTicketConfirmationEmail(user, ticket) {
  const html = emailTemplate(`
    <div class="header">
      <h1>Support Ticket Created</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>Your support ticket has been created successfully.</p>
      
      <div class="highlight">
        <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
        <p><strong>Subject:</strong> ${ticket.subject}</p>
        <p><strong>Category:</strong> ${ticket.category}</p>
      </div>
      
      <p>Our team will respond within 24 hours.</p>
      
      <center>
        <a href="${APP_URL}/tickets/${ticket._id}" class="button">View Ticket</a>
      </center>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: `Support Ticket ${ticket.ticketId} - InvestPro`,
    html
  });
}

// Ticket reply notification
export async function sendTicketReplyEmail(user, ticket, message) {
  const html = emailTemplate(`
    <div class="header">
      <h1>New Reply on Your Ticket</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>There's a new reply on your support ticket.</p>
      
      <div class="highlight">
        <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
        <p><strong>Subject:</strong> ${ticket.subject}</p>
        <p><strong>Reply:</strong></p>
        <p style="background: white; padding: 10px; border-left: 3px solid #667eea;">${message}</p>
      </div>
      
      <center>
        <a href="${APP_URL}/tickets/${ticket._id}" class="button">View Ticket</a>
      </center>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: `Reply on Ticket ${ticket.ticketId} - InvestPro`,
    html
  });
}
// Withdrawal rejection email
export async function sendWithdrawalRejectionEmail(user, withdrawal, reason) {
  const html = emailTemplate(`
    <div class="header" style="background: linear-gradient(135deg, #f87171 0%, #dc2626 100%);">
      <h1>Withdrawal Rejected ❌</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${user.name}</strong>,</p>
      <p>We're sorry to inform you that your withdrawal request was not successful.</p>
      
      <div class="highlight">
        <p><strong>Request ID:</strong> ${withdrawal.requestId}</p>
        <p><strong>Amount:</strong> <span class="amount">₹${withdrawal.amount.toLocaleString()}</span></p>
        <p style="color: #dc2626; font-weight: bold; margin-top: 10px;">Reason: ${reason}</p>
      </div>
      
      <p>The amount has been refunded to your available balance.</p>
      <p>Please review the reason and submit a new withdrawal request with correct details.</p>
      
      <center>
        <a href="${APP_URL}/withdraw" class="button">Try Again</a>
      </center>
    </div>
  `);

  return await sendEmail({
    to: user.email,
    subject: 'Withdrawal Request Rejected - InvestPro',
    html
  });
}
