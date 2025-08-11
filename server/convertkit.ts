// ConvertKit integration for LightPrompt email marketing
import fetch from 'node-fetch';

const CONVERTKIT_API_URL = 'https://api.convertkit.com/v3';

export interface ConvertKitSubscriber {
  id: number;
  first_name: string;
  email_address: string;
  state: 'active' | 'inactive' | 'cancelled';
  created_at: string;
  fields: Record<string, any>;
  tags: string[];
}

export interface ConvertKitForm {
  id: number;
  name: string;
  created_at: string;
  type: string;
}

export class ConvertKitService {
  private apiKey: string;
  private secretKey?: string;

  constructor() {
    this.apiKey = process.env.CONVERTKIT_API_KEY || '';
    this.secretKey = process.env.CONVERTKIT_SECRET_KEY || '';
    
    if (!this.apiKey) {
      console.warn('⚠️ ConvertKit API key not configured');
    }
  }

  // Test ConvertKit connection
  async testConnection(): Promise<{ success: boolean; error?: string; message?: string }> {
    if (!this.apiKey) {
      return { success: false, error: 'ConvertKit API key not configured' };
    }

    try {
      const response = await fetch(`${CONVERTKIT_API_URL}/account?api_key=${this.apiKey}`);
      
      if (response.ok) {
        const data = await response.json();
        return { 
          success: true, 
          message: `Connected to ConvertKit account: ${data.name || 'Account verified'}` 
        };
      } else {
        return { 
          success: false, 
          error: `ConvertKit API error: ${response.status} ${response.statusText}` 
        };
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: `Connection failed: ${error.message}` 
      };
    }
  }

  // Add subscriber to ConvertKit
  async addSubscriber(email: string, firstName?: string, tags: string[] = [], customFields: Record<string, any> = {}): Promise<boolean> {
    if (!this.apiKey) {
      console.error('ConvertKit API key not configured');
      return false;
    }

    try {
      const subscriberData = {
        api_key: this.apiKey,
        email,
        first_name: firstName || '',
        tags: tags.join(','),
        fields: customFields
      };

      const response = await fetch(`${CONVERTKIT_API_URL}/forms/${this.getDefaultFormId()}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriberData)
      });

      return response.ok;
    } catch (error) {
      console.error('ConvertKit subscriber error:', error);
      return false;
    }
  }

  // Add tags to existing subscriber
  async tagSubscriber(email: string, tagName: string): Promise<boolean> {
    if (!this.apiKey) {
      console.error('ConvertKit API key not configured');
      return false;
    }

    try {
      const response = await fetch(`${CONVERTKIT_API_URL}/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) return false;

      const tagsData = await response.json();
      const tag = tagsData.tags?.find((t: any) => t.name === tagName);
      
      if (!tag) {
        console.error(`Tag "${tagName}" not found in ConvertKit`);
        return false;
      }

      // Tag the subscriber
      const tagResponse = await fetch(`${CONVERTKIT_API_URL}/tags/${tag.id}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          email
        })
      });

      return tagResponse.ok;
    } catch (error) {
      console.error('ConvertKit tagging error:', error);
      return false;
    }
  }

  // Send subscriber to specific sequence
  async addToSequence(email: string, sequenceId: number): Promise<boolean> {
    if (!this.apiKey) {
      console.error('ConvertKit API key not configured');
      return false;
    }

    try {
      const response = await fetch(`${CONVERTKIT_API_URL}/sequences/${sequenceId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          email
        })
      });

      return response.ok;
    } catch (error) {
      console.error('ConvertKit sequence error:', error);
      return false;
    }
  }

  // Get subscriber information
  async getSubscriber(email: string): Promise<ConvertKitSubscriber | null> {
    if (!this.apiKey) return null;

    try {
      const response = await fetch(`${CONVERTKIT_API_URL}/subscribers?api_key=${this.apiKey}&email_address=${email}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.subscribers?.[0] || null;
      }
      
      return null;
    } catch (error) {
      console.error('ConvertKit subscriber lookup error:', error);
      return null;
    }
  }

  // Get all forms
  async getForms(): Promise<ConvertKitForm[]> {
    if (!this.apiKey) return [];

    try {
      const response = await fetch(`${CONVERTKIT_API_URL}/forms?api_key=${this.apiKey}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.forms || [];
      }
      
      return [];
    } catch (error) {
      console.error('ConvertKit forms error:', error);
      return [];
    }
  }

  private getDefaultFormId(): string {
    // This should be configured based on your ConvertKit setup
    return process.env.CONVERTKIT_DEFAULT_FORM_ID || '0';
  }
}

// Email marketing workflows using ConvertKit
export class EmailMarketing {
  private convertKit: ConvertKitService;

  constructor() {
    this.convertKit = new ConvertKitService();
  }

  // Test ConvertKit configuration
  async testConfiguration() {
    return await this.convertKit.testConnection();
  }

  // Welcome new user
  async sendWelcomeSequence(email: string, name: string) {
    try {
      // Add to ConvertKit with welcome tag
      const success = await this.convertKit.addSubscriber(
        email, 
        name, 
        ['new-user', 'welcome-sequence'], 
        { 
          signup_source: 'lightprompt-website',
          user_type: 'free'
        }
      );

      if (success) {
        console.log(`✅ Added ${email} to ConvertKit welcome sequence`);
      }

      return success;
    } catch (error) {
      console.error('Welcome sequence error:', error);
      return false;
    }
  }

  // Handle course purchase
  async handleCoursePurchase(email: string, courseName: string) {
    try {
      // Tag as customer and add to course sequence
      await this.convertKit.tagSubscriber(email, 'course-customer');
      await this.convertKit.addSubscriber(
        email, 
        '', 
        ['course-customer', `purchased-${courseName.toLowerCase()}`],
        { 
          purchase_type: 'course',
          course_name: courseName,
          customer_value: 'high'
        }
      );

      console.log(`✅ Processed course purchase for ${email}`);
      return true;
    } catch (error) {
      console.error('Course purchase sequence error:', error);
      return false;
    }
  }

  // Handle subscription upgrade
  async handleSubscriptionUpgrade(email: string, planName: string, planPrice: number) {
    try {
      // Tag with subscription level
      await this.convertKit.tagSubscriber(email, `${planName.toLowerCase()}-subscriber`);
      await this.convertKit.addSubscriber(
        email, 
        '', 
        ['paid-subscriber', planName.toLowerCase()],
        { 
          subscription_plan: planName,
          monthly_value: planPrice,
          customer_type: 'recurring'
        }
      );

      console.log(`✅ Processed subscription upgrade to ${planName} for ${email}`);
      return true;
    } catch (error) {
      console.error('Subscription upgrade sequence error:', error);
      return false;
    }
  }

  // Handle enterprise inquiry
  async handleEnterpriseInquiry(email: string, companyName: string, message: string) {
    try {
      // Add to enterprise prospects
      await this.convertKit.addSubscriber(
        email, 
        '', 
        ['enterprise-prospect', 'high-value-lead'],
        { 
          company_name: companyName,
          inquiry_type: 'enterprise',
          lead_score: 'hot'
        }
      );

      console.log(`✅ Added enterprise prospect ${email} from ${companyName}`);
      return true;
    } catch (error) {
      console.error('Enterprise inquiry sequence error:', error);
      return false;
    }
  }

  // Subscribe to newsletter
  async subscribeToNewsletter(email: string, interests: string[] = []) {
    try {
      const tags = ['newsletter-subscriber', ...interests];
      
      await this.convertKit.addSubscriber(
        email, 
        '', 
        tags,
        { 
          subscription_type: 'newsletter',
          interests: interests.join(',')
        }
      );

      console.log(`✅ Subscribed ${email} to newsletter with interests: ${interests.join(', ')}`);
      return true;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return false;
    }
  }
}