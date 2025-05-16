"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AwsResourceCardProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function AwsResourceCard({ title, description, actionLabel = "Manage", onAction }: AwsResourceCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-medium mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        {onAction && (
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
