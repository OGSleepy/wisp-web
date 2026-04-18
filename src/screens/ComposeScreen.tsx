import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePublish } from "@/hooks/usePublish";
import { useAccount } from "@/lib/AccountContext";
import styles from "./ComposeScreen.module.css";

const MAX_LENGTH = 280;

export function ComposeScreen() {
  const [content, setContent] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const { account } = useAccount();
  const { publishNote } = usePublish();

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const remaining = MAX_LENGTH - content.length;
  const canPost = content.trim().length > 0 && remaining >= 0 && !publishing;

  async function handlePost() {
    if (!canPost) return;
    setPublishing(true);
    setError("");
    try {
      await publishNote(content.trim());
      navigate("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to publish");
      setPublishing(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handlePost();
    }
  }

  if (!account) {
    return (
      <div className={styles.screen}>
        <div className={styles.gateMsg}>
          <span className={styles.gateIcon}>◌</span>
          <p>sign in to post</p>
          <button className={styles.gateBtn} onClick={() => navigate("/profile")}>
            go to profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <button className={styles.cancel} onClick={() => navigate(-1)}>
          cancel
        </button>
        <span className={styles.title}>new post</span>
        <button
          className={styles.postBtn}
          disabled={!canPost}
          onClick={handlePost}
        >
          {publishing ? "…" : "post"}
        </button>
      </header>

      <div className={styles.editor}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="what's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_LENGTH + 50}
          rows={6}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.footer}>
          <span className={`${styles.counter} ${remaining < 20 ? styles.warn : ""} ${remaining < 0 ? styles.over : ""}`}>
            {remaining}
          </span>
          <span className={styles.hint}>⌘↵ to post</span>
        </div>
      </div>
    </div>
  );
}
