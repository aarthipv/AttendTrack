import { User } from '../models';

/**
 * Updates the user's session with tokens and claims
 */
export function updateUserSession(
  user: any,
  tokens: any
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

/**
 * Creates or updates a user from OpenID claims
 */
export async function upsertUser(claims: any): Promise<void> {
  const userData = {
    _id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  };

  await User.findByIdAndUpdate(
    userData._id,
    userData,
    { 
      upsert: true, 
      new: true,
      runValidators: true 
    }
  );
}

/**
 * Retrieves a user by ID
 */
export async function getUser(id: string) {
  return await User.findById(id).lean();
}