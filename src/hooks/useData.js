import { useState, useEffect } from 'react';
import {
    activities as localActivities,
    projects as localProjects,
    leaderboard as localLeaderboard,
    currentSprint as localSprint
} from '../data/mockData';

{/* <script src="https://gist.github.com/Arcane-Ayush/72f1be6cea09ed7385a5f44076af9ef4.js"></script> */ }
//+t?=Date.now() just to bust the cache 
const REMOTE_URL = "https://gist.githubusercontent.com/Arcane-Ayush/72f1be6cea09ed7385a5f44076af9ef4/raw/clubData.json?t=" + Date.now();

export function useData() {
    const [data, setData] = useState({
        activities: localActivities,
        projects: localProjects,
        leaderboard: localLeaderboard,
        currentSprint: localSprint
    });
    const [loading, setLoading] = useState(false); // Start false because we have local data immediately
    const [error, setError] = useState(null);

    // Run this code ONLY once when the component mounts
    useEffect(() => {
        //if we fail to fetch the data, we use the local data
        if (!REMOTE_URL) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Trying to fetch from the internet
                const response = await fetch(REMOTE_URL);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const jsonData = await response.json();

                setData({
                    activities: jsonData.activities || localActivities,
                    projects: jsonData.projects || localProjects,
                    leaderboard: jsonData.leaderboard || localLeaderboard,
                    currentSprint: jsonData.currentSprint || localSprint
                });
                setError(null);

            } catch (err) {
                console.warn("⚠️ Fetch failed, using local backup:", err);
                setError(err.message);
            } finally {
                // Whether we succeeded or failed, we are done loading.
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Empty dependency array [] means "run once on mount"

    return { ...data, loading, error };
}
