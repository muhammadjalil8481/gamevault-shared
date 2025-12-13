import { RoleDocument } from "./roles-permissions";

export interface UserDocument {
  id: number;
  name: string;
  email: string;
  username: string;
  phone_number: string;
  password: string;
  roles: RoleDocument[]
  is_verified: boolean;
  verification_otp?: string;
  verification_otp_sent_at?: Date;
  password_otp?: string;
  password_otp_sent_at?: Date;
  is_active: boolean;
  last_login_at?: Date;
  failed_login_attempts: number;
  locked_until?: Date;
  password_changed_at?: Date;
  profile: UserProfileDocument;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfileDocument {
  id: number;
  user_id: number;
  user: UserDocument;
  bio?: string;
  date_of_birth?: string;
  profile_picture?: string;
  city?: string;
  country?: string;
  created_at: Date;
  updated_at: Date
}
