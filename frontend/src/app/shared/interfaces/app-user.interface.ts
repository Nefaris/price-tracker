export interface AppUser {
  uid: string;
  email: string;
  notificationTokens: string[];
  trackedUrls: string[];
  profileSettings: {
    email: boolean;
    messenger: boolean;
    push: boolean;
    darkTheme: boolean;
  };
}
