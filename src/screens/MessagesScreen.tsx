import styles from "./MessagesScreen.module.css";

export function MessagesScreen() {
  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.title}>messages</span>
      </header>
      <div className={styles.body}>
        <span className={styles.icon}>◇</span>
        <p className={styles.msg}>direct messages</p>
        <p className={styles.sub}>
          NIP-17 encrypted DMs coming soon.
          <br />
          gift-wrapped end-to-end encryption.
        </p>
      </div>
    </div>
  );
}
