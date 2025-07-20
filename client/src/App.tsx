import { Switch, Route } from "wouter";
import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-provider";
import { AuthProvider } from "@/contexts/auth-provider";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Watch from "@/pages/watch";
import Channel from "@/pages/channel";
import Upload from "@/pages/upload";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import Search from "@/pages/search";
import History from "@/pages/history";
import Liked from "@/pages/liked";
import Settings from "@/pages/settings";
import WatchLater from "@/pages/watch-later";
import YourVideos from "@/pages/your-videos";
import Explore from "@/pages/explore";
import Playlists from "@/pages/playlists";
import Trending from "@/pages/trending";
import CreateChannel from "@/pages/create-channel";
import Studio from "@/pages/studio";

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 md:ml-64">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route path="/">
        {() => (
          <Layout>
            <Home />
          </Layout>
        )}
      </Route>
      <Route path="/watch/:videoId">
        {(params) => (
          <Layout>
            <Watch videoId={parseInt(params.videoId)} />
          </Layout>
        )}
      </Route>
      <Route path="/channel/:channelId">
        {(params) => (
          <Layout>
            <Channel channelId={parseInt(params.channelId)} />
          </Layout>
        )}
      </Route>
      <Route path="/upload">
        {() => (
          <Layout>
            <Upload />
          </Layout>
        )}
      </Route>
      <Route path="/search">
        {() => (
          <Layout>
            <Search />
          </Layout>
        )}
      </Route>
      <Route path="/explore">
        {() => (
          <Layout>
            <Explore />
          </Layout>
        )}
      </Route>
      <Route path="/history">
        {() => (
          <Layout>
            <History />
          </Layout>
        )}
      </Route>
      <Route path="/your-videos">
        {() => (
          <Layout>
            <YourVideos />
          </Layout>
        )}
      </Route>
      <Route path="/liked">
        {() => (
          <Layout>
            <Liked />
          </Layout>
        )}
      </Route>
      <Route path="/watch-later">
        {() => (
          <Layout>
            <WatchLater />
          </Layout>
        )}
      </Route>
      <Route path="/settings">
        {() => (
          <Layout>
            <Settings />
          </Layout>
        )}
      </Route>
      <Route path="/playlists">
        {() => (
          <Layout>
            <Playlists />
          </Layout>
        )}
      </Route>
      <Route path="/trending">
        {() => (
          <Layout>
            <Trending />
          </Layout>
        )}
      </Route>
      <Route path="/create-channel">
        {() => (
          <Layout>
            <CreateChannel />
          </Layout>
        )}
      </Route>
      <Route path="/studio">
        {() => (
          <Layout>
            <Studio />
          </Layout>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
