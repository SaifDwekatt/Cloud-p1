"use client"

import { Separator } from "@/components/ui/separator"

interface ConversationHistoryItemProps {
  title: string
  messageCount: number
  date: string
  onClick?: () => void
}

export function ConversationHistoryItem({ title, messageCount, date, onClick }: ConversationHistoryItemProps) {
  return (
    <>
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-md"
        onClick={onClick}
      >
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{messageCount} messages</p>
        </div>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <Separator />
    </>
  )
}
