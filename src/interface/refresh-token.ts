import { UserDocument } from "./user";

export interface RefreshToken {
  id: number;
  user: UserDocument;
  token: string;
  expires_at: Date;
  fingerprint?: string;
  user_agent?: string;
  is_revoked: boolean;
  revoked_reason?: string;
  revoked_at?: Date;
  last_used_at?: Date;
  created_at: Date;
  updated_at: Date;
}
