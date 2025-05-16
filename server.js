// Simple Express server to handle API requests
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const { LexRuntimeV2Client, RecognizeTextCommand } = require("@aws-sdk/client-lex-runtime-v2")
const { EC2Client, DescribeInstancesCommand } = require("@aws-sdk/client-ec2")
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors()) // Enable CORS for all routes
app.use(bodyParser.json())

// Create AWS clients with server-side credentials
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}

const lexClient = new LexRuntimeV2Client({
  region: "us-east-1",
  credentials,
})

const ec2Client = new EC2Client({
  region: "us-east-1",
  credentials,
})

// Function to list EC2 instances
async function listEC2Instances() {
  try {
    const command = new DescribeInstancesCommand({})
    const response = await ec2Client.send(command)
    
    let instances = []
    
    // Extract instance information from the response
    if (response.Reservations && response.Reservations.length > 0) {
      response.Reservations.forEach(reservation => {
        if (reservation.Instances && reservation.Instances.length > 0) {
          reservation.Instances.forEach(instance => {
            // Get instance name from tags
            let name = "Unnamed"
            if (instance.Tags) {
              const nameTag = instance.Tags.find(tag => tag.Key === "Name")
              if (nameTag) name = nameTag.Value
            }
            
            instances.push({
              id: instance.InstanceId,
              type: instance.InstanceType,
              state: instance.State?.Name || "unknown",
              name: name,
              publicIp: instance.PublicIpAddress || "N/A",
              privateIp: instance.PrivateIpAddress || "N/A",
            })
          })
        }
      })
    }
    
    return instances
  } catch (error) {
    console.error("Error listing EC2 instances:", error)
    throw error
  }
}

// Simple health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// Endpoint to list EC2 instances directly
app.get("/api/ec2/instances", async (req, res) => {
  try {
    const instances = await listEC2Instances()
    res.status(200).json({ instances })
  } catch (error) {
    res.status(500).json({ 
      message: "Error listing EC2 instances", 
      error: error.message 
    })
  }
})

// Chat API endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, userId } = req.body

    if (!message) {
      return res.status(400).json({ message: "Message is required" })
    }

    console.log(`Received message from ${userId}: ${message}`)

    // Check if the message is asking for EC2 instances
    const lowerMessage = message.toLowerCase()
    if (
      lowerMessage.includes("list ec2") || 
      lowerMessage.includes("show ec2") || 
      lowerMessage.includes("ec2 instances") ||
      (lowerMessage.includes("ec2") && lowerMessage.includes("list"))
    ) {
      try {
        const instances = await listEC2Instances()
        
        if (instances.length === 0) {
          return res.status(200).json({ 
            message: "No EC2 instances found in the us-east-1 region.",
            instances: []
          })
        }
        
        // Format the response
        let responseText = "Here are your EC2 instances in us-east-1:\n\n"
        instances.forEach((instance, index) => {
          responseText += `${index + 1}. ${instance.name} (${instance.id})\n`
          responseText += `   Type: ${instance.type}\n`
          responseText += `   State: ${instance.state}\n`
          responseText += `   Public IP: ${instance.publicIp}\n`
          responseText += `   Private IP: ${instance.privateIp}\n\n`
        })
        
        return res.status(200).json({ 
          message: responseText,
          instances: instances
        })
      } catch (error) {
        console.error("Error processing EC2 request:", error)
        return res.status(200).json({ 
          message: `I couldn't retrieve your EC2 instances. Error: ${error.message}`,
          error: error.message
        })
      }
    }

    // If not asking for EC2 instances, use Lex
    const request = {
      botId: "8D7BQUTCVY", // Your Lex bot ID
      botAliasId: "TSTALIASIDEXAMPLE1", // Your Lex bot alias
      localeId: "en_US",
      sessionId: userId || "user-" + Math.random().toString(36).substring(2, 7),
      text: message,
    }

    const command = new RecognizeTextCommand(request)
    const response = await lexClient.send(command)

    const botReply = response.messages?.[0]?.content || "I didn't catch that."
    console.log(`Bot reply: ${botReply}`)

    return res.status(200).json({ message: botReply })
  } catch (error) {
    console.error("API error:", error)
    return res.status(500).json({
      message: "Error communicating with the chatbot",
      error: error.message,
    })
  }
})

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`API available at http://localhost:${port}/api/chat`)
})
