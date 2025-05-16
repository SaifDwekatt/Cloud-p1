// Authentication utility functions
import {
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  getCurrentUser as amplifyGetCurrentUser,
  updateUserAttributes as amplifyUpdateUserAttributes,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
  updatePassword as amplifyUpdatePassword,
} from "aws-amplify/auth"

// Sign up a new user
export const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
  try {
    const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          given_name: firstName,
          family_name: lastName,
        },
      },
    })
    return { isSignUpComplete, userId, nextStep }
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  }
}

// Confirm sign up with verification code
export const confirmSignUp = async (email: string, code: string) => {
  try {
    return await amplifyConfirmSignUp({
      username: email,
      confirmationCode: code,
    })
  } catch (error) {
    console.error("Error confirming sign up:", error)
    throw error
  }
}

// Sign in a user
export const signIn = async (email: string, password: string) => {
  try {
    const { isSignedIn, nextStep } = await amplifySignIn({
      username: email,
      password,
    })
    return { isSignedIn, nextStep }
  } catch (error) {
    console.error("Error signing in:", error)
    throw error
  }
}

// Sign out the current user
export const signOut = async () => {
  try {
    await amplifySignOut()
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

// Request password reset
export const forgotPassword = async (email: string) => {
  try {
    return await amplifyResetPassword({
      username: email,
    })
  } catch (error) {
    console.error("Error requesting password reset:", error)
    throw error
  }
}

// Confirm password reset with verification code
export const confirmForgotPassword = async (email: string, code: string, newPassword: string) => {
  try {
    return await amplifyConfirmResetPassword({
      username: email,
      confirmationCode: code,
      newPassword,
    })
  } catch (error) {
    console.error("Error confirming password reset:", error)
    throw error
  }
}

// Change password for authenticated user
export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    return await amplifyUpdatePassword({
      oldPassword,
      newPassword,
    })
  } catch (error) {
    console.error("Error changing password:", error)
    throw error
  }
}

// Get current authenticated user
export const getCurrentUser = async () => {
  try {
    return await amplifyGetCurrentUser()
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Update user attributes
export const updateUserAttributes = async (attributes: Record<string, string>) => {
  try {
    const userAttributes: Record<string, string> = {}

    // Convert the attributes object to the format expected by Amplify
    Object.entries(attributes).forEach(([key, value]) => {
      userAttributes[key] = value
    })

    return await amplifyUpdateUserAttributes({
      userAttributes,
    })
  } catch (error) {
    console.error("Error updating user attributes:", error)
    throw error
  }
}

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    await amplifyGetCurrentUser()
    return true
  } catch {
    return false
  }
}
