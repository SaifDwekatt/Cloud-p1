// Amazon Lex utility functions
import { Interactions } from "@aws-amplify/interactions"

// The name of your Lex bot
const BOT_NAME = "CloudAssistantBot"

// Send a message to the Lex bot and get a response
export const sendMessageToLex = async (message: string) => {
  try {
    // Send the message to Lex and get the response
    const response = await Interactions.send({
      botName: BOT_NAME,
      message: message,
    })

    return {
      message: response.message,
      dialogState: response.dialogState,
      intentName: response.intentName,
      slots: response.slots,
      sessionAttributes: response.sessionAttributes,
    }
  } catch (error) {
    console.error("Error sending message to Lex:", error)
    throw error
  }
}
