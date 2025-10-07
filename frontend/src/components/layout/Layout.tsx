import FindPeopleModal from "@/components/connections/FindPeopleModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setTheme, toggleMobileMenu } from "@/features/ui/uiSlice";
import { getInitials } from "@/lib/utils";
import {
  useGetConnectionsQuery,
  useGetUserNetworksQuery,
  useGetUserPostsQuery,
} from "@/services/api";
import { logOutUser } from "@/services/auth/auth.service";
import { RootState } from "@/store";
import { APP_NAME } from "@/utils/constants";
import {
  Bell,
  Globe,
  Home,
  ImageIcon,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  User,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sidebarOpen, mobileMenuOpen, theme } = useSelector(
    (state: RootState) => state.ui
  );

  // Fetch user statistics
  const { data: userPosts = [] } = useGetUserPostsQuery(user?.id || "", {
    skip: !user?.id,
  });
  const { data: userConnections = [] } = useGetConnectionsQuery(undefined, {
    skip: !user?.id,
  });
  const { data: userNetworks = [] } = useGetUserNetworksQuery(user?.id || "", {
    skip: !user?.id,
  });
  const [showFindPeopleModal, setShowFindPeopleModal] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Update desktop state on resize
  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/app/dashboard", icon: Home },
    { name: "Connections", href: "/app/connections", icon: Users },
    { name: "Networks", href: "/app/networks", icon: Globe },
    { name: "Profile", href: `/app/profile/${user?.id}`, icon: User },
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];

  const handleLogout = () => {
    console.log("Logging out user...");
    dispatch(logOutUser());
    console.log("User logged out, navigating to login page");
    navigate("/auth/login");
  };

  const toggleTheme = () => {
    const themes = ["light", "dark", "system"] as const;
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    dispatch(setTheme(nextTheme));
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="w-4 h-4" />;
      case "dark":
        return <Moon className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-black transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
              <div className="text-lg">🎪</div>
            </div>
            <span className="text-lg font-semibold">{APP_NAME}</span>
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="ml-auto lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Card */}
          <div className="border-t border-white/10 p-4">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 border-2 border-blue-500">
                  <AvatarImage src={user?.profileurl} />
                  <AvatarFallback className="bg-blue-500 text-lg font-semibold">
                    {getInitials(user?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-3 font-semibold">{user?.name || "User"}</h3>
                <p className="text-xs text-white/60">{user?.email}</p>
                <div className="mt-4 flex w-full justify-around text-center">
                  <div>
                    <p className="text-lg font-bold">{userPosts.length}</p>
                    <p className="text-xs text-white/60">Posts</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {userConnections.length}
                    </p>
                    <p className="text-xs text-white/60">Connections</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{userNetworks.length}</p>
                    <p className="text-xs text-white/60">Networks</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              <h4 className="px-2 text-xs font-semibold text-white/60">
                Quick Actions
              </h4>
              <Button className="w-full justify-start gap-2 bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="h-4 w-4" />
                Create Post
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-white/10 bg-transparent text-white hover:bg-white/5"
              >
                <ImageIcon className="h-4 w-4" />
                Share Photo
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-white/10 bg-transparent text-white hover:bg-white/5"
              >
                <Video className="h-4 w-4" />
                Share Video
              </Button>
            </div>

            {/* Theme & Logout */}
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-white/10 bg-transparent text-white hover:bg-white/5"
                onClick={toggleTheme}
              >
                {getThemeIcon()}
                Theme
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-white/10 bg-transparent text-white hover:bg-white/5"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center gap-4 border-b border-white/10 px-6">
          <button
            onClick={() => dispatch(toggleMobileMenu())}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder={`Search ${APP_NAME}...`}
              className="w-full border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-white hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setShowFindPeopleModal(true)}
            >
              <UserPlus className="h-5 w-5" />
            </Button>
            <Button className="gap-2 bg-blue-500 hover:bg-blue-600 text-white">
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </div>
        </header>

        {/* Main Feed Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => dispatch(toggleMobileMenu())}
        />
      )}

      <FindPeopleModal
        isOpen={showFindPeopleModal}
        onClose={() => setShowFindPeopleModal(false)}
        onSuccess={() => {
          // Refresh data
          window.location.reload();
        }}
      />
    </div>
  );
};

export default Layout;
