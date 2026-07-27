import { motion } from "framer-motion";
import { Calendar, Tag } from "lucide-react";

export function ActivityCard({ activity, index }) {
    const isUpcoming = activity.status === "Upcoming";

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex flex-col md:flex-row gap-4 p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
        >
            <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-secondary rounded-md min-w-[100px] text-center">
                <Calendar className="w-6 h-6 mb-2 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">{activity.date}</span>
            </div>

            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">{activity.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${isUpcoming ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}`}>
                        {activity.status}
                    </span>
                </div>

                <div className="flex items-center gap-2 mt-1 mb-2 text-sm text-muted-foreground">
                    <Tag size={14} />
                    <span>{activity.type}</span>
                </div>

                <p className="text-sm text-foreground/80">
                    {activity.description}
                </p>
            </div>
        </motion.div>
    );
}
