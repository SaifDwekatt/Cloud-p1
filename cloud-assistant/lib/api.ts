// GraphQL API utility functions
import { generateClient } from "aws-amplify/api"
import type { GraphQLQuery } from "@aws-amplify/api"

// Define types for our GraphQL operations
type ListConversationsQuery = {
  listConversations: {
    items: Array<{
      id: string
      title: string
      createdAt: string
      updatedAt: string
      messageCount: number
    }>
    nextToken: string | null
  }
}

type GetConversationQuery = {
  getConversation: {
    id: string
    title: string
    messages: {
      items: Array<{
        id: string
        content: string
        sender: string
        createdAt: string
      }>
    }
    createdAt: string
    updatedAt: string
  }
}

type CreateMessageMutation = {
  createMessage: {
    id: string
    conversationId: string
    content: string
    sender: string
    createdAt: string
  }
}

// Create a client for interacting with the GraphQL API
const client = generateClient()

// Example GraphQL queries and mutations
const listConversationsQuery = /* GraphQL */ `
  query ListConversations($limit: Int, $nextToken: String) {
    listConversations(limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        createdAt
        updatedAt
        messageCount
      }
      nextToken
    }
  }
`

const getConversationQuery = /* GraphQL */ `
  query GetConversation($id: ID!) {
    getConversation(id: $id) {
      id
      title
      messages {
        items {
          id
          content
          sender
          createdAt
        }
      }
      createdAt
      updatedAt
    }
  }
`

const createMessageMutation = /* GraphQL */ `
  mutation CreateMessage($input: CreateMessageInput!) {
    createMessage(input: $input) {
      id
      conversationId
      content
      sender
      createdAt
    }
  }
`

// List all conversations for the current user
export const listConversations = async (limit = 10) => {
  try {
    const result = await client.graphql<GraphQLQuery<ListConversationsQuery>>({
      query: listConversationsQuery,
      variables: { limit },
    })

    return result.data?.listConversations?.items || []
  } catch (error) {
    console.error("Error listing conversations:", error)
    throw error
  }
}

// Get a specific conversation with its messages
export const getConversation = async (conversationId: string) => {
  try {
    const result = await client.graphql<GraphQLQuery<GetConversationQuery>>({
      query: getConversationQuery,
      variables: { id: conversationId },
    })

    return result.data?.getConversation
  } catch (error) {
    console.error("Error getting conversation:", error)
    throw error
  }
}

// Create a new message in a conversation
export const createMessage = async (conversationId: string, content: string, sender: "user" | "assistant") => {
  try {
    const result = await client.graphql<GraphQLQuery<CreateMessageMutation>>({
      query: createMessageMutation,
      variables: {
        input: {
          conversationId,
          content,
          sender,
          createdAt: new Date().toISOString(),
        },
      },
    })

    return result.data?.createMessage
  } catch (error) {
    console.error("Error creating message:", error)
    throw error
  }
}
