"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, User, Briefcase } from "lucide-react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useData } from "@/modules/auth/hooks/useData";
import { Navbar } from "../components/Navbar";
import { toast } from "sonner";

// Types
interface Engineer {
  id: string;
  name: string;
  status: string;
  skills: string[];
}

interface Project {
  id: string;
  name: string;
  status: string;
  deadline: string;
}

interface Assignment {
  id: string;
  engineerId: string;
  projectId: string;
  assignedAt: string;
}

export default function AssignmentsPage() {
  const { user } = useAuth();
  const { engineers, projects, assignments, addAssignment, removeAssignment } =
    useData();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  if (!user || user.role !== "Manager") {
    return <div>Access denied</div>;
  }

  // Memoized data
  const availableEngineers = useMemo(
    () => engineers.filter((e: Engineer) => e.status === "Available"),
    [engineers]
  );

  const availableProjects = useMemo(
    () => projects.filter((p: Project) => p.status !== "Completed"),
    [projects]
  );

  // Helpers
  const getEngineerName = (id: string) =>
    engineers.find((e: Engineer) => e.id === id)?.name || "Unknown Engineer";

  const getProject = (id: string) =>
    projects.find((p: Project) => p.id === id);

  const handleAssign = () => {
    if (!selectedEngineer || !selectedProject) {
      toast("Please select both engineer and project");
      return;
    }

    const exists = assignments.find(
      (a: Assignment) =>
        a.engineerId === selectedEngineer && a.projectId === selectedProject
    );

    if (exists) {
      toast.error("This assignment already exists");
      return;
    }

    addAssignment({
      engineerId: selectedEngineer,
      projectId: selectedProject,
    });

    toast.success("Assignment created successfully");
    setSelectedEngineer("");
    setSelectedProject("");
    setIsDialogOpen(false);
  };

  const handleRemoveAssignment = (id: string) => {
    if (confirm("Are you sure you want to remove this assignment?")) {
      removeAssignment(id);
      toast("Assignment removed successfully");
    }
  };

  return (
    <div className="min-h-screen tracking-wide bg-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">
              Assign engineers to projects
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Engineer</Label>
                  <Select
                    value={selectedEngineer}
                    onValueChange={setSelectedEngineer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEngineers.map((eng: Engineer) => (
                        <SelectItem key={eng.id} value={eng.id}>
                          {eng.name} - {eng.skills.join(", ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Select Project</Label>
                  <Select
                    value={selectedProject}
                    onValueChange={setSelectedProject}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableProjects.map((proj: Project) => (
                        <SelectItem key={proj.id} value={proj.id}>
                          {proj.name} ({proj.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAssign}>Create Assignment</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Engineer & Project Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Engineers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Available Engineers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableEngineers.length > 0 ? (
                  availableEngineers.map((e: Engineer) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{e.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {e.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge variant="default">Available</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No available engineers
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableProjects.length > 0 ? (
                  availableProjects.map((p: Project) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Deadline: {new Date(p.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={p.status === "In Progress" ? "secondary" : "outline"}
                      >
                        {p.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No active projects
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No assignments yet. Create your first assignment above.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Engineer</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((a: Assignment) => {
                    const project = getProject(a.projectId);
                    const status = project?.status || "Unknown";

                    return (
                      <TableRow key={a.id}>
                        <TableCell>{getEngineerName(a.engineerId)}</TableCell>
                        <TableCell>{project?.name || "Unknown"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              status === "Completed"
                                ? "default"
                                : status === "In Progress"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(a.assignedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveAssignment(a.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
