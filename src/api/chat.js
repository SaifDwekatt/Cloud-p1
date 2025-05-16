// This file should be placed in your backend API folder
// For Next.js, this would be in pages/api/chat.js or app/api/chat/route.js
// For Express, this would be a route handler

import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2"

// Create a Lex client with server-side credentials
const lexClient = new LexRuntimeV2Client({
  region: "us-east-1", // Your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { message, userId } = req.body

    if (!message) {
      return res.status(400).json({ message: "Message is required" })
    }

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

    return res.status(200).json({ message: botReply })
  } catch (error) {
    console.error("Lex API error:", error)
    return res.status(500).json({
      message: "Error communicating with the chatbot",
      error: error.message,
    })
  }
}
