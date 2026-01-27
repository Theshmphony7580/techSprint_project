import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


interface TimelineEvent {
    id: string;
    eventType: string;
    data: any;
    timestamp: string;
    currentHash: string;
    previousHash: string;
}

interface ProjectDetails {
    project: any;
    timeline: TimelineEvent[];
    integrity: { valid: boolean; brokenAt?: string };
}

import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';

export default function ProjectDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const { user, token } = useAuth();
    const [projectData, setProjectData] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);

    // Complaint Form State
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    const [complaintType, setComplaintType] = useState('DELAY');
    const [description, setDescription] = useState('');
    const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/projects/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setProjectData(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDetails();
    }, [id]);

    const handleComplaintSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return alert('Please login to file a complaint');

        try {
            let evidenceUrl = '';

            // Step 1: Upload File if exists
            if (evidenceFile) {
                setUploading(true);
                const formData = new FormData();
                formData.append('file', evidenceFile);

                const uploadRes = await fetch('http://localhost:3001/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                if (!uploadRes.ok) {
                    setUploading(false);
                    return alert('Failed to upload evidence');
                }

                const uploadData = await uploadRes.json();
                evidenceUrl = uploadData.url;
                setUploading(false);
            }

            // Step 2: Submit Complaint
            const res = await fetch('http://localhost:3001/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    projectId: id,
                    complaintType,
                    description,
                    evidenceUrl
                })
            });

            if (res.ok) {
                alert('Complaint submitted successfully!');
                setShowComplaintForm(false);
                setDescription('');
                setEvidenceFile(null);
            } else {
                const errData = await res.json();
                alert(`Failed: ${errData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Error submitting complaint');
            setUploading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!projectData) return <div>Project not found</div>;

    const { project, timeline, integrity } = projectData;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{project.projectName}</h1>
                        <p className="text-muted-foreground">{project.department} • {project.location?.district || 'Unknown Location'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className={`px-4 py-2 rounded-lg border ${integrity.valid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                            Integrity Check: {integrity.valid ? 'PASSED ✓' : 'FAILED ⚠'}
                        </div>

                        {user ? (
                            <Button onClick={() => setShowComplaintForm(!showComplaintForm)} variant={showComplaintForm ? "secondary" : "destructive"}>
                                {showComplaintForm ? 'Cancel' : 'Report Issue / File Complaint'}
                            </Button>
                        ) : (
                            <p className="text-sm text-muted-foreground">Login to file a complaint</p>
                        )}
                    </div>
                </div>

                {showComplaintForm && (
                    <div className="p-6 border rounded-lg bg-red-50/50 border-red-100">
                        <h3 className="font-semibold mb-4">File a Verified Complaint</h3>
                        <form onSubmit={handleComplaintSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={complaintType}
                                    onChange={(e) => setComplaintType(e.target.value)}
                                >
                                    <option value="DELAY">Project Delay</option>
                                    <option value="CORRUPTION">Corruption / Bribe</option>
                                    <option value="QUALITY">Low Quality Work</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    className="w-full p-2 border rounded-md"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the issue in detail..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Evidence (Optional)</label>
                                <input
                                    type="file"
                                    className="w-full p-2 border rounded-md"
                                    onChange={(e) => setEvidenceFile(e.target.files ? e.target.files[0] : null)}
                                    accept="image/*,.pdf"
                                />
                            </div>
                            <Button type="submit" disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Submit Complaint'}
                            </Button>
                        </form>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-4">
                    <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Budget</div>
                        <div className="text-xl font-bold">₹{project.budget}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="text-xl font-bold">{project.currentStatus || 'SANCTIONED'}</div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Project Timeline (Immutable Ledger)</h2>
                {/* Timeline rendering same as before */}
                <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-8">
                    {timeline.map((event) => (
                        <div key={event.id} className="relative pl-8">
                            <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <h3 className="font-semibold">{event.eventType}</h3>
                                    <span className="text-sm text-muted-foreground">{new Date(event.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-md text-sm">
                                    {event.eventType === 'PROJECT_CREATED' && event.data && (
                                        <p>Project sanctioned with budget ₹{event.data.budget}</p>
                                    )}
                                    {event.eventType === 'PROGRESS_UPDATE' && event.data && (
                                        <p>Progress reported: {event.data.progress}%</p>
                                    )}
                                    <div className="mt-2 pt-2 border-t border-dashed border-gray-300 text-xs font-mono text-gray-500 break-all">
                                        Hash: {event.currentHash}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
