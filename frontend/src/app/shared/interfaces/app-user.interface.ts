import { TrackedItem } from './tracked-item.interface';


export interface AppUser {
  uid: string;
  email: string;
  notificationTokens: string[];
  trackedItems: TrackedItem[];
  profileSettings: {
    email: boolean;
    messenger: boolean;
    push: boolean;
    darkTheme: boolean;
    notificationsEmail: string;
    notificationsMessenger: string;
  };
}
