import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Globe,
  Home,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  User,
  Users,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import {
  setTheme,
  toggleMobileMenu,
  toggleSidebar,
} from "../../features/ui/uiSlice";
import { RootState } from "../../store";

const Layout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { sidebarOpen, mobileMenuOpen, theme } = useSelector(
    (state: RootState) => state.ui
  );

  const navigation = [
    { name: "Dashboard", href: "/app/dashboard", icon: Home },
    { name: "Connections", href: "/app/connections", icon: Users },
    { name: "Networks", href: "/app/networks", icon: Globe },
    { name: "Profile", href: `/app/profile/${user?.id}`, icon: User },
    { name: "Settings", href: "/app/settings", icon: Settings },
  ];

  const handleLogout = () => {
    dispatch(logout());
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
    <div className="min-h-screen cosmic-bg">
      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => dispatch(toggleMobileMenu())}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: mobileMenuOpen ? 0 : -320,
          width: sidebarOpen ? 280 : 80,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-50 h-full bg-space-900/95 backdrop-blur-md border-r border-white/10 lg:translate-x-0"
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4">
            <motion.div
              initial={false}
              animate={{ opacity: sidebarOpen ? 1 : 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-600 to-starlight-500 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold cosmic-text">
                SocialSphere
              </span>
            </motion.div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => dispatch(toggleSidebar())}
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-cosmic-600/20 text-cosmic-400 border border-cosmic-500/30"
                          : "text-space-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <motion.span
                        initial={false}
                        animate={{ opacity: sidebarOpen ? 1 : 0 }}
                        className="truncate"
                      >
                        {item.name}
                      </motion.span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.profileurl} />
                <AvatarFallback className="bg-cosmic-600 text-white">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              <motion.div
                initial={false}
                animate={{ opacity: sidebarOpen ? 1 : 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-space-400 truncate">{user?.email}</p>
              </motion.div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-space-400 hover:text-white hover:bg-white/10"
                onClick={toggleTheme}
              >
                {getThemeIcon()}
                <motion.span
                  initial={false}
                  animate={{ opacity: sidebarOpen ? 1 : 0 }}
                  className="ml-2"
                >
                  Theme
                </motion.span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-space-400 hover:text-red-400 hover:bg-red-400/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <motion.span
                  initial={false}
                  animate={{ opacity: sidebarOpen ? 1 : 0 }}
                  className="ml-2"
                >
                  Logout
                </motion.span>
              </Button>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-80" : "lg:ml-20"
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-space-900/95 backdrop-blur-md border-b border-white/10">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 lg:hidden"
                onClick={() => dispatch(toggleMobileMenu())}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-space-400" />
                <Input
                  placeholder="Search SocialSphere..."
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-space-400 focus:border-cosmic-400"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              <Button className="cosmic">
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
