# Google AdSense Setup Guide

This application includes Google AdSense integration to monetize PDF downloads. Users will see a 30-second ad before they can download their processed PDF.

## Setup Instructions

### 1. Sign Up for Google AdSense

1. Go to [Google AdSense](https://www.google.com/adsense)
2. Sign up with your Google account
3. Complete the application process
4. Wait for approval (typically takes 1-2 days)

### 2. Get Your Publisher ID

Once approved:
1. Log in to your AdSense account
2. Navigate to **Account** → **Account Information**
3. Find your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### 3. Create an Ad Unit

1. In AdSense dashboard, go to **Ads** → **Ad units**
2. Click **By ad unit** → **Display ads**
3. Name your ad unit (e.g., "PDF Download Ad")
4. Choose **Responsive** ad size
5. Click **Create**
6. Copy the **Ad slot ID** (10-digit number)

### 4. Update the Code

Open `index.html` and replace the placeholder values:

**Line 9** - Replace the publisher ID in the script tag:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossorigin="anonymous"></script>
```

**Lines 106-111** - Replace both the client ID and slot ID in the ad unit:
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="XXXXXXXXXX"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
```

### 5. Verify Setup

1. Deploy your site to a live domain (required for AdSense to work)
2. Test the download functionality
3. Check that ads appear in the modal
4. Verify in AdSense dashboard that impressions are being tracked

## Important Notes

- **Testing Locally**: AdSense ads will NOT display when testing on `localhost`. You must deploy to a live domain.
- **Ad Approval**: New ad units may take a few hours to start showing ads.
- **Ad Policies**: Make sure your site complies with [AdSense Program Policies](https://support.google.com/adsense/answer/48182).
- **Revenue Threshold**: Google pays out when you reach $100 in earnings.

## Troubleshooting

### Ads Not Showing?

1. **Check if deployed**: Ads only work on live domains, not localhost
2. **Wait for approval**: New ad units may take time to activate
3. **Check browser console**: Look for AdSense errors
4. **Verify IDs**: Double-check your publisher ID and ad slot ID
5. **Check ad blockers**: Disable ad blockers to test

### Common Errors

- `adsbygoogle.push() error: No slot size for availableWidth=0` - Ad container too small or hidden
- `AdSense head tag doesn't support data-ad-client` - Wrong format for client ID
- `Ad request from a site not matching approved sites` - Domain not approved in AdSense

## Alternative Ad Networks

If you prefer not to use Google AdSense, you can integrate other ad networks:

- **Media.net** - Contextual ads, good AdSense alternative
- **PropellerAds** - Pop-under and native ads
- **AdThrive** - Premium network (requires significant traffic)
- **Ezoic** - AI-powered ad optimization

To integrate a different network, replace the AdSense code in `index.html` with the ad code from your chosen network.

## Revenue Optimization Tips

1. **Position**: The modal ad is prominent and has good visibility
2. **Timing**: 30 seconds gives enough time for ad impressions
3. **Responsive**: The ad unit is responsive and works on all devices
4. **User Experience**: Balance between monetization and user experience

## Questions?

For AdSense-specific questions, visit the [AdSense Help Center](https://support.google.com/adsense).
