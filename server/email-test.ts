import sgMail from '@sendgrid/mail';

// Simple, isolated SendGrid test
export async function testSendGridConnection() {
  try {
    // Get API key from environment
    let apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      return { success: false, error: 'SENDGRID_API_KEY not set in environment' };
    }

    // Ensure proper format
    if (!apiKey.startsWith('SG.')) {
      apiKey = `SG.${apiKey}`;
    }

    // Set API key
    sgMail.setApiKey(apiKey);

    // Create simple test message
    const msg = {
      to: 'lightprompt.co@gmail.com',
      from: 'lightprompt.co@gmail.com',
      subject: 'SendGrid Connection Test',
      text: 'If you receive this email, SendGrid is working correctly.',
      html: '<p>If you receive this email, <strong>SendGrid is working correctly</strong>.</p>'
    };

    // Send the email
    await sgMail.send(msg);

    return { 
      success: true, 
      message: 'Email sent successfully! Check lightprompt.co@gmail.com' 
    };

  } catch (error: any) {
    console.error('SendGrid test error:', error);
    
    if (error.code === 401) {
      return {
        success: false,
        error: 'Authentication failed. API key may be invalid or missing "SG." prefix.'
      };
    }
    
    if (error.code === 403) {
      return {
        success: false,
        error: 'Sender email not verified in SendGrid. Verify lightprompt.co@gmail.com in your SendGrid dashboard.'
      };
    }

    return {
      success: false,
      error: `SendGrid error: ${error.message || 'Unknown error'}`
    };
  }
}