import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "@/lib/AccountContext";
import { useProfile, displayName } from "@/hooks/useProfile";
import { useFeed } from "@/hooks/useFeed";
import { NoteCard } from "@/components/NoteCard";
import { shortNpub } from "@/lib/keys";
import styles from "./ProfileScreen.module.css";

export function ProfileScreen() {
  const { account, login, generate, logout } = useAccount();

  if (!account) return <LoginView onLogin={login} onGenerate={generate} />;

  return (
    <ProfileView
      pubkeyHex={account.pubkeyHex}
      npub={account.npub}
      nsec={account.nsec}
      onLogout={logout}
    />
  );
}

// ─── Logged-in profile ────────────────────────────────────────────────────────

function ProfileView({
  pubkeyHex,
  npub,
  nsec,
  onLogout,
}: {
  pubkeyHex: string;
  npub: string;
  nsec: string;
  onLogout: () => void;
}) {
  const profile = useProfile(pubkeyHex);
  const { notes, loading } = useFeed({ author: pubkeyHex, limit: 20 });
  const [showNsec, setShowNsec] = useState(false);

  const name = displayName(profile, pubkeyHex);

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <span className={styles.title}>profile</span>
        <button className={styles.logoutBtn} onClick={onLogout}>
          sign out
        </button>
      </header>

      <div className={`${styles.content} scroll-area`}>
        <div className={styles.profileCard}>
          {profile?.picture ? (
            <img className={styles.avatar} src={profile.picture} alt={name} />
          ) : (
            <div className={styles.avatarFallback}>
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className={styles.meta}>
            <h2 className={styles.name}>{name}</h2>
            <button
              className={styles.npub}
              onClick={() => navigator.clipboard.writeText(npub)}
              title="tap to copy"
            >
              {shortNpub(npub)}
            </button>
            {profile?.about && (
              <p className={styles.about}>{profile.about}</p>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>backup key</p>
          <div className={styles.keyRow}>
            <code className={styles.keyValue}>
              {showNsec ? nsec : "nsec1••••••••••••••••••••••••••"}
            </code>
            <button
              className={styles.showBtn}
              onClick={() => setShowNsec((v) => !v)}
            >
              {showNsec ? "hide" : "show"}
            </button>
          </div>
          <p className={styles.keyHint}>
            never share your nsec. it controls your identity.
          </p>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>your posts</p>
        </div>

        {loading && notes.length === 0 && (
          <p className={styles.loadingText}>loading…</p>
        )}

        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}

// ─── Login / onboarding ───────────────────────────────────────────────────────

function LoginView({
  onLogin,
  onGenerate,
}: {
  onLogin: (nsec: string) => boolean;
  onGenerate: () => void;
}) {
  const navigate = useNavigate();
  const [nsec, setNsec] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"import" | "new">("import");

  function handleImport() {
    const ok = onLogin(nsec.trim());
    if (!ok) {
      setError("invalid nsec — check and try again");
    } else {
      navigate("/");
    }
  }

  function handleGenerate() {
    onGenerate();
    navigate("/");
  }

  return (
    <div className={styles.screen}>
      <div className={styles.loginWrap}>
        <div className={styles.loginHeader}>
          <span className={styles.loginLogo}>wisp</span>
          <p className={styles.loginSub}>a wee interface for nostr</p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "import" ? styles.activeTab : ""}`}
            onClick={() => setTab("import")}
          >
            import key
          </button>
          <button
            className={`${styles.tab} ${tab === "new" ? styles.activeTab : ""}`}
            onClick={() => setTab("new")}
          >
            new account
          </button>
        </div>

        {tab === "import" ? (
          <div className={styles.loginForm}>
            <input
              type="password"
              placeholder="nsec1…"
              value={nsec}
              onChange={(e) => {
                setNsec(e.target.value);
                setError("");
              }}
              className={styles.nsecInput}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            {error && <p className={styles.loginError}>{error}</p>}
            <button
              className={styles.loginBtn}
              disabled={!nsec.trim()}
              onClick={handleImport}
            >
              sign in
            </button>
          </div>
        ) : (
          <div className={styles.loginForm}>
            <p className={styles.newAccountInfo}>
              a fresh keypair will be generated. back it up immediately after
              signing in.
            </p>
            <button className={styles.loginBtn} onClick={handleGenerate}>
              create account
            </button>
          </div>
        )}

        <p className={styles.loginDisclaimer}>
          your key never leaves this device.
        </p>
      </div>
    </div>
  );
}
