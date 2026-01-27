import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';

export default function GovDashboard() {
    const { user, isAuthenticated, token } = useAuth(); // Get token
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        projectName: '',
        department: '',
        budget: '',
        district: '',
    });
    const [loading, setLoading] = useState(false);

    if (!isAuthenticated) {
        return <div className="p-8 text-center">Please login to access the dashboard.</div>;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    budget: parseFloat(formData.budget),
                    location: { district: formData.district }
                }),
            });

            if (response.ok) {
                const data = await response.json();
                navigate(`/projects/${data.project.id}`);
            } else {
                const errData = await response.json();
                alert(`Failed to create project: ${errData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Error creating project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Government Dashboard</h1>
                <div className="text-sm text-muted-foreground">
                    Department: {user?.role === 'GOV_EMPLOYEE' ? 'Public Works' : 'General'}
                </div>
            </div>

            <div className="max-w-2xl border rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Project Name</label>
                        <input name="projectName" value={formData.projectName} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input px-3" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Department</label>
                        <input name="department" value={formData.department} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input px-3" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Budget (INR)</label>
                            <input name="budget" type="number" value={formData.budget} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input px-3" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">District</label>
                            <input name="district" value={formData.district} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input px-3" required />
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Sanctioning...' : 'Sanction Project'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
