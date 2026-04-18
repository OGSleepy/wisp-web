import { useState } from "react";
import { useFeed } from "@/hooks/useFeed";
import { NoteCard } from "@/components/NoteCard";
import styles from "./ExploreScreen.module.css";

export function ExploreScreen() {
  const [query, setQuery] = useState("");
  const { notes, loading } = useFeed({ limit: 40 });

  const filtered = query.trim()
    ? notes.filter((n) =>
        n.event.content.toLowerCase().includes(query.toLowerCase()),
      )
    : notes;

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⊹</span>
          <input
            type="search"
            placeholder="search posts…"
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoCorrect="off"
            spellCheck={false}
          />
          {query && (
            <button className={styles.clear} onClick={() => setQuery("")}>
              ×
            </button>
          )}
        </div>
      </header>

      <div className={`${styles.feed} scroll-area`}>
        {!query && (
          <p className={styles.feedLabel}>global feed</p>
        )}
        {query && (
          <p className={styles.feedLabel}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}

        {loading && filtered.length === 0 && (
          <p className={styles.loading}>connecting to relays…</p>
        )}

        {!loading && filtered.length === 0 && (
          <p className={styles.empty}>nothing found</p>
        )}

        {filtered.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
