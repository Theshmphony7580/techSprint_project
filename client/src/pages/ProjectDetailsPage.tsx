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

    // Event Form State
    const [showEventForm, setShowEventForm] = useState(false);
    const [progressInput, setProgressInput] = useState('');

    const handleEventSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            const res = await fetch(`http://localhost:3001/projects/${id}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    eventType: 'PROGRESS_UPDATE',
                    data: { progress: parseInt(progressInput) }
                })
            });

            if (res.ok) {
                alert('Ledger updated successfully!');
                setShowEventForm(false);
                setProgressInput('');
                window.location.reload(); // Quick refresh to see new hash
            } else {
                alert('Failed to update ledger');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating ledger');
        } finally {
            setUploading(false);
        }
    };

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
                const errorMessage = errData.errors || errData.message || 'Unknown error';
                alert(`Failed: ${errorMessage}`);
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
                                    placeholder="Describe the issue in detail (min 10 chars)..."
                                    minLength={10}
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
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Project Timeline (Immutable Ledger)</h2>
                    {['GOV_EMPLOYEE', 'ADMIN'].includes(user?.role || '') && (
                        <Button onClick={() => setShowEventForm(!showEventForm)} variant={showEventForm ? "secondary" : "default"}>
                            {showEventForm ? 'Cancel Update' : '+ Add Progress Update'}
                        </Button>
                    )}
                </div>

                {showEventForm && (
                    <div className="p-6 mb-6 border rounded-lg bg-blue-50/50 border-blue-100">
                        <h3 className="font-semibold mb-4">Add Official Ledger Event</h3>
                        <form onSubmit={handleEventSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Event Type</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    disabled // For now, only progress updates
                                >
                                    <option>PROGRESS_UPDATE</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">New Progress (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="w-full p-2 border rounded-md"
                                    value={progressInput}
                                    onChange={(e) => setProgressInput(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={uploading}>
                                {uploading ? 'Writing to Ledger...' : 'Commit Immutable Update'}
                            </Button>
                        </form>
                    </div>
                )}

                {/* Timeline rendering same as before */}
                <div className="relative border-l border-border/50 ml-3 space-y-8 pb-8">
                    {timeline.map((event) => (
                        <div key={event.id} className="relative pl-8 group">
                            <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-background border-2 border-muted-foreground group-hover:border-primary group-hover:scale-125 transition-all" />
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <h3 className="font-medium text-foreground">{event.eventType.replace(/_/g, ' ')}</h3>
                                    <span className="text-xs text-muted-foreground tabular-nums">{new Date(event.timestamp).toLocaleString()}</span>
                                </div>
                                <div className="p-4 bg-card rounded-lg border border-border/50 shadow-sm text-sm group-hover:border-primary/20 transition-colors">
                                    {event.eventType === 'PROJECT_CREATED' && event.data && (
                                        <p className="text-muted-foreground">Project sanctioned with budget <span className="font-medium text-foreground">₹{event.data.budget}</span></p>
                                    )}
                                    {event.eventType === 'PROGRESS_UPDATE' && event.data && (
                                        <p className="text-muted-foreground">Progress reported: <span className="font-medium text-foreground">{event.data.progress}%</span></p>
                                    )}
                                    <div className="mt-3 pt-3 border-t border-border/30 text-[10px] font-mono text-muted-foreground break-all opacity-70">
                                        Hash: {event.currentHash}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-8 border-t border-border/50">
                <h2 className="text-2xl font-bold mb-6">Citizen Complaints & Feedback</h2>
                <ComplaintsList projectId={id!} />
            </div>
        </div>
    );
}

function ComplaintsList({ projectId }: { projectId: string }) {
    const { user, token } = useAuth();
    const [complaints, setComplaints] = useState<any[]>([]);
    const [respondingTo, setRespondingTo] = useState<string | null>(null);
    const [responseText, setResponseText] = useState('');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const res = await fetch(`http://localhost:3001/complaints?projectId=${projectId}`);
                if (res.ok) setComplaints(await res.json());
            } catch (err) { console.error(err); }
        };
        fetchComplaints();
    }, [projectId]);

    const handleResolve = async (complaintId: string) => {
        if (!responseText) return alert('Please enter a response');
        try {
            const res = await fetch(`http://localhost:3001/complaints/${complaintId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status: 'RESOLVED', response: responseText })
            });
            if (res.ok) {
                setComplaints(complaints.map(c => c.id === complaintId ? { ...c, status: 'RESOLVED', response: responseText, respondedAt: new Date() } : c));
                setRespondingTo(null);
                setResponseText('');
            } else {
                const data = await res.json();
                alert(`Failed to resolve: ${data.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to resolve: Network error');
        }
    }

    if (complaints.length === 0) return <div className="text-muted-foreground italic">No complaints filed for this project.</div>;

    return (
        <div className="grid gap-6">
            {complaints.map(c => (
                <div key={c.id} className="p-6 rounded-xl border border-border/60 bg-card shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {c.status}
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">{c.complaintType}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>

                    <p className="mb-4 text-foreground/90 leading-relaxed">{c.description}</p>
                    {c.evidenceUrl && (
                        <a href={c.evidenceUrl} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline mb-4 block">
                            View Attached Evidence 📎
                        </a>
                    )}

                    {c.response && (
                        <div className="mt-4 p-4 bg-secondary/30 rounded-lg border border-border/50">
                            <p className="text-sm font-semibold mb-1">Official Response:</p>
                            <p className="text-sm text-foreground/80">{c.response}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                - {new Date(c.respondedAt).toLocaleDateString()}
                            </p>
                        </div>
                    )}

                    {!c.response && ['GOV_EMPLOYEE', 'ADMIN'].includes(user?.role || '') && (
                        <div className="mt-4 pt-4 border-t border-border/40">
                            {respondingTo === c.id ? (
                                <div className="space-y-3">
                                    <textarea
                                        className="w-full p-2 text-sm border rounded-md bg-background"
                                        placeholder="Write public response..."
                                        value={responseText}
                                        onChange={e => setResponseText(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleResolve(c.id)}>Submit Resolution</Button>
                                        <Button size="sm" variant="ghost" onClick={() => setRespondingTo(null)}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <Button size="sm" variant="outline" onClick={() => setRespondingTo(c.id)}>
                                    Respond & Resolve
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
