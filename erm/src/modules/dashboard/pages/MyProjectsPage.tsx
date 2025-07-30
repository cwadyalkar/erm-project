import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, Briefcase } from "lucide-react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useData } from "@/modules/auth/hooks/useData";
import { Navbar } from "../components/Navbar";
import { useMemo } from "react";

// ---------- Types (Update as per your actual models) ----------
interface Project {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: "Not Started" | "In Progress" | "Completed";
  assignedAt?: string;
}

interface Assignment {
  projectId: string;
  engineerId: string;
  assignedAt: string;
}

interface Engineer {
  id: string;
  email: string;
}

// ---------- Component ----------
export default function MyProjectsPage() {
  const { user } = useAuth();
  const { engineers, projects, assignments } = useData() as {
    engineers: Engineer[];
    projects: Project[];
    assignments: Assignment[];
  };

  if (!user || user.role !== "Engineer") {
    return <div>Access denied</div>;
  }

  const currentEngineer = useMemo(
    () => engineers.find((e) => e.email === user.email),
    [engineers, user.email]
  );

  const myProjects = useMemo(() => {
    if (!currentEngineer) return [];

    return assignments
      .filter((a) => a.engineerId === currentEngineer.id)
      .map((assignment) => {
        const project = projects.find((p) => p.id === assignment.projectId);
        return project
          ? { ...project, assignedAt: assignment.assignedAt }
          : null;
      })
      .filter(Boolean) as (Project & { assignedAt: string })[];
  }, [assignments, currentEngineer, projects]);

  const getStatusIcon = (status: Project["status"]) => {
    const classMap = {
      Completed: "text-green-600",
      "In Progress": "text-blue-600",
      "Not Started": "text-gray-600",
    };
    const iconMap = {
      Completed: CheckCircle,
      "In Progress": Clock,
      "Not Started": Calendar,
    };

    const Icon = iconMap[status];
    return <Icon className={`h-4 w-4 ${classMap[status]}`} />;
  };

  const getStatusColor = (status: Project["status"]) => {
    return status === "Completed"
      ? "default"
      : status === "In Progress"
      ? "secondary"
      : "outline";
  };

  const daysUntil = (date: string) => {
    const today = new Date();
    const deadline = new Date(date);
    const diffTime = deadline.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderDeadline = (project: Project & { assignedAt: string }) => {
    const days = daysUntil(project.deadline);

    if (project.status === "Completed") {
      return (
        <div className="text-sm text-green-600 font-medium">
          ✓ Project completed
        </div>
      );
    } else if (days < 0) {
      return (
        <div className="text-sm text-red-600 font-medium">
          ⚠ {Math.abs(days)} days overdue
        </div>
      );
    } else if (days === 0) {
      return (
        <div className="text-sm text-orange-600 font-medium">⏰ Due today</div>
      );
    } else if (days <= 7) {
      return (
        <div className="text-sm text-orange-600 font-medium">
          ⏳ {days} days remaining
        </div>
      );
    } else {
      return (
        <div className="text-sm text-muted-foreground">
          📅 {days} days remaining
        </div>
      );
    }
  };

  const countByStatus = (status: Project["status"]) =>
    myProjects.filter((p) => p.status === status).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <p className="text-muted-foreground">
            Projects currently assigned to you
          </p>
        </div>

        {myProjects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No projects assigned</p>
              <p>You don't have any projects assigned to you yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myProjects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge variant={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="ml-1 font-medium">
                          {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Assigned:</span>
                        <span className="ml-1 font-medium">
                          {new Date(project.assignedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center">
                        {getStatusIcon(project.status)}
                        <span className="ml-2 font-medium">
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      {renderDeadline(project)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {myProjects.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <Clock className="h-8 w-8 text-blue-600 mr-3" />,
                label: "In Progress",
                count: countByStatus("In Progress"),
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-green-600 mr-3" />,
                label: "Completed",
                count: countByStatus("Completed"),
              },
              {
                icon: <Calendar className="h-8 w-8 text-gray-600 mr-3" />,
                label: "Not Started",
                count: countByStatus("Not Started"),
              },
            ].map((item) => (
              <Card key={item.label}>
                <CardContent className="p-4 flex items-center">
                  {item.icon}
                  <div>
                    <p className="text-2xl font-bold">{item.count}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
