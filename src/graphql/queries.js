// Example query to fetch previous conversations (AppSync must be configured)
export const listConversations = /* GraphQL */ `
  query ListConversations {
    listConversations {
      items {
        id
        user
        message
        createdAt
      }
    }
  }
`;
