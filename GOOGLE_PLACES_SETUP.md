# Google Places API Setup Guide

## Overview
This application now includes Google Places Autocomplete functionality for address inputs, restricted to New South Wales, Australia only.

## Setup Instructions

### 1. Get a Google Places API Key
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Places API
   - Maps JavaScript API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to:
   - Only the APIs you enabled
   - Your domain (for production)

### 2. Environment Configuration
Create a `.env` file in the root directory with your API key:

```bash
REACT_APP_GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

### 3. Features
- **Address Autocomplete**: Real-time address suggestions as you type
- **NSW Restriction**: Only shows addresses in New South Wales, Australia
- **Form Integration**: Automatically populates form fields with selected addresses
- **Validation**: Ensures addresses are within NSW bounds

### 4. How It Works
- Uses Google Places AutocompleteService for predictions
- Filters results to NSW using geographic bounds and address components
- Captures full formatted addresses when users make selections
- Integrates seamlessly with existing form validation

### 5. Security Notes
- API key is restricted to your domain
- Only address-related APIs are enabled
- Bounds are strictly enforced on both client and server side

### 6. Troubleshooting
- Ensure your API key has the correct permissions
- Check that Places API is enabled in Google Cloud Console
- Verify the API key is correctly set in your environment variables
- Check browser console for any error messages

## API Usage
The component automatically handles:
- Loading Google Maps JavaScript API
- Initializing Places services
- Managing autocomplete predictions
- Handling user selections
- Form state updates

No additional configuration is required once the API key is set.
