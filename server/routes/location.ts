// API endpoint for saving user location to profile
import type { Express } from "express";
import { storage } from "../storage";

export function registerLocationRoutes(app: Express) {
  // PUT /api/users/:userId/location - Save user location to profile
  app.put('/api/users/:userId/location', async (req, res) => {
    try {
      const { userId } = req.params;
      const { latitude, longitude, locationPermission, locationLastUpdated } = req.body;

      // Validate required fields
      if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ 
          error: 'Invalid coordinates: latitude and longitude must be numbers' 
        });
      }

      if (!['granted', 'denied', 'unknown'].includes(locationPermission)) {
        return res.status(400).json({ 
          error: 'Invalid locationPermission: must be "granted", "denied", or "unknown"' 
        });
      }

      // Get or create user profile
      let profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        // Create new profile with location data
        profile = await storage.createUserProfile({
          userId,
          latitude: latitude,
          longitude: longitude,
          locationPermission,
          locationLastUpdated: new Date(locationLastUpdated)
        });
      } else {
        // Update existing profile with location data
        profile = await storage.updateUserProfile(userId, {
          latitude: latitude,
          longitude: longitude,
          locationPermission,
          locationLastUpdated: new Date(locationLastUpdated)
        });
      }

      res.json({ 
        success: true, 
        message: 'Location saved successfully',
        location: {
          latitude,
          longitude,
          permission: locationPermission,
          lastUpdated: locationLastUpdated
        }
      });

    } catch (error) {
      console.error('Error saving user location:', error);
      res.status(500).json({ 
        error: 'Failed to save location to profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // GET /api/users/:userId/location - Get user's saved location
  app.get('/api/users/:userId/location', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const profile = await storage.getUserProfile(userId);
      
      if (!profile || !profile.latitude || !profile.longitude) {
        return res.status(404).json({ 
          error: 'No location data found for user',
          hasProfile: !!profile
        });
      }

      res.json({
        latitude: profile.latitude,
        longitude: profile.longitude,
        permission: profile.locationPermission || 'unknown',
        lastUpdated: profile.locationLastUpdated,
        location: profile.location // Human-readable location if available
      });

    } catch (error) {
      console.error('Error fetching user location:', error);
      res.status(500).json({ 
        error: 'Failed to fetch location from profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}