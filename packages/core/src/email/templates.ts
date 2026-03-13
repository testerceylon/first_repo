/**
 * Email Templates for Inicio Official
 * 
 * All templates are mobile-responsive, self-contained HTML
 * with no external dependencies.
 */

// ─── Base Template Function ─────────────────────────────────────────────────

interface BaseTemplateOptions {
  title: string;
  content: string;
}

function baseTemplate({ title, content }: BaseTemplateOptions): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #0a0a0a;
      color: #e5e5e5;
      line-height: 1.6;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1a1a1a;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 24px;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #ffffff;
    }
    p {
      margin-bottom: 16px;
      color: #a3a3a3;
      font-size: 16px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 24px 0;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .info-box {
      background-color: #262626;
      border-left: 4px solid #6366f1;
      padding: 16px;
      margin: 24px 0;
      border-radius: 6px;
    }
    .info-box p {
      margin-bottom: 0;
      color: #d4d4d4;
      font-size: 14px;
    }
    .feature-list {
      list-style: none;
      margin: 20px 0;
    }
    .feature-list li {
      padding: 12px 0;
      color: #d4d4d4;
      font-size: 15px;
      border-bottom: 1px solid #262626;
    }
    .feature-list li:before {
      content: "✓ ";
      color: #6366f1;
      font-weight: bold;
      margin-right: 8px;
    }
    .feature-list li:last-child {
      border-bottom: none;
    }
    .footer {
      background-color: #0f0f0f;
      padding: 24px;
      text-align: center;
      color: #737373;
      font-size: 14px;
    }
    .footer a {
      color: #6366f1;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .divider {
      height: 1px;
      background-color: #262626;
      margin: 24px 0;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 10px;
      }
      .content {
        padding: 24px 16px;
      }
      .header {
        padding: 24px 16px;
      }
      h1 {
        font-size: 20px;
      }
      .button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Inicio Official</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>Inicio Official</strong> · <a href="https://inicioofficial.com">inicioofficial.com</a> · <a href="mailto:support@inicioofficial.com">support@inicioofficial.com</a></p>
      <p style="margin-top: 8px; font-size: 12px;">© ${new Date().getFullYear()} Inicio Official. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// ─── Template Functions ─────────────────────────────────────────────────────

export interface EmailVerificationTemplateOptions {
  name: string;
  verificationUrl: string;
}

/**
 * Email verification template
 * Subject: "Verify your Inicio Official email address"
 * From: noreply@inicioofficial.com
 */
export function emailVerificationTemplate({
  name,
  verificationUrl,
}: EmailVerificationTemplateOptions): string {
  const content = `
    <h1>Welcome to Inicio Official, ${name}!</h1>
    <p>Thanks for signing up. To get started, please verify your email address by clicking the button below:</p>
    <p style="text-align: center;">
      <a href="${verificationUrl}" class="button">Verify Email</a>
    </p>
    <div class="info-box">
      <p><strong>⏰ This link expires in 24 hours</strong></p>
    </div>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #737373;">If you didn't create an account with Inicio Official, you can safely ignore this email.</p>
  `;

  return baseTemplate({
    title: "Verify your Inicio Official email address",
    content,
  });
}

export interface ForgotPasswordTemplateOptions {
  name: string;
  resetUrl: string;
}

/**
 * Forgot password / reset password template
 * Subject: "Reset your Inicio Official password"
 * From: noreply@inicioofficial.com
 */
export function forgotPasswordTemplate({
  name,
  resetUrl,
}: ForgotPasswordTemplateOptions): string {
  const content = `
    <h1>Password Reset Request</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset your Inicio Official password. Click the button below to create a new password:</p>
    <p style="text-align: center;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </p>
    <div class="info-box">
      <p><strong>⏰ This link expires in 1 hour</strong></p>
    </div>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #737373;">If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
  `;

  return baseTemplate({
    title: "Reset your Inicio Official password",
    content,
  });
}

export interface PasswordChangedTemplateOptions {
  name: string;
}

/**
 * Password changed confirmation template
 * Subject: "Your Inicio Official password was changed"
 * From: noreply@inicioofficial.com
 */
export function passwordChangedTemplate({
  name,
}: PasswordChangedTemplateOptions): string {
  const now = new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const content = `
    <h1>Password Changed Successfully</h1>
    <p>Hi ${name},</p>
    <p>Your Inicio Official password was successfully changed on <strong>${now}</strong>.</p>
    <div class="info-box">
      <p><strong>⚠️ If this wasn't you</strong></p>
      <p>Please contact our support team immediately at <a href="mailto:support@inicioofficial.com" style="color: #6366f1;">support@inicioofficial.com</a></p>
    </div>
    <p>If you made this change, you can safely ignore this email.</p>
  `;

  return baseTemplate({
    title: "Your Inicio Official password was changed",
    content,
  });
}

export interface WelcomeTemplateOptions {
  name: string;
}

/**
 * Welcome email for new users
 * Subject: "Welcome to Inicio Official 🎉"
 * From: hello@inicioofficial.com
 */
export function welcomeTemplate({ name }: WelcomeTemplateOptions): string {
  const content = `
    <h1>Welcome to Inicio Official! 🎉</h1>
    <p>Hi ${name},</p>
    <p>We're thrilled to have you on board! Inicio Official provides powerful tools to streamline your workflow.</p>
    <p><strong>You start with 5 free credits</strong> to explore our tools:</p>
    <ul class="feature-list">
      <li>QR Code Generator</li>
      <li>Image Crop & Resize</li>
      <li>Background Remover</li>
      <li>Digital Signature Creator</li>
      <li>PDF Compressor</li>
      <li>Image Format Converter</li>
    </ul>
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL || "https://inicioofficial.com"}/dashboard" class="button">Go to Dashboard</a>
    </p>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #737373;">Questions? Just reply to this email—we're here to help!</p>
  `;

  return baseTemplate({
    title: "Welcome to Inicio Official",
    content,
  });
}

export interface SubscriptionConfirmedTemplateOptions {
  name: string;
  plan: string;
  creditsPerMonth: number;
}

/**
 * Subscription confirmed template
 * Subject: "Your Inicio Official Pro subscription is active"
 * From: billing@inicioofficial.com
 */
export function subscriptionConfirmedTemplate({
  name,
  plan,
  creditsPerMonth,
}: SubscriptionConfirmedTemplateOptions): string {
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);

  const content = `
    <h1>Subscription Activated! 🚀</h1>
    <p>Hi ${name},</p>
    <p>Your <strong>Inicio Official ${planName}</strong> subscription is now active!</p>
    <div class="info-box">
      <p><strong>Plan:</strong> ${planName}</p>
      <p><strong>Credits per month:</strong> ${creditsPerMonth}</p>
    </div>
    <p><strong>Unlocked Pro Features:</strong></p>
    <ul class="feature-list">
      <li>${creditsPerMonth} credits per month (auto-resets monthly)</li>
      <li>Priority support</li>
      <li>Faster processing times</li>
      <li>Access to new features first</li>
      <li>No ads or watermarks</li>
    </ul>
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL || "https://inicioofficial.com"}/dashboard" class="button">Explore Pro Features</a>
    </p>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #737373;">Questions about your subscription? Just reply to this email and we'll be happy to help.</p>
  `;

  return baseTemplate({
    title: "Your Inicio Official Pro subscription is active",
    content,
  });
}

export interface SubscriptionCancelledTemplateOptions {
  name: string;
  accessUntil: string;
}

/**
 * Subscription cancelled template
 * Subject: "Your Inicio Official subscription has been cancelled"
 * From: billing@inicioofficial.com
 */
export function subscriptionCancelledTemplate({
  name,
  accessUntil,
}: SubscriptionCancelledTemplateOptions): string {
  const content = `
    <h1>Subscription Cancelled</h1>
    <p>Hi ${name},</p>
    <p>We've received your cancellation request for your Inicio Official subscription.</p>
    <div class="info-box">
      <p><strong>Your Pro access continues until:</strong> ${accessUntil}</p>
      <p>After this date, your account will revert to the free Basic plan with 5 credits per month.</p>
    </div>
    <p>We're sorry to see you go! If there's anything we could have done better, we'd love to hear your feedback.</p>
    <p>Changed your mind? You can resubscribe anytime:</p>
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL || "https://inicioofficial.com"}/billing" class="button">Resubscribe to Pro</a>
    </p>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #737373;">Have questions or concerns? Reply to this email and we'll help you out.</p>
  `;

  return baseTemplate({
    title: "Your Inicio Official subscription has been cancelled",
    content,
  });
}

export interface CreditsExhaustedTemplateOptions {
  name: string;
  resetDate: string;
}

/**
 * Credits exhausted template
 * Subject: "You've used all your Inicio Official credits"
 * From: noreply@inicioofficial.com
 */
export function creditsExhaustedTemplate({
  name,
  resetDate,
}: CreditsExhaustedTemplateOptions): string {
  const content = `
    <h1>Credits Exhausted</h1>
    <p>Hi ${name},</p>
    <p>You've used all of your monthly Inicio Official credits. Your credits will automatically reset on <strong>${resetDate}</strong>.</p>
    <div class="info-box">
      <p><strong>Want to keep creating?</strong></p>
      <p>Upgrade to Inicio Official Pro for just <strong>$1.99/month</strong> and get 50 credits every month!</p>
    </div>
    <p><strong>Pro Benefits:</strong></p>
    <ul class="feature-list">
      <li>50 credits per month (10x more!)</li>
      <li>Priority support</li>
      <li>Faster processing</li>
      <li>Early access to new features</li>
      <li>Ad-free experience</li>
    </ul>
    <p style="text-align: center;">
      <a href="${process.env.FRONTEND_URL || "https://inicioofficial.com"}/billing" class="button">Upgrade to Pro</a>
    </p>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #737373;">Not ready to upgrade? That's okay! Your credits will reset on ${resetDate}.</p>
  `;

  return baseTemplate({
    title: "You've used all your Inicio Official credits",
    content,
  });
}

// ─── OTP Email Templates ───────────────────────────────────────────────────

export interface EmailVerificationOTPTemplateOptions {
  name: string;
  otp: string;
}

/**
 * Email verification OTP template
 * Subject: "Your Inicio Official verification code"
 * From: noreply@inicioofficial.com
 */
export function emailVerificationOTPTemplate({
  name,
  otp,
}: EmailVerificationOTPTemplateOptions): string {
  const content = `
    <h1>Verify Your Email</h1>
    <p>Hi ${name},</p>
    <p>Here is your verification code:</p>
    <div style="background-color: #1a1a2e; border: 2px solid #6366f1; border-radius: 12px; padding: 24px 16px; margin: 24px 0; text-align: center;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #a78bfa; margin: 0 0 12px 0;">Your verification code</p>
      <div style="display: inline-flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
        ${otp.split('').map(d => `<span style="display:inline-block;width:40px;height:52px;line-height:52px;text-align:center;background:#262626;border:1.5px solid #6366f1;border-radius:8px;font-size:24px;font-weight:800;color:#ffffff;font-family:'Courier New',Courier,monospace;">${d}</span>`).join('')}
      </div>
    </div>
    <div class="info-box">
      <p><strong>⏰ This code expires in 10 minutes</strong></p>
    </div>
    <p>Enter this code on the verification page to complete your account setup.</p>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #737373;">If you didn't create a Inicio Official account, you can safely ignore this email.</p>
  `;

  return baseTemplate({
    title: "Your Inicio Official verification code",
    content,
  });
}

export interface ForgotPasswordOTPTemplateOptions {
  name: string;
  otp: string;
}

/**
 * Forgot password OTP template
 * Subject: "Your Inicio Official password reset code"
 * From: noreply@inicioofficial.com
 */
export function forgotPasswordOTPTemplate({
  name,
  otp,
}: ForgotPasswordOTPTemplateOptions): string {
  const content = `
    <h1>Password Reset Code</h1>
    <p>Hi ${name},</p>
    <p>We received a request to reset your Inicio Official password. Here is your reset code:</p>
    <div style="background-color: #262626; border: 2px solid #6366f1; border-radius: 12px; padding: 32px; margin: 32px 0; text-align: center;">
      <div style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #ffffff; font-family: 'Courier New', Courier, monospace;">
        ${otp.split('').join(' ')}
      </div>
    </div>
    <div class="info-box">
      <p><strong>⏰ This code expires in 10 minutes</strong></p>
    </div>
    <p>Enter this code on the password reset page to create a new password.</p>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #737373;">If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
  `;

  return baseTemplate({
    title: "Your Inicio Official password reset code",
    content,
  });
}

export interface SignInOTPTemplateOptions {
  name: string;
  otp: string;
}

/**
 * Sign-in OTP template
 * Subject: "Your Inicio Official sign-in code"
 * From: noreply@inicioofficial.com
 */
export function signInOTPTemplate({
  name,
  otp,
}: SignInOTPTemplateOptions): string {
  const content = `
    <h1>Your Sign-In Code</h1>
    <p>Hi ${name},</p>
    <p>Here is your one-time sign-in code:</p>
    <div style="background-color: #262626; border: 2px solid #6366f1; border-radius: 12px; padding: 32px; margin: 32px 0; text-align: center;">
      <div style="font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #ffffff; font-family: 'Courier New', Courier, monospace;">
        ${otp.split('').join(' ')}
      </div>
    </div>
    <div class="info-box">
      <p><strong>⏰ This code expires in 10 minutes</strong></p>
      <p><strong>⚠️ Never share this code with anyone</strong></p>
    </div>
    <p>Enter this code on the sign-in page to access your account.</p>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #737373;">If you didn't attempt to sign in, please ignore this email and consider changing your password.</p>
  `;

  return baseTemplate({
    title: "Your Inicio Official sign-in code",
    content,
  });
}
