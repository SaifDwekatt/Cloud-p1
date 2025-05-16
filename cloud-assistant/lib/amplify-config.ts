// AWS Amplify configuration file
// This file contains the configuration for AWS Amplify services

// Note: In a real application, you would store sensitive values in environment variables
// For this example, we're including them directly in the config for demonstration purposes

const amplifyConfig = {
  Auth: {
    // Amazon Cognito configuration
    region: "us-east-1", // Replace with your AWS region
    userPoolId: "us-east-1_xxxxxxxx", // Replace with your Cognito User Pool ID
    userPoolWebClientId: "xxxxxxxxxxxxxxxxxxxxxxxxxx", // Replace with your App Client ID
    mandatorySignIn: true,
    authenticationFlowType: "USER_SRP_AUTH",
  },
  API: {
    GraphQL: {
      endpoint: "https://xxxxxxxxxxxxxxxxxxxxxxxxxx.appsync-api.us-east-1.amazonaws.com/graphql", // Replace with your AppSync endpoint
      region: "us-east-1", // Replace with your AWS region
      defaultAuthMode: "AMAZON_COGNITO_USER_POOLS", // Use string value instead of enum
    },
  },
  Interactions: {
    bots: {
      CloudAssistantBot: {
        // Replace with your Lex bot name
        name: "CloudAssistantBot", // Replace with your Lex bot name
        alias: "$LATEST", // Replace with your bot alias
        region: "us-east-1", // Replace with your AWS region
      },
    },
  },
  Storage: {
    S3: {
      bucket: "cloud-assistant-storage", // Replace with your S3 bucket name
      region: "us-east-1", // Replace with your AWS region
    },
  },
}

export default amplifyConfig
