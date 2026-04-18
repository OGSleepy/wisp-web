import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AccountProvider } from "@/lib/AccountContext";
import { AppShell } from "@/components/AppShell";
import { FeedScreen } from "@/screens/FeedScreen";
import { ExploreScreen } from "@/screens/ExploreScreen";
import { ComposeScreen } from "@/screens/ComposeScreen";
import { MessagesScreen } from "@/screens/MessagesScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";

import "@/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AccountProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<FeedScreen />} />
            <Route path="explore" element={<ExploreScreen />} />
            <Route path="compose" element={<ComposeScreen />} />
            <Route path="messages" element={<MessagesScreen />} />
            <Route path="profile" element={<ProfileScreen />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AccountProvider>
  </React.StrictMode>,
);
