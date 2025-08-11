# ConvertKit (Kit) Integration Guide

## What ConvertKit (now Kit) Integration Provides

ConvertKit is now called "Kit" and provides email marketing automation for your LightPrompt platform. Here's what you get:

### Core Features
- **Email Sequences**: Welcome series, course delivery, ebook delivery
- **Subscriber Management**: Automated tagging and segmentation
- **Landing Pages**: High-converting opt-in pages
- **Automation**: Behavior-triggered emails based on user actions

## Required Setup

### 1. Kit Account & API Keys
You'll need:
- **Kit API Key**: Your secret API key from Kit dashboard
- **Kit API Secret**: For webhook verification (optional but recommended)

Get these from: Kit Dashboard → Account Settings → API

### 2. Environment Variables Needed
```
KIT_API_KEY=your_api_key_here
KIT_API_SECRET=your_api_secret_here (optional)
```

### 3. Kit Forms/Tags Setup
In your Kit account, create:
- **Course Purchase Tag**: "lightprompt-course-purchased" 
- **Ebook Purchase Tag**: "ebook-purchased"
- **Newsletter Form**: For general subscribers
- **Welcome Sequence**: Automated email series

## Integration Points

### For LightPrompt Platform:

1. **After Purchase**: Tag subscribers based on what they bought
2. **Course Access**: Send course login details via email sequence
3. **Ebook Delivery**: Automatically send download link
4. **Community Invites**: Send Discord/community access
5. **Newsletter**: Weekly consciousness/wellness content

### API Endpoints You'd Add:
```javascript
// Add subscriber after purchase
POST /api/kit/subscribe
{
  email: "user@example.com", 
  tags: ["lightprompt-course-purchased"],
  custom_fields: { purchase_date: "2025-01-10" }
}

// Send course access email
POST /api/kit/send-sequence
{
  subscriber_id: "123",
  sequence: "course-welcome-series"
}
```

## Why You Need This

- **Automated Delivery**: Course/ebook access sent automatically
- **Nurture Sequences**: Keep customers engaged with value
- **Reduce Support**: Self-service access delivery
- **Revenue Recovery**: Re-engagement campaigns for inactive users
- **Community Building**: Automated invites to Discord/community

## Cost
Kit pricing starts at $9/month for up to 300 subscribers, scales with list size.

Would you like me to implement the Kit integration with these features?