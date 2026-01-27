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
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3001/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchUsers();
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
