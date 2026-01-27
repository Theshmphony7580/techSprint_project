import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';

interface Project {
    id: string;
    projectName: string;
    department: string;
    status: string;
    progress: number;
    budget: number;
    location: any;
}

export default function ProjectListPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock API call - in prod use fetch('/api/projects')
        // For now we'll fetch from our server or use mock data if server isn't reachable from client easily (CORS)
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:3001/projects');
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                } else {
                    console.error('Failed to fetch');
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Public Projects</h1>
                <Button>Filter Projects</Button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : projects.length === 0 ? (
                <div className="text-muted-foreground text-center py-10">
                    No projects found. Check back later.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div key={project.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-semibold">{project.projectName}</h2>
                                <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    project.status === 'DELAYED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{project.department}</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Budget:</span>
                                    <span className="font-medium">₹{project.budget}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Progress:</span>
                                    <span className="font-medium">{project.progress}%</span>
                                </div>
                            </div>
                            <Button className="w-full mt-4" variant="secondary" asChild>
                                <Link to={`/projects/${project.id}`}>View Details</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
