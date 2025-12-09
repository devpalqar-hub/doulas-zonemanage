import styles from "../CreateDoula/CreateDoula.module.css";
import { LuCalendar } from "react-icons/lu";

const AvailabilityStep = () => {


return (
    
    <div className={styles.availabilityContainer}>
        <h3 className={styles.sectionTitle}>Availability</h3>
        <div className={styles.availabilityWrapper}>
            <LuCalendar className={styles.calenderIcon} size={50}/>
            <p>Availability Schedule</p>
            <span>Availability can be configured after saving the profile</span>
        </div>
    </div>
)
} 

export default AvailabilityStep