# wisp-web

A web PWA fork of [Wisp](https://github.com/barrydeen/wisp), the minimal Nostr client — ported from Android/Kotlin to React/TypeScript so iPhone users can install it via Safari.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Nostr SDK | [Applesauce](https://applesauce.build) |
| Relay comms | `applesauce-relay` (RxJS-based) |
| Event store | `applesauce-core` EventStore |
| Signing | `applesauce-signers` SimpleSigner |
| Loaders | `applesauce-loaders` |
| Build | Vite + vite-plugin-pwa |
| PWA | Workbox service worker |

## Relay policy

`wss://relay.nostr.band` is permanently excluded from all relay lists. The
`filterRelays()` utility in `src/lib/nostr.ts` strips it from any relay array
before a connection is made.

## Getting started

```bash
npm install
npm run dev
```

## Building for production

```bash
npm run build
npm run preview
```

The `dist/` folder is a fully self-contained PWA. Deploy to any static host
(Vercel, Cloudflare Pages, Netlify, etc.).

## Installing on iPhone

1. Open the deployed URL in **Safari**
2. Tap the **Share** button
3. Tap **Add to Home Screen**
4. Tap **Add**

The app will appear on your home screen and run in standalone mode (no browser
chrome, proper safe areas).

## Project structure

```
src/
├── lib/
│   ├── nostr.ts          # EventStore, RelayPool, banned relays
│   ├── keys.ts           # Key gen, import, localStorage persistence
│   └── AccountContext.tsx
├── hooks/
│   ├── useFeed.ts        # Timeline subscriptions
│   ├── useProfile.ts     # Profile metadata
│   └── usePublish.ts     # Sign + broadcast events
├── components/
│   ├── AppShell.tsx      # Mobile nav + iOS safe areas
│   └── NoteCard.tsx      # Feed post card
└── screens/
    ├── FeedScreen.tsx
    ├── ExploreScreen.tsx
    ├── ComposeScreen.tsx
    ├── MessagesScreen.tsx
    └── ProfileScreen.tsx
```

## NIPs implemented

| NIP | Description | Status |
|---|---|---|
| 01 | Basic protocol | ✅ via applesauce-relay |
| 02 | Follow lists | ✅ via applesauce-loaders |
| 05 | DNS verification | 🔜 |
| 07 | Browser extension signer | 🔜 |
| 10 | Reply threading | 🔜 |
| 17 | Gift-wrap DMs | 🔜 |
| 18 | Reposts | ✅ |
| 19 | Bech32 encoding | ✅ via applesauce-core |
| 25 | Reactions | ✅ |
| 44 | Versioned encryption | via applesauce-signers |
| 65 | Relay list metadata | ✅ via applesauce-loaders |

## License

MIT — same as the original Wisp project.
