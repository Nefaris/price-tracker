export interface AppUser {
  uid: string;
  email: string;
  notificationTokens: string[];
  trackedUrls: string[];
  notificationsSettings: {
    email: boolean;
    messenger: boolean;
    push: boolean;
  };
}
