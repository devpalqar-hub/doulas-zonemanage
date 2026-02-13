import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { getZoneManagerProfile } from "../../../../services/zoneManager.service";

import { GrSchedules } from "react-icons/gr";
import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineEventAvailable } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { FiBookOpen, FiMessageSquare } from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [isError, setIsError] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    getZoneManagerProfile(userId)
      .then((res) => {
        setProfile({
          name: res.name,
          email: res.email,
        });
      })
      .catch(console.error);
  }, [userId]);

  return (
    <>
      {/* Hamburger */}
      <button
        className={`${styles.hamburger} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay */}
      <div
        className={`${styles.sidebarOverlay} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        {/* TOP PROFILE */}
        <div className={styles.profile}>
          <img src="/doula-logo.png" className={styles.avatar} alt="User" />
          <div className={styles.profileInfo}>
            <h4>{profile?.name || "Loading..."}</h4>
            <p>{profile?.email || ""}</p>
          </div>
        </div>

        {/* MENU */}
        <nav className={styles.menu}>
          <NavLink to="/dashboard" className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ""}`
          }>
            <LuLayoutDashboard size={20} /> Dashboard
          </NavLink>

          <NavLink to="/availability" className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ""}`
          }>
            <MdOutlineEventAvailable size={20} /> My Availability
          </NavLink>

          <NavLink to="/doulas" className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ""}`
          }>
            <LuUsers size={20} /> Manage Doulas
          </NavLink>

          <NavLink to="/meetings" className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ""}`
          }>
            <HiOutlineVideoCamera size={20} /> Appointments
          </NavLink>

          <NavLink to="/bookings" className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ""}`
          }>
            <FiBookOpen size={20} /> Bookings
          </NavLink>

          <NavLink to="/schedules" className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ""}`
          }>
            <GrSchedules size={20} /> Schedules
          </NavLink>

          <NavLink to="/testimonials" className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ""}`
          }>
            <FiMessageSquare size={20} /> Testimonials
          </NavLink>
        </nav>

        {/* BOTTOM LOGOUT PROFILE */}
        <div
          className={styles.profileLogout}
        > 
        {!isError ? (
          <img
            className={styles.brand}
            src="/doula-branding.png"
            alt="Bambini Doulas"
            onError={() => setIsError(true)}
          />
        ) : (
          <div className={styles.brandFallback}>
            Bambini Doulas
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
