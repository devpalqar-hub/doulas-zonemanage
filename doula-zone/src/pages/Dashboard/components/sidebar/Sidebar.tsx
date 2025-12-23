import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import { GrSchedules } from "react-icons/gr";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineEventAvailable } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { FiBookOpen } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            {/* Hamburger Button */}
            <button 
                className={`${styles.hamburger} ${isOpen ? styles.active : ''}`}
                onClick={toggleSidebar}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Overlay */}
            <div 
                className={`${styles.sidebarOverlay} ${isOpen ? styles.active : ''}`}
                onClick={closeSidebar}
            ></div>

            {/* Sidebar */}
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.profile}>
                    <img src='/D-icon.png' className={styles.avatar} alt='User' />
                    <div className={styles.profileInfo}>
                        <h4>Doula Manager</h4>
                        <p>Zone Manager</p>
                    </div>
                </div>

                <nav className={styles.menu}>
                    <NavLink to="/dashboard" 
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}>
                        <LuLayoutDashboard size={20}/> DashBoard
                    </NavLink>

                    <NavLink to="/availability" 
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}>
                        <MdOutlineEventAvailable size={20}/> My Availability
                    </NavLink>

                    <NavLink to="/doulas"
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}>
                        <LuUsers size={20}/> Manage Doulas
                    </NavLink>

                    <NavLink to="/meetings"
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}> 
                      <HiOutlineVideoCamera size={20}/> Appointments
                    </NavLink>

                    <NavLink to="/bookings"
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}> 
                        <FiBookOpen size={20}/> Bookings
                    </NavLink>

                    <NavLink to="/schedules"
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}> 
                        <GrSchedules size={20}/> Schedules
                    </NavLink>

                    <NavLink to="/testimonials"
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}>
                        <FiMessageSquare size={20}/>Testimonials
                    </NavLink>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;