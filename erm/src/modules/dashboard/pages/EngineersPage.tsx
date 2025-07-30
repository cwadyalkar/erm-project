
import { useState } from "react"
import type React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Mail } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/modules/auth/hooks/useAuth"
import { useData } from "@/modules/auth/hooks/useData"
import { Navbar } from "../components/Navbar"

type Status = "Available" | "Busy"

interface FormState {
  name: string
  email: string
  skills: string
  status: Status
}

export default function EngineersPage() {
  const { user } = useAuth()
  const { engineers, addEngineer, updateEngineer, deleteEngineer } = useData()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEngineerId, setEditingEngineerId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    skills: "",
    status: "Available",
  })

  if (!user || user.role !== "Manager") return <div>Access denied</div>

  const handleChange = (key: keyof FormState, value: string) =>
    setFormData(prev => ({ ...prev, [key]: value }))

  const resetForm = () => {
    setFormData({ name: "", email: "", skills: "", status: "Available" })
    setEditingEngineerId(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (engineer: any) => {
    setFormData({
      name: engineer.name,
      email: engineer.email,
      skills: engineer.skills.join(", "),
      status: engineer.status,
    })
    setEditingEngineerId(engineer.id)
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this engineer?")) {
      deleteEngineer(id)
      toast("Engineer deleted successfully")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const skillsArray = formData.skills
      .split(",")
      .map(skill => skill.trim())
      .filter(Boolean)

    const engineerData = {
      name: formData.name,
      email: formData.email,
      skills: skillsArray,
      status: formData.status,
    }

    if (editingEngineerId) {
      updateEngineer(editingEngineerId, engineerData)
      toast("Engineer updated successfully")
    } else {
      addEngineer(engineerData)
      toast("Engineer added successfully")
    }

    resetForm()
  }

  return (
    <div className="min-h-screen tracking-wide bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl tracking-wide font-bold">Engineers</h1>
            <p className="text-muted-foreground">Manage your engineering team</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="cursor-pointer">
                <Plus className="h-4 w-4 mr-2" />
                Add Engineer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingEngineerId ? "Edit Engineer" : "Add New Engineer"}</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "name", label: "Name", type: "text" },
                  { id: "email", label: "Email", type: "email" },
                  {
                    id: "skills",
                    label: "Skills (comma-separated)",
                    type: "text",
                    placeholder: "React, TypeScript, Node.js",
                  },
                ].map(({ id, label, type, placeholder }) => (
                  <div className="space-y-2" key={id}>
                    <Label htmlFor={id}>{label}</Label>
                    <Input
                      id={id}
                      type={type}
                      value={(formData as any)[id]}
                      onChange={e => handleChange(id as keyof FormState, e.target.value)}
                      placeholder={placeholder}
                      required={id !== "skills"}
                    />
                  </div>
                ))}

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={value => handleChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Busy">Busy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingEngineerId ? "Update" : "Add"} Engineer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {engineers.map(engineer => (
            <Card key={engineer.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="tracking-wide text-lg mb-1">{engineer.name}</CardTitle>
                    <div className="flex items-center justify-center  text-sm tracking-wide font-medium text-muted-foreground mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {engineer.email}
                    </div>
                  </div>
                  <Badge
                    variant={engineer.status === "Available" ? "default" : "secondary"}
                  >
                    {engineer.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {engineer.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs tracking-wide rounded-full">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(engineer)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(engineer.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
