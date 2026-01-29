import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-32 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                    Transparency in <br /> Government Projects
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                    A tamper-proof ledger ensuring every government scheme update is permanent, visible, and accountable to every citizen.
                </p>
            </div>
            <div className="flex gap-4 pt-4">
                <Link to="/projects">
                    <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        Explore Projects
                    </Button>
                </Link>
                <Link to="/login">
                    <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full border-border/50 hover:bg-secondary/50">
                        Official Access
                    </Button>
                </Link>
            </div>

            <div className="pt-16 grid grid-cols-3 gap-8 text-center">
                <div>
                    <div className="text-3xl font-bold">100%</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">Transparency</div>
                </div>
                <div>
                    <div className="text-3xl font-bold">Immutable</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">Ledger</div>
                </div>
            </div>

            {/* Features Grid */}
            <section className="py-24 bg-background">
                <div className="container px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Trust This Platform?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Built on principles of modern cryptography and open access, ensuring no data can be manipulated behind closed doors.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-2xl">🔗</div>
                            <h3 className="text-xl font-bold mb-3">Immutable Ledger</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Every sanctioned budget and progress update is cryptographically hashed. Once written, it cannot be edited or deleted.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 text-2xl">📢</div>
                            <h3 className="text-xl font-bold mb-3">Citizen Reporting</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Residents can file complaints with photo evidence directly. Issues are tracked publicly until resolved by officials.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 text-2xl">📊</div>
                            <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Dashboards provide instant insights into fund utilization, delays, and department performance across districts.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-primary text-primary-foreground">
                <div className="container text-center space-y-8">
                    <h2 className="text-3xl font-bold">Ready to promote transparency?</h2>
                    <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
                        Join thousands of citizens and government officials building a more accountable future today.
                    </p>
                    <Link to="/projects">
                        <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full shadow-xl">
                            Start Exploring Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
