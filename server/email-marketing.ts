import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Email templates for different marketing scenarios
export const EMAIL_TEMPLATES = {
  WELCOME_SEQUENCE: {
    subject: 'Welcome to LightPrompt - Your Journey to Conscious Living Begins',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0f766e; margin-bottom: 10px;">Welcome to LightPrompt</h1>
          <p style="color: #4b5563; font-size: 18px;">Your AI companion for conscious living and career alignment</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #1f2937; margin-bottom: 20px;">What's Next?</h2>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #0f766e; margin-bottom: 10px;">✨ Explore Your Soul Map</h3>
            <p style="color: #4b5563; line-height: 1.6;">Discover your astrological blueprint and how it aligns with your career path through our AI-powered analysis.</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #0f766e; margin-bottom: 10px;">🎯 Find Your VibeMatch Score</h3>
            <p style="color: #4b5563; line-height: 1.6;">Get personalized compatibility assessments to understand your professional potential and alignment.</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #0f766e; margin-bottom: 10px;">🌍 Try GeoPrompt</h3>
            <p style="color: #4b5563; line-height: 1.6;">Experience location-based mindfulness and connect with your environment on a deeper level.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://lightprompt.co/chat" style="background: linear-gradient(135deg, #0f766e, #06b6d4); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Start Your Journey</a>
          </div>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 14px;">
          <p>Questions? Reply to this email - we're here to help!</p>
          <p>LightPrompt Team | Conscious AI for Human Connection</p>
        </div>
      </div>
    `
  },

  ENTERPRISE_INQUIRY_RESPONSE: {
    subject: 'Thank you for your Enterprise inquiry - LightPrompt',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed;">LightPrompt Enterprise</h1>
          <p style="color: #4b5563; font-size: 16px;">Professional wellness solutions for organizations</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; border-left: 4px solid #7c3aed;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Thank You for Your Interest</h2>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            We've received your enterprise inquiry and our team is reviewing your specific requirements. 
            We'll get back to you within 24 hours with a customized proposal.
          </p>
          
          <h3 style="color: #7c3aed; margin-bottom: 15px;">What to Expect:</h3>
          <ul style="color: #4b5563; line-height: 1.8;">
            <li>Custom pricing based on your organization size</li>
            <li>White-label options and API access discussion</li>
            <li>Implementation timeline and support structure</li>
            <li>Dedicated account manager assignment</li>
          </ul>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-top: 25px;">
            <h4 style="color: #1f2937; margin-bottom: 10px;">Quick Questions?</h4>
            <p style="color: #4b5563; margin-bottom: 15px;">Email us directly: <a href="mailto:lightprompt.co@gmail.com" style="color: #7c3aed;">lightprompt.co@gmail.com</a></p>
            <p style="color: #4b5563;">Or schedule a call: <a href="https://calendly.com/lightprompt" style="color: #7c3aed;">Book Demo</a></p>
          </div>
        </div>
      </div>
    `
  },

  SUBSCRIPTION_CONFIRMATION: {
    subject: 'Welcome to {{PLAN_NAME}} - Your LightPrompt subscription is active',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0f766e;">Subscription Confirmed!</h1>
          <p style="color: #4b5563; font-size: 18px;">Welcome to {{PLAN_NAME}}</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; border: 2px solid #0f766e;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Your Plan Details</h2>
          <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <p style="color: #4b5563; margin: 0;"><strong>Plan:</strong> {{PLAN_NAME}}</p>
            <p style="color: #4b5563; margin: 10px 0 0 0;"><strong>Monthly Cost:</strong> ${{PLAN_PRICE}}</p>
          </div>
          
          <h3 style="color: #0f766e; margin-bottom: 15px;">What You Get:</h3>
          <ul style="color: #4b5563; line-height: 1.8;">
            <li>{{PLAN_FEATURES}}</li>
          </ul>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://lightprompt.co/dashboard" style="background: linear-gradient(135deg, #0f766e, #06b6d4); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Access Dashboard</a>
          </div>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px;">
          <p>Manage your subscription anytime in your dashboard</p>
        </div>
      </div>
    `
  },

  NEWSLETTER_TEMPLATE: {
    subject: 'Cosmic Insights: {{WEEK_THEME}} - LightPrompt Weekly',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed;">LightPrompt Weekly</h1>
          <p style="color: #4b5563;">Cosmic Insights for Conscious Living</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">This Week: {{WEEK_THEME}}</h2>
          <p style="color: #4b5563; line-height: 1.6;">{{WEEKLY_MESSAGE}}</p>
          
          <div style="background: #faf5ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #7c3aed; margin-bottom: 15px;">✨ Astrological Highlight</h3>
            <p style="color: #4b5563; line-height: 1.6;">{{ASTRO_INSIGHT}}</p>
          </div>
          
          <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #0f766e; margin-bottom: 15px;">🎯 Career Alignment Tip</h3>
            <p style="color: #4b5563; line-height: 1.6;">{{CAREER_TIP}}</p>
          </div>
        </div>
      </div>
    `
  }
};

// Email marketing functions
export class EmailMarketing {
  static async sendWelcomeEmail(userEmail: string, userName: string) {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('⚠️ SendGrid not configured, skipping welcome email');
      return false;
    }

    try {
      const msg = {
        to: userEmail,
        from: {
          email: 'hello@lightprompt.co',
          name: 'LightPrompt Team'
        },
        subject: EMAIL_TEMPLATES.WELCOME_SEQUENCE.subject,
        html: EMAIL_TEMPLATES.WELCOME_SEQUENCE.html.replace('{{USER_NAME}}', userName),
      };

      await sgMail.send(msg);
      console.log(`✅ Welcome email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      return false;
    }
  }

  static async sendEnterpriseInquiryResponse(inquiryData: any) {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('⚠️ SendGrid not configured, skipping enterprise response');
      return false;
    }

    try {
      const msg = {
        to: inquiryData.email,
        from: {
          email: 'sales@lightprompt.co',
          name: 'LightPrompt Sales Team'
        },
        subject: EMAIL_TEMPLATES.ENTERPRISE_INQUIRY_RESPONSE.subject,
        html: EMAIL_TEMPLATES.ENTERPRISE_INQUIRY_RESPONSE.html
          .replace('{{COMPANY_NAME}}', inquiryData.company)
          .replace('{{USER_NAME}}', inquiryData.name),
      };

      await sgMail.send(msg);
      console.log(`✅ Enterprise response sent to ${inquiryData.email}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send enterprise response:', error);
      return false;
    }
  }

  static async sendSubscriptionConfirmation(userEmail: string, planDetails: any) {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('⚠️ SendGrid not configured, skipping subscription confirmation');
      return false;
    }

    try {
      let planFeatures = '';
      if (planDetails.tier === 'growth') {
        planFeatures = 'Unlimited AI conversations, Advanced astrology features, VibeMatch compatibility, Priority support';
      } else if (planDetails.tier === 'resonance') {
        planFeatures = 'Everything in Growth, Custom AI training, Advanced analytics, API access, White-label options';
      }

      const msg = {
        to: userEmail,
        from: {
          email: 'billing@lightprompt.co',
          name: 'LightPrompt Billing'
        },
        subject: EMAIL_TEMPLATES.SUBSCRIPTION_CONFIRMATION.subject
          .replace('{{PLAN_NAME}}', planDetails.name),
        html: EMAIL_TEMPLATES.SUBSCRIPTION_CONFIRMATION.html
          .replace(/{{PLAN_NAME}}/g, planDetails.name)
          .replace('{{PLAN_PRICE}}', planDetails.price)
          .replace('{{PLAN_FEATURES}}', planFeatures),
      };

      await sgMail.send(msg);
      console.log(`✅ Subscription confirmation sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send subscription confirmation:', error);
      return false;
    }
  }

  static async sendNewsletterToList(subscribers: string[], content: any) {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('⚠️ SendGrid not configured, skipping newsletter');
      return false;
    }

    try {
      const messages = subscribers.map(email => ({
        to: email,
        from: {
          email: 'insights@lightprompt.co',
          name: 'LightPrompt Insights'
        },
        subject: EMAIL_TEMPLATES.NEWSLETTER_TEMPLATE.subject
          .replace('{{WEEK_THEME}}', content.theme),
        html: EMAIL_TEMPLATES.NEWSLETTER_TEMPLATE.html
          .replace('{{WEEK_THEME}}', content.theme)
          .replace('{{WEEKLY_MESSAGE}}', content.message)
          .replace('{{ASTRO_INSIGHT}}', content.astroInsight)
          .replace('{{CAREER_TIP}}', content.careerTip),
      }));

      await sgMail.send(messages);
      console.log(`✅ Newsletter sent to ${subscribers.length} subscribers`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send newsletter:', error);
      return false;
    }
  }

  static async testEmailConfiguration() {
    if (!process.env.SENDGRID_API_KEY) {
      return { success: false, error: 'SendGrid API key not configured' };
    }

    try {
      // Test with a simple email to verify configuration
      const testMsg = {
        to: 'lightprompt.co@gmail.com',
        from: 'lightprompt.co@gmail.com', // Use verified sender email
        subject: 'Email Marketing Test - Configuration Successful',
        text: 'This is a test email to verify SendGrid integration is working properly.',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #0f766e;">Email Marketing Test</h2>
            <p>This test email confirms that your SendGrid integration is working properly!</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Status:</strong> ✅ Email system operational</p>
          </div>
        `
      };

      await sgMail.send(testMsg);
      return { 
        success: true, 
        message: 'Email configuration test successful! Check lightprompt.co@gmail.com for confirmation.' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      };
    }
  }
}