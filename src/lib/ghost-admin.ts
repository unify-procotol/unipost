import GhostAdminAPI from '@tryghost/admin-api';

export interface SubscriptionData {
  email: string;
  name?: string;
  labels?: string[];
}

export interface GhostAdminConfig {
  url: string;
  key: string;
  version: string;
}

export class GhostSubscriptionService {
  private api: GhostAdminAPI;

  constructor(config: GhostAdminConfig) {
    this.api = new GhostAdminAPI({
      url: config.url,
      key: config.key,
      version: config.version,
    });
  }

  async subscribe(data: SubscriptionData): Promise<{ success: boolean; message: string; member?: unknown }> {
    try {
      console.log('[Ghost Subscription] Starting subscription for:', data.email);
      // First check if member already exists
      const existingMembers = await this.api.members.browse({
        filter: `email:'${data.email}'`,
        limit: 1,
      });

      if (existingMembers.length > 0) {
        const existingMember = existingMembers[0];
        
        // If already subscribed, return friendly message
        if (existingMember.subscribed) {
          return {
            success: false,
            message: 'You are already subscribed to this newsletter!',
          };
        }
        
        // If exists but not subscribed, reactivate subscription
        const updatedMember = await this.api.members.edit({
          id: existingMember.id,
          subscribed: true,
          labels: data.labels || [],
        });
        
        return {
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
          member: updatedMember,
        };
      }

      // Create a new member (subscriber) in Ghost
      const member = await this.api.members.add({
        email: data.email,
        name: data.name || '',
        labels: data.labels || [],
        subscribed: true,
      });

      return {
        success: true,
        message: 'Successfully subscribed to newsletter!',
        member,
      };
    } catch (error: unknown) {
      console.error('Ghost subscription error:', error);
      
      // Handle specific Ghost API errors
      if (error && typeof error === 'object' && 'response' in error) {
        const errorResponse = error.response as { data?: { errors?: Array<{ type?: string; context?: string; message?: string }> } };
        if (errorResponse.data?.errors) {
          const ghostError = errorResponse.data.errors[0];

          // Handle duplicate email error
          if (ghostError.type === 'ValidationError' && 
              (ghostError.context?.includes('email') || ghostError.message?.includes('already exists'))) {
            return {
              success: false,
              message: 'This email is already subscribed to our newsletter.',
            };
          }
          
          // Handle invalid email format
          if (ghostError.type === 'ValidationError' && ghostError.context?.includes('email')) {
            return {
              success: false,
              message: 'Please enter a valid email address.',
            };
          }
        }
      }

      return {
        success: false,
        message: 'Failed to subscribe. Please try again later.',
      };
    }
  }

  async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find member by email
      const members = await this.api.members.browse({
        filter: `email:${email}`,
        limit: 1,
      });

      if (members.length === 0) {
        return {
          success: false,
          message: 'Email not found in subscription list.',
        };
      }

      // Update member to unsubscribed
      await this.api.members.edit({
        id: members[0].id,
        subscribed: false,
      });

      return {
        success: true,
        message: 'Successfully unsubscribed from newsletter.',
      };
    } catch (error) {
      console.error('Ghost unsubscribe error:', error);
      return {
        success: false,
        message: 'Failed to unsubscribe. Please try again later.',
      };
    }
  }

  async checkSubscription(email: string): Promise<{ subscribed: boolean; member?: unknown }> {
    try {
      const members = await this.api.members.browse({
        filter: `email:${email}`,
        limit: 1,
      });

      if (members.length === 0) {
        return { subscribed: false };
      }

      return {
        subscribed: members[0].subscribed,
        member: members[0],
      };
    } catch (error) {
      console.error('Ghost check subscription error:', error);
      return { subscribed: false };
    }
  }
}

export function createGhostSubscriptionService(ghostDomain: string, ghostAdminKey: string): GhostSubscriptionService {
  return new GhostSubscriptionService({
    url: ghostDomain,
    key: ghostAdminKey,
    version: 'v5.0',
  });
}
