import { ObjectId } from 'mongodb';

export interface AlertSettings {
  _id?: ObjectId;
  muted: boolean;
  volume: number;
  globalSound: string;
  pollingInterval: number;
  desktopNotifs: boolean;
  events: {
    key: string;
    label: string;
    emoji: string;
    enabled: boolean;
    sound: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export const createDefaultAlertSettings = (): Omit<AlertSettings, '_id' | 'createdAt' | 'updatedAt'> => {
  return {
    muted: false,
    volume: 1,
    globalSound: 'Notification Bell',
    pollingInterval: 30,
    desktopNotifs: false,
    events: [
      { key: 'deposits',    label: 'New Deposit',          emoji: '💰', enabled: true, sound: 'Cash Register' },
      { key: 'withdrawals', label: 'New Withdrawal',        emoji: '📤', enabled: true, sound: 'Alert Chime' },
      { key: 'users',       label: 'New User Registration', emoji: '👤', enabled: true, sound: 'Notification Bell' },
      { key: 'kyc',         label: 'New KYC Submission',    emoji: '🛡️', enabled: true, sound: 'Soft Ping' },
      { key: 'investments', label: 'New Investment',        emoji: '📈', enabled: true, sound: 'Success Tone' },
      { key: 'giftcards',   label: 'New Gift Card',         emoji: '🎁', enabled: true, sound: 'Double Beep' },
      { key: 'paystack',    label: 'New Paystack Txn',      emoji: '💳', enabled: true, sound: 'Notification Bell' },
    ],
  };
};
