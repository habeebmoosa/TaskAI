"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface UserPreferencesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserPreferencesDialog({ open, onOpenChange }: UserPreferencesDialogProps) {
  const [preferences, setPreferences] = useState({
    longTermGoals: [""],
    shortTermGoals: [""],
    workDescription: "",
    sortingPreferences: {
      prioritizeDeadlines: true,
      prioritizeComplexity: false,
      prioritizeUrgency: true,
    },
  })

  const handleAddGoal = (type: "longTermGoals" | "shortTermGoals") => {
    setPreferences({
      ...preferences,
      [type]: [...preferences[type], ""],
    })
  }

  const handleGoalChange = (type: "longTermGoals" | "shortTermGoals", index: number, value: string) => {
    const newGoals = [...preferences[type]]
    newGoals[index] = value
    setPreferences({
      ...preferences,
      [type]: newGoals,
    })
  }

  const handleRemoveGoal = (type: "longTermGoals" | "shortTermGoals", index: number) => {
    setPreferences({
      ...preferences,
      [type]: preferences[type].filter((_, i) => i !== index),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Preferences</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-4">
            <Label>Long-term Goals</Label>
            {preferences.longTermGoals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={goal}
                  onChange={(e) => handleGoalChange("longTermGoals", index, e.target.value)}
                  placeholder="Enter a long-term goal"
                />
                <Button variant="outline" size="icon" onClick={() => handleRemoveGoal("longTermGoals", index)}>
                  ×
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => handleAddGoal("longTermGoals")} className="w-full">
              Add Long-term Goal
            </Button>
          </div>
          <div className="grid gap-4">
            <Label>Short-term Goals</Label>
            {preferences.shortTermGoals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={goal}
                  onChange={(e) => handleGoalChange("shortTermGoals", index, e.target.value)}
                  placeholder="Enter a short-term goal"
                />
                <Button variant="outline" size="icon" onClick={() => handleRemoveGoal("shortTermGoals", index)}>
                  ×
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={() => handleAddGoal("shortTermGoals")} className="w-full">
              Add Short-term Goal
            </Button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="workDescription">Work Description</Label>
            <Textarea
              id="workDescription"
              value={preferences.workDescription}
              onChange={(e) => setPreferences({ ...preferences, workDescription: e.target.value })}
              placeholder="Describe your work and responsibilities"
            />
          </div>
          <div className="grid gap-4">
            <Label>Sorting Preferences</Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="deadlines">Prioritize Deadlines</Label>
              <Switch
                id="deadlines"
                checked={preferences.sortingPreferences.prioritizeDeadlines}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    sortingPreferences: {
                      ...preferences.sortingPreferences,
                      prioritizeDeadlines: checked,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="complexity">Prioritize Complexity</Label>
              <Switch
                id="complexity"
                checked={preferences.sortingPreferences.prioritizeComplexity}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    sortingPreferences: {
                      ...preferences.sortingPreferences,
                      prioritizeComplexity: checked,
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="urgency">Prioritize Urgency</Label>
              <Switch
                id="urgency"
                checked={preferences.sortingPreferences.prioritizeUrgency}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    sortingPreferences: {
                      ...preferences.sortingPreferences,
                      prioritizeUrgency: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

