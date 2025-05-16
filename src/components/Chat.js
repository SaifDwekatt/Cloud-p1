"use client"

import { useState, useEffect } from "react"
import { Amplify } from "aws-amplify"
import { getCurrentUser } from "aws-amplify/auth"
import awsExports from "../aws-exports"

// Configure Amplify with the provided configuration
Amplify.configure(awsExports)

// Mock Lex responses for development
const mockLexResponses = {
  hello: "Hi there! How can I help you today?",
  "how are you": "I'm just a bot, but I'm functioning well. How can I assist you?",
  "what can you do": "I can answer questions, provide information, or just chat with you. What would you like to know?",
  help: "I can assist with various tasks. Try asking me about products, services, or general information.",
  bye: "Goodbye! Feel free to chat again if you need anything.",
  default: "I'm not sure how to respond to that. Could you try rephrasing or ask me something else?",
  // Add EC2-related mock responses
  "list ec2 instances": `Here are your EC2 instances in us-east-1:

1. Web Server (i-0abc123def456789)
   Type: t2.micro
   State: running
   Public IP: 54.123.45.67
   Private IP: 172.31.45.67

2. Database Server (i-0def456789abc1234)
   Type: t3.medium
   State: running
   Public IP: N/A
   Private IP: 172.31.67.89

3. Test Instance (i-0123456789abcdef0)
   Type: t2.nano
   State: stopped
   Public IP: N/A
   Private IP: 172.31.12.34`,
  "show ec2": `Here are your EC2 instances in us-east-1:

1. Web Server (i-0abc123def456789)
   Type: t2.micro
   State: running
   Public IP: 54.123.45.67
   Private IP: 172.31.45.67

2. Database Server (i-0def456789abc1234)
   Type: t3.medium
   State: running
   Public IP: N/A
   Private IP: 172.31.67.89

3. Test Instance (i-0123456789abcdef0)
   Type: t2.nano
   State: stopped
   Public IP: N/A
   Private IP: 172.31.12.34`,
}

function Chat() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [useMockApi, setUseMockApi] = useState(true) // Set to false when your real API is ready
  const [ec2Instances, setEc2Instances] = useState([])

  useEffect(() => {
    async function initChat() {
      setIsLoading(true)
      try {
        // Check if user is authenticated
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        console.log("Authenticated user:", currentUser)

        // Add welcome message
        setMessages([
          {
            from: "bot",
            text: `Hello ${currentUser.username || "there"}! How can I help you today? You can ask me to "List EC2 instances in us-east-1".`,
          },
        ])

        setError(null)
      } catch (authErr) {
        console.error("Authentication error:", authErr)
        setError("You need to be signed in to use the chatbot. Please sign in first.")
      } finally {
        setIsLoading(false)
      }
    }

    initChat()
  }, [])

  // Mock function to simulate Lex responses
  const getMockResponse = (userInput) => {
    // Convert to lowercase for case-insensitive matching
    const input = userInput.toLowerCase()

    // Check for EC2-related queries
    if (input.includes("list ec2") || input.includes("show ec2") || input.includes("ec2 instances")) {
      if (input.includes("us-east-1") || !input.includes("us-")) {
        return mockLexResponses["list ec2 instances"]
      } else {
        return "I can only list EC2 instances in the us-east-1 region at the moment."
      }
    }

    // Check for exact matches
    if (mockLexResponses[input]) {
      return mockLexResponses[input]
    }

    // Check for partial matches
    for (const key in mockLexResponses) {
      if (input.includes(key)) {
        return mockLexResponses[key]
      }
    }

    // Default response
    return mockLexResponses.default
  }

  // Function to format EC2 instance data
  const renderEC2InstanceMessage = (message, instances) => {
    if (!instances || instances.length === 0) {
      return <span>{message}</span>
    }

    // If the message contains EC2 instance data, format it nicely
    if (message.includes("EC2 instances")) {
      return (
        <div>
          <p>Here are your EC2 instances in us-east-1:</p>
          <div style={{ marginTop: "10px" }}>
            {instances.map((instance, index) => (
              <div
                key={instance.id}
                style={{
                  marginBottom: "15px",
                  padding: "10px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  border: `2px solid ${instance.state === "running" ? "#4caf50" : "#f44336"}`,
                }}
              >
                <div style={{ fontWeight: "bold" }}>
                  {index + 1}. {instance.name} ({instance.id})
                </div>
                <div style={{ marginLeft: "15px", fontSize: "14px" }}>
                  <div>Type: {instance.type}</div>
                  <div>
                    State:{" "}
                    <span
                      style={{
                        color: instance.state === "running" ? "#4caf50" : "#f44336",
                        fontWeight: "bold",
                      }}
                    >
                      {instance.state}
                    </span>
                  </div>
                  <div>Public IP: {instance.publicIp}</div>
                  <div>Private IP: {instance.privateIp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return <span>{message}</span>
  }

  const sendMessage = async () => {
    if (isLoading) {
      setMessages((prev) => [...prev, { from: "bot", text: "⏳ Still initializing the chat..." }])
      return
    }

    const userInput = input.trim()
    if (!userInput) return

    setMessages((prev) => [...prev, { from: "user", text: userInput }])
    setInput("")

    // Show typing indicator
    setMessages((prev) => [...prev, { from: "bot", text: "...", isTyping: true, id: Date.now() }])

    try {
      let botReply
      let instances = []

      if (useMockApi) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        botReply = getMockResponse(userInput)

        // If this is an EC2 query, create mock instance data
        if (userInput.toLowerCase().includes("ec2")) {
          instances = [
            {
              id: "i-0abc123def456789",
              type: "t2.micro",
              state: "running",
              name: "Web Server",
              publicIp: "54.123.45.67",
              privateIp: "172.31.45.67",
            },
            {
              id: "i-0def456789abc1234",
              type: "t3.medium",
              state: "running",
              name: "Database Server",
              publicIp: "N/A",
              privateIp: "172.31.67.89",
            },
            {
              id: "i-0123456789abcdef0",
              type: "t2.nano",
              state: "stopped",
              name: "Test Instance",
              publicIp: "N/A",
              privateIp: "172.31.12.34",
            },
          ]
        }
      } else {
        // Real API call - use this when your backend is ready
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userInput,
            userId: user?.username || "anonymous-user",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error communicating with the chatbot")
        }

        const data = await response.json()
        botReply = data.message

        // If the response includes EC2 instances
        if (data.instances) {
          instances = data.instances
        }
      }

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => !msg.isTyping))

      // Set EC2 instances if available
      if (instances.length > 0) {
        setEc2Instances(instances)
      }

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: botReply,
          instances: instances.length > 0 ? instances : null,
        },
      ])
    } catch (err) {
      console.error("Error sending message:", err)

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => !msg.isTyping))

      setMessages((prev) => [
        ...prev,
        { from: "bot", text: `❌ Error: ${err.message || "Could not communicate with the chatbot."}` },
      ])
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Lex Chatbot {useMockApi && <span style={{ fontSize: "14px", color: "#666" }}>(Mock Mode)</span>}</h2>

      {user && <div style={{ marginBottom: 10, fontSize: 14, color: "#666" }}>Signed in as: {user.username}</div>}

      {error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "10px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          minHeight: 300,
          maxHeight: 500,
          border: "1px solid #ccc",
          padding: 10,
          overflowY: "auto",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.length === 0 && !isLoading && !error && (
          <p style={{ color: "#666", textAlign: "center" }}>Send a message to start chatting with the bot.</p>
        )}

        {isLoading && <p style={{ textAlign: "center", color: "#666" }}>⏳ Initializing chat client...</p>}

        {messages.map((msg, i) => (
          <div
            key={msg.id || i}
            style={{
              textAlign: msg.from === "user" ? "right" : "left",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                backgroundColor: msg.from === "user" ? "#e3f2fd" : "#ffffff",
                padding: "8px 12px",
                borderRadius: "12px",
                maxWidth: "80%",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              {msg.isTyping ? (
                <span>Typing...</span>
              ) : msg.instances ? (
                renderEC2InstanceMessage(msg.text, msg.instances)
              ) : (
                <span>{msg.text}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          style={{
            flex: 1,
            padding: 10,
            borderRadius: "4px 0 0 4px",
            border: "1px solid #ccc",
            borderRight: "none",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try asking 'List EC2 instances in us-east-1'"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={isLoading || !!error}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 15px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "0 4px 4px 0",
            cursor: isLoading || !!error ? "not-allowed" : "pointer",
            opacity: isLoading || !!error ? 0.7 : 1,
          }}
          disabled={isLoading || !!error}
        >
          Send
        </button>
      </div>

      <div style={{ marginTop: 20, fontSize: 14, color: "#666" }}>
        <p>
          <strong>Development Mode:</strong> This chatbot is currently using mock responses. To use the real Lex API:
        </p>
        <ol style={{ paddingLeft: 20 }}>
          <li>Set up the Express server from the previous code</li>
          <li>
            Change <code>useMockApi</code> to <code>false</code> in the Chat.js file
          </li>
          <li>Make sure your proxy is configured correctly</li>
        </ol>
        <button
          onClick={() => setUseMockApi(!useMockApi)}
          style={{
            padding: "5px 10px",
            backgroundColor: useMockApi ? "#4caf50" : "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "5px",
          }}
        >
          {useMockApi ? "Switch to Real API" : "Switch to Mock API"}
        </button>
      </div>
    </div>
  )
}

export default Chat
