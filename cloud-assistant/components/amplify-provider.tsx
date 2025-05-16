"use client"

import type React from "react"

import { useEffect, useState } from "react"
import configureAmplify from "@/lib/amplify"

interface AmplifyProviderProps {
  children: React.ReactNode
}

export default function AmplifyProvider({ children }: AmplifyProviderProps) {
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    // Configure Amplify on the client side
    try {
      configureAmplify()
      console.log("Amplify configured successfully")
    } catch (error) {
      console.error("Error configuring Amplify:", error)
    }

    setIsConfigured(true)
  }, [])

  // Only render children after Amplify is configured on the client
  // This prevents hydration mismatches
  return <>{isConfigured ? children : null}</>
}
