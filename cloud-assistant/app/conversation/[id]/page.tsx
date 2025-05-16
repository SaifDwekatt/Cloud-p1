"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"
import { getConversation } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

export default function ConversationPage() {
  const router = useRouter()
  const params = useParams()
  const conversationId = params.id as string

  const [loading, setLoading] = useState(true)
  const [conversation, setConversation] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuthAndLoadConversation = async () => {
      try {
        // Check if user is authenticated
        const authenticated = await isAuthenticated()
        if (!authenticated) {
          router.push("/login")
          return
        }

        // Load conversation data
        const conversationData = await getConversation(conversationId)
        if (!conversationData) {
          setError("Conversation not found")
          return
        }

        setConversation(conversationData)

        // Format messages for the chat interface
        const formattedMessages = conversationData.messages.items.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.sender,
          timestamp: new Date(msg.createdAt),
        }))

        // Sort messages by timestamp
        formattedMessages.sort((a: Message, b: Message) => a.timestamp.getTime() - b.timestamp.getTime())

        setMessages(formattedMessages)
      } catch (error) {
        console.error("Error loading conversation:", error)
        setError("Failed to load conversation")
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadConversation()
  }, [conversationId, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-14 items-center border-b bg-white px-4">
        <Link href="/dashboard" className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="ml-4 font-medium">{conversation?.title || "Conversation"}</h1>
      </header>

      <div className="flex-1 overflow-hidden">
        <ChatInterface initialMessages={messages} conversationId={conversationId} />
      </div>
    </div>
  )
}
