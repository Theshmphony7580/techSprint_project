import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
    verified: boolean;
    createdAt: string;
}

export default function AdminDashboard() {
    const { token, user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const [usersRes, statsRes] = await Promise.all([
                    fetch('http://localhost:3001/admin/users', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch('http://localhost:3001/analytics/overview', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (usersRes.ok) setUsers(await usersRes.json());
                if (statsRes.ok) setStats(await statsRes.json());
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'ADMIN' || user?.role === 'GOV_EMPLOYEE') {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user, token]);

    const handleVerifyToggle = async (userId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`http://localhost:3001/admin/users/${userId}/verify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ verified: !currentStatus })
            });

            if (res.ok) {
                // Optimistic update
                setUsers(users.map(u => u.id === userId ? { ...u, verified: !currentStatus } : u));
            }
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    if (user?.role !== 'ADMIN') {
        return <div className="p-8 text-center text-red-500">Access Denied: Admins Only</div>;
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Projects</div>
                    <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Total Budget</div>
                    <div className="text-2xl font-bold">₹{(stats?.totalBudget || 0).toLocaleString()}</div>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Active Complaints</div>
                    <div className="text-2xl font-bold">
                        {stats?.complaintsStats.find((c: any) => c.status === 'SUBMITTED')?.count || 0}
                    </div>
                </div>
                <div className="p-4 rounded-xl border bg-card shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">Completion Rate</div>
                    <div className="text-2xl font-bold">
                        {Math.round(((stats?.projectsByStatus.find((s: any) => s.status === 'COMPLETED')?.count || 0) / (stats?.totalProjects || 1)) * 100)}%
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div className="p-6 rounded-xl border bg-card shadow-sm">
                    <h3 className="font-semibold mb-4">Projects by Status</h3>
                    <div className="space-y-4">
                        {stats?.projectsByStatus.map((s: any) => (
                            <div key={s.status} className="flex items-center gap-4">
                                <span className={`w-24 text-xs font-medium px-2 py-1 rounded-full text-center ${s.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                    s.status === 'DELAYED' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>{s.status}</span>
                                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${(s.count / stats.totalProjects) * 100}%` }}
                                    />
                                </div>
                                <span className="text-sm font-medium w-8 text-right">{s.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted">
                        <tr>
                            <th className="p-4 font-medium">Name</th>
                            <th className="p-4 font-medium">Email</th>
                            <th className="p-4 font-medium">Role</th>
                            <th className="p-4 font-medium">Department</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-muted/50">
                                <td className="p-4">{u.name}</td>
                                <td className="p-4">{u.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                        u.role === 'GOV_EMPLOYEE' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="p-4">{u.department || '-'}</td>
                                <td className="p-4">
                                    {u.verified ? (
                                        <span className="text-green-600 font-medium">Verified</span>
                                    ) : (
                                        <span className="text-yellow-600 font-medium">Pending</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {u.role === 'GOV_EMPLOYEE' && (
                                        <Button
                                            size="sm"
                                            variant={u.verified ? "secondary" : "default"}
                                            onClick={() => handleVerifyToggle(u.id, u.verified)}
                                        >
                                            {u.verified ? 'Revoke' : 'Verify'}
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
