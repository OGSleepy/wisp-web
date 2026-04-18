import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFeed } from "@/hooks/useFeed";
import { NoteCard } from "@/components/NoteCard";
import styles from "./FeedScreen.module.css";

export function FeedScreen() {
  const { notes, loading } = useFeed({ limit: 50 });
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollToTop() {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header} onClick={scrollToTop}>
        <span className={styles.wordmark}>wisp</span>
        <span className={styles.dot} />
      </header>

      <div className={`${styles.feed} scroll-area`} ref={scrollRef}>
        {loading && notes.length === 0 && (
          <div className={styles.loading}>
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && notes.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>◌</span>
            <p>no posts yet</p>
            <p className={styles.emptyHint}>connect to more relays to see content</p>
          </div>
        )}

        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => navigate(`/note/${note.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonAvatar} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: "35%" }} />
        <div className={styles.skeletonLine} style={{ width: "90%" }} />
        <div className={styles.skeletonLine} style={{ width: "70%" }} />
      </div>
    </div>
  );
}
