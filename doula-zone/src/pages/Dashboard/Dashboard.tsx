import styles from "./Dashboard.module.css";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar"; 
import StatsCards from "./components/statscards/StatsCards";
import { useEffect, useState } from "react";
import { fetchCardsStats, type CardsStats } from "../../services/analytics.services";
import QuickActions from "./components/quickactions/QuickActions";
import RecentActivity from "./components/recentactivity/RecentActivity";
import RecentTestimonials from "./components/recenttestimonials/RecentTestimonials";
// import PendingMeetingRequests from "./components/pendingmeeting/PendingMeetingRequests";
import ScheduleOverview from "./components/scheduleoverview/ScheduleOverview";
import WeeklyActivity from "./components/weeklyactivity/WeeklyActivity";

const Dashboard = () => {
    const [cardsStats, setCardsStats] = useState<CardsStats | null>(null);
    const [loadingCards, setLoadingCards] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchCardsStats();
                setCardsStats(data);
            } catch (err) {
                console.error("Failed to fetch cards stats", err);
            } finally {
                setLoadingCards(false);
            }
        };
        load();
    },[]);

    return (
        <div className={styles.dashboardRoot}>

            <Sidebar />

            <div className={styles.contentArea}>
                <Topbar />

                <div className={styles.pageContent}>
                    <h2 className={styles.title}>Dashboard</h2>
                    {/* <p className={styles.zoneStatus}>Zone: North Region <span className={styles.activeTag}>Active</span></p> */}
                    <StatsCards data={cardsStats} loading={loadingCards}></StatsCards>
                    <QuickActions/>
                    <div className={styles.row}>
                        <div className={styles.child1}>
                            <ScheduleOverview/>
                        </div>
                        <div className={styles.child2}>
                            <RecentActivity/>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.child1}>
                            <WeeklyActivity />
                        </div>
                        <div className={styles.child2}>
                            <RecentTestimonials/>
                        </div>  
                    </div>
                    {/* <PendingMeetingRequests/> */}

                </div>
            </div>
        </div>  
    )
};


export default Dashboard;   