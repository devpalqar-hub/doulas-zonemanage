import styles from "./Dashboard.module.css";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar"; 
import StatsCards from "./components/statscards/StatsCards";
import { useEffect, useState } from "react";
import { fetchCardsStats, type CardsStats } from "../../services/analytics.services";

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
                    <p className={styles.zoneStatus}>Zone: North Region <span className={styles.activeTag}>Active</span></p>
                    <StatsCards data={cardsStats} loading={loadingCards}></StatsCards>
                </div>
            </div>
        </div>  
    )
};


export default Dashboard;   