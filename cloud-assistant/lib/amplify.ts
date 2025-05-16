// AWS Amplify initialization file
import { Amplify } from "aws-amplify"
import amplifyConfig from "./amplify-config"

// Configure Amplify with the configuration
export const configureAmplify = () => {
  // Use type assertion to any to bypass TypeScript checking
  // This is a workaround for TypeScript errors with Amplify v6 configuration
  Amplify.configure(amplifyConfig as any)
}

export default configureAmplify
