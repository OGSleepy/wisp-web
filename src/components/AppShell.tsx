import { NavLink, Outlet } from "react-router-dom";
import styles from "./AppShell.module.css";

const NAV_ITEMS = [
  { to: "/",         label: "Feed",    icon: "◎" },
  { to: "/explore",  label: "Explore", icon: "⊹" },
  { to: "/compose",  label: "Post",    icon: "+" },
  { to: "/messages", label: "DMs",     icon: "◇" },
  { to: "/profile",  label: "Me",      icon: "◉" },
];

export function AppShell() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.navIcon}>{icon}</span>
            <span className={styles.navLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
