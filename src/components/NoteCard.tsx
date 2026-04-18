import { useState } from "react";
import type { Note, Profile } from "applesauce-common/casts";
import { Hooks } from "applesauce-react";
import { usePublish } from "@/hooks/usePublish";
import { useAccount } from "@/lib/AccountContext";
import styles from "./NoteCard.module.css";

const { use$ } = Hooks;

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  // note.author is a User — profile$ emits a Profile cast (or undefined)
  const profile = use$(note.author.profile$) as Profile | undefined;
  const { account } = useAccount();
  const { publishReaction, publishRepost } = usePublish();
  const [reacted, setReacted] = useState(false);
  const [reposted, setReposted] = useState(false);

  const name =
    profile?.displayName ??
    profile?.name ??
    `${note.author.pubkey.slice(0, 8)}…`;
  const avatar = profile?.picture;
  const timeAgo = formatTimeAgo(new Date((note.event.created_at ?? 0) * 1000));

  async function handleReact(e: React.MouseEvent) {
    e.stopPropagation();
    if (!account || reacted) return;
    setReacted(true);
    try {
      await publishReaction(note.event);
    } catch {
      setReacted(false);
    }
  }

  async function handleRepost(e: React.MouseEvent) {
    e.stopPropagation();
    if (!account || reposted) return;
    setReposted(true);
    try {
      await publishRepost(note.event);
    } catch {
      setReposted(false);
    }
  }

  return (
    <article className={`${styles.card} fade-in`} onClick={onClick}>
      <div className={styles.avatarCol}>
        {avatar ? (
          <img
            className={styles.avatar}
            src={avatar}
            alt={name}
            loading="lazy"
            onError={(e) =>
              ((e.target as HTMLImageElement).style.display = "none")
            }
          />
        ) : (
          <div className={styles.avatarFallback}>
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className={styles.thread} />
      </div>

      <div className={styles.body}>
        <div className={styles.header}>
          <span className={styles.name}>{name}</span>
          <span className={styles.time}>{timeAgo}</span>
        </div>
        <p className={styles.content}>{note.event.content}</p>
        <div className={styles.actions}>
          <button
            className={`${styles.action} ${reacted ? styles.reacted : ""}`}
            onClick={handleReact}
            title="React"
            disabled={!account}
          >
            ♡
          </button>
          <button
            className={`${styles.action} ${reposted ? styles.reposted : ""}`}
            onClick={handleRepost}
            title="Repost"
            disabled={!account}
          >
            ⇄
          </button>
          <button
            className={styles.action}
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            title="Reply"
            disabled={!account}
          >
            ◁
          </button>
        </div>
      </div>
    </article>
  );
}

function formatTimeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return date.toLocaleDateString();
}
