import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

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
                        <img src='/dashboard.png' alt='' /> DashBoard
                    </NavLink>

                    <NavLink to="/availability" 
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}>
                        <img src='/testimonials-icon.png' alt='' /> My Availability
                    </NavLink>

                    <NavLink to="/doulas"
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}>
                        <img src='/manage.png' alt='' /> Manage Doulas
                    </NavLink>

                    <NavLink to="/appointments"
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}> 
                        <img src='/appointments.png' alt='' /> Appointments
                    </NavLink>

                    <NavLink to="/bookings"
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}> 
                        <img src='/bookings.png' alt='' /> Bookings
                    </NavLink>

                    <NavLink to="/testimonials"
                    className={({ isActive }) => 
                        `${styles.item} ${isActive ? styles.active : ""}`
                    }
                    onClick={closeSidebar}>
                        <img src='/testimonials.png' alt='' /> Testimonials
                    </NavLink>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;