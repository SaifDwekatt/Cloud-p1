"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cloud, User, LogOut, Settings, HelpCircle, History, Server, Database } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { AwsResourceCard } from "@/components/aws-resource-card"
import { ConversationHistoryItem } from "@/components/conversation-history-item"
import { getCurrentUser, signOut } from "@/lib/auth"
import { listConversations } from "@/lib/api"

interface Conversation {
  id: string
  title: string
  messageCount: number
  updatedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("chat")
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push("/login")
          return
        }
        setUser(currentUser)

        // Load conversations
        const userConversations = await listConversations()
        setConversations(userConversations)
      } catch (error) {
        console.error("Error checking authentication:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            <span className="font-bold">Cloud Assistant</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <Button
              variant={activeTab === "chat" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("chat")}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Chat
            </Button>
            <Button
              variant={activeTab === "history" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("history")}
            >
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
            <Button
              variant={activeTab === "resources" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("resources")}
            >
              <Server className="mr-2 h-4 w-4" />
              Resources
            </Button>
            <Button
              variant={activeTab === "databases" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setActiveTab("databases")}
            >
              <Database className="mr-2 h-4 w-4" />
              Databases
            </Button>
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar>
              <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
              <AvatarFallback>
                {user?.attributes?.given_name?.[0]}
                {user?.attributes?.family_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {user?.attributes?.given_name} {user?.attributes?.family_name}
              </p>
              <p className="text-xs text-gray-500">{user?.attributes?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Cloud className="h-6 w-6" />
            <span className="font-bold">Cloud Assistant</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/profile")}>
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => router.push("/settings")}>
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </header>

        {/* Tabs for Mobile */}
        <div className="md:hidden border-b bg-white">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="chat"
              className={`rounded-none border-b-2 px-4 py-2 ${
                activeTab === "chat" ? "border-primary" : "border-transparent"
              }`}
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className={`rounded-none border-b-2 px-4 py-2 ${
                activeTab === "history" ? "border-primary" : "border-transparent"
              }`}
              onClick={() => setActiveTab("history")}
            >
              History
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className={`rounded-none border-b-2 px-4 py-2 ${
                activeTab === "resources" ? "border-primary" : "border-transparent"
              }`}
              onClick={() => setActiveTab("resources")}
            >
              Resources
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Area */}
        <Tabs value={activeTab} className="flex-1 overflow-hidden">
          <TabsContent value="chat" className="flex flex-col h-full m-0 data-[state=active]:flex-1">
            <ChatInterface
              conversationId={conversations[0]?.id} // Use the first conversation or create a new one
            />
          </TabsContent>

          <TabsContent value="history" className="h-full m-0 data-[state=active]:flex-1 p-4">
            <h2 className="text-xl font-bold mb-4">Conversation History</h2>
            <Card>
              <div className="p-4 space-y-4">
                {conversations.length > 0 ? (
                  conversations.map((conversation) => (
                    <ConversationHistoryItem
                      key={conversation.id}
                      title={conversation.title}
                      messageCount={conversation.messageCount}
                      date={new Date(conversation.updatedAt).toLocaleString()}
                      onClick={() => router.push(`/conversation/${conversation.id}`)}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No conversation history yet.</p>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="h-full m-0 data-[state=active]:flex-1 p-4">
            <h2 className="text-xl font-bold mb-4">AWS Resources</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <AwsResourceCard
                title="EC2 Instances"
                description="3 instances running"
                onAction={() => console.log("Manage EC2 instances")}
              />
              <AwsResourceCard
                title="S3 Buckets"
                description="3 buckets configured"
                onAction={() => console.log("View S3 buckets")}
              />
              <AwsResourceCard
                title="Lambda Functions"
                description="2 functions deployed"
                onAction={() => console.log("View Lambda functions")}
              />
              <AwsResourceCard
                title="IAM Users"
                description="5 users configured"
                onAction={() => console.log("Manage IAM users")}
              />
            </div>
          </TabsContent>

          <TabsContent value="databases" className="h-full m-0 data-[state=active]:flex-1 p-4">
            <h2 className="text-xl font-bold mb-4">Database Services</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <AwsResourceCard
                title="DynamoDB Tables"
                description="2 tables active"
                onAction={() => console.log("Manage DynamoDB tables")}
              />
              <AwsResourceCard
                title="RDS Instances"
                description="1 instance running"
                onAction={() => console.log("View RDS instances")}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
