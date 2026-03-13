// auth/helpers.ts — Subscription/plan helpers removed (gaming site has no paid plans)
// These exports are kept as stubs so imports don't break.
import type { Database } from "../database";

export const FREE_SIGNATURE_LIMIT = 5;
export const PRO_SIGNATURE_LIMIT = 50;

export const FREE_QR_LIMIT = 5;
export const PRO_QR_LIMIT = 50;

export const FREE_CROP_LIMIT = 5;
export const PRO_CROP_LIMIT = 50;

/** Always returns false — no paid plans on gaming site */
export async function isProUser(_db: Database, _userId: string): Promise<boolean> {
  return false;
}

/** Always returns false — no paid plans on gaming site */
export async function isPremiumUser(_db: Database, _userId: string): Promise<boolean> {
  return false;
}
