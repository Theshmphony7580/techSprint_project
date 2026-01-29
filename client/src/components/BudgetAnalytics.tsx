

interface Props {
    totalBudget: number;
    budgetSpent: number;
}

export function BudgetAnalytics({ totalBudget, budgetSpent }: Props) {
    // Calculate percentage
    const percentage = Math.min(100, Math.max(0, (budgetSpent / totalBudget) * 100));
    const remaining = totalBudget - budgetSpent;

    // Color Logic
    let colorClass = "text-green-600 stroke-green-600";
    if (percentage > 90) colorClass = "text-red-600 stroke-red-600";
    else if (percentage > 75) colorClass = "text-yellow-500 stroke-yellow-500";

    // SVG Math (Radius 40, Circumference ~251.2)
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="w-full p-6 border rounded-lg bg-card shadow-sm mt-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 w-full text-left">Budget Analytics</h3>

            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* SVG Donut Chart */}
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="50%" cy="50%" r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted/20 text-gray-200"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="50%" cy="50%" r={radius}
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className={`transition-all duration-1000 ease-out ${colorClass}`}
                    />
                </svg>

                {/* Center Text */}
                <div className="absolute flex flex-col items-center text-center">
                    <span className={`text-4xl font-bold ${colorClass.split(' ')[0]}`}>
                        {percentage.toFixed(1)}%
                    </span>
                    <span className="text-sm text-muted-foreground">Spent</span>
                </div>
            </div>

            {/* Legend / Details */}
            <div className="grid grid-cols-2 gap-8 mt-6 w-full max-w-md text-center">
                <div>
                    <p className="text-sm text-muted-foreground">Spent</p>
                    <p className={`text-xl font-bold ${colorClass.split(' ')[0]}`}>₹{budgetSpent.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-xl font-bold text-foreground">₹{remaining.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
