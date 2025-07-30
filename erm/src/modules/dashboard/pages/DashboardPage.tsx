import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Briefcase, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useData } from "@/modules/auth/hooks/useData";
import { Navbar } from "../components/Navbar";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function DashboardPage() {
  const { user } = useAuth();
  const { engineers, projects, assignments } = useData();

  if (!user) return null;

  const availableEngineers = engineers.filter(e => e.status === "Available").length;
  const busyEngineers = engineers.length - availableEngineers;

  const projectStats = [
    { name: "Not Started", value: projects.filter(p => p.status === "Not Started").length },
    { name: "In Progress", value: projects.filter(p => p.status === "In Progress").length },
    { name: "Completed", value: projects.filter(p => p.status === "Completed").length },
  ];

  const engineerStats = [
    { name: "Available", value: availableEngineers },
    { name: "Busy", value: busyEngineers },
  ];

  const userAssignments = user.role === "Engineer"
    ? assignments.filter(a =>
        engineers.find(e => e.email === user.email)?.id === a.engineerId
      )
    : [];

  const userProjects = userAssignments
    .map(a => projects.find(p => p.id === a.projectId))
    .filter(Boolean);

  const renderStatusBadge = (status: string) => (
    <Badge
    className=""
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
  );

  const ProjectList = ({ projects }: { projects: typeof projects }) => (
    <div className="space-y-4">
      {projects.map(project => (
        <div
          key={project.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm font-medium tracking-wide text-muted-foreground">{project.description}</p>
            <p className="text-xs font-medium  text-muted-foreground mt-1">
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </p>
          </div>
          {renderStatusBadge(project.status)}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen tracking-wide bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
      

        {user.role === "Manager" ? (
          <>
            {/* Manager Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  title: "Total Engineers",
                  icon: <Users className="h-4 w-4 text-muted-foreground" />,
                  value: engineers.length,
                  note: `${availableEngineers} available, ${busyEngineers} busy`,
                },
                {
                  title: "Total Projects",
                  icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
                  value: projects.length,
                  note: `${projects.filter(p => p.status === "In Progress").length} in progress`,
                },
                {
                  title: "Completed",
                  icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
                  value: projects.filter(p => p.status === "Completed").length,
                  note: "Projects completed",
                },
                {
                  title: "Active Assignments",
                  icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                  value: assignments.length,
                  note: "Current assignments",
                },
              ].map(({ title, icon, value, note }) => (
                <Card key={title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className=" font-bold tracking-wide">{title}</CardTitle>
                    {icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{value}</div>
                    <p className="text-sm font-medium tracking-wide text-muted-foreground">{note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={projectStats}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {projectStats.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engineer Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={engineerStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* All Projects */}
            <Card>
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
                <CardDescription className="font-medium">Overview of all projects and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectList projects={projects} />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Engineer Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: "My Projects",
                  icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
                  value: userProjects.length,
                  note: "Currently assigned",
                },
                {
                  title: "In Progress",
                  icon: <Clock className="h-4 w-4 text-muted-foreground" />,
                  value: userProjects.filter(p => p?.status === "In Progress").length,
                  note: "Active projects",
                },
                {
                  title: "Completed",
                  icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
                  value: userProjects.filter(p => p?.status === "Completed").length,
                  note: "Projects done",
                },
              ].map(({ title, icon, value, note }) => (
                <Card key={title}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-semibold">{title}</CardTitle>
                    {icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground">{note}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* My Projects */}
            <Card>
              <CardHeader>
                <CardTitle>My Assigned Projects</CardTitle>
                <CardDescription>Projects currently assigned to you</CardDescription>
              </CardHeader>
              <CardContent>
                {userProjects.length === 0 ? (
                  <p className="text-muted-foreground">No projects assigned yet.</p>
                ) : (
                  <ProjectList projects={userProjects as typeof projects} />
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
