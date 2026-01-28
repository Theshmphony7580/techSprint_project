import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center w-full justify-center space-y-8 py-16 sm:py-32 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                    Transparency in <br /> Government Projects
                </h1>
                <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl leading-relaxed">
                    A tamper-proof ledger ensuring every government scheme update is permanent, visible, and accountable to every citizen.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/projects">
                    <Button size="lg" className="h-12 px-8 text-base sm:text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        Explore Projects
                    </Button>
                </Link>
                <Link to="/login">
                    <Button variant="outline" size="lg" className="h-12 px-8 text-base sm:text-lg rounded-full border-border/50 hover:bg-secondary/50">
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
                <div>
                    <div className="text-3xl font-bold">Open</div>
                    <div className="text-sm text-muted-foreground uppercase tracking-wider">Access</div>
                </div>
            </div>
        </div>
    );
}
