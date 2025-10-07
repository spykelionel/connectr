import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInitials } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Bell,
  Monitor,
  Moon,
  Palette,
  Settings,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../features/ui/uiSlice";
import { RootState } from "../store";

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.ui);

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    dispatch(setTheme(newTheme));
  };

  const settingsSections = [
    {
      title: "Profile Settings",
      icon: <User className="w-5 h-5" />,
      items: [
        { label: "Display Name", value: user?.name || "", type: "text" },
        { label: "Email", value: user?.email || "", type: "email" },
        {
          label: "Bio",
          value:
            "Software engineer passionate about creating amazing user experiences",
          type: "textarea",
        },
      ],
    },
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      items: [
        { label: "Email Notifications", value: true, type: "toggle" },
        { label: "Push Notifications", value: true, type: "toggle" },
        { label: "Connection Requests", value: true, type: "toggle" },
        { label: "Network Updates", value: false, type: "toggle" },
      ],
    },
    {
      title: "Privacy & Security",
      icon: <Shield className="w-5 h-5" />,
      items: [
        { label: "Profile Visibility", value: "Public", type: "select" },
        { label: "Two-Factor Authentication", value: false, type: "toggle" },
        { label: "Data Export", value: false, type: "toggle" },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-cosmic-400" />
            <div>
              <h1 className="text-3xl font-bold cosmic-text">Settings</h1>
              <p className="text-space-300 mt-1">
                Manage your account preferences and privacy
              </p>
            </div>
          </div>
        </motion.div>

        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.profileurl} />
                  <AvatarFallback className="bg-cosmic-600 text-white text-xl">
                    {getInitials(user?.name || "U")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {user?.name}
                  </h2>
                  <p className="text-space-400">{user?.email}</p>
                  <p className="text-space-500 text-sm">
                    Member since {new Date().getFullYear()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + sectionIndex * 0.1 }}
            >
              <Card className="glass-card border-white/20">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {section.icon}
                    <h3 className="text-xl font-semibold text-white">
                      {section.title}
                    </h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <Label className="text-white font-medium">
                          {item.label}
                        </Label>
                        {typeof item.value === "string" && (
                          <p className="text-space-400 text-sm mt-1">
                            {item.type === "textarea"
                              ? "Tell us about yourself"
                              : "Current value"}
                          </p>
                        )}
                      </div>
                      <div className="w-64">
                        {item.type === "toggle" ? (
                          <Button
                            variant={item.value ? "default" : "outline"}
                            size="sm"
                            className={
                              item.value
                                ? "cosmic"
                                : "glass-card text-white border-white/20"
                            }
                            onClick={() => {
                              // TODO: Implement toggle functionality
                            }}
                          >
                            {item.value ? "Enabled" : "Disabled"}
                          </Button>
                        ) : item.type === "select" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-card text-white border-white/20"
                          >
                            {item.value}
                          </Button>
                        ) : (
                          <Input
                            type={item.type}
                            value={item.value}
                            className="bg-white/10 border-white/20 text-white"
                            onChange={() => {
                              // TODO: Implement input change
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Theme Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card border-white/20">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Palette className="w-5 h-5" />
                  <h3 className="text-xl font-semibold text-white">
                    Appearance
                  </h3>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Label className="text-white font-medium">Theme</Label>
                  <div className="flex space-x-3">
                    {[
                      {
                        value: "light",
                        label: "Light",
                        icon: <Sun className="w-4 h-4" />,
                      },
                      {
                        value: "dark",
                        label: "Dark",
                        icon: <Moon className="w-4 h-4" />,
                      },
                      {
                        value: "system",
                        label: "System",
                        icon: <Monitor className="w-4 h-4" />,
                      },
                    ].map((themeOption) => (
                      <Button
                        key={themeOption.value}
                        variant={
                          theme === themeOption.value ? "default" : "outline"
                        }
                        className={`flex items-center space-x-2 ${
                          theme === themeOption.value
                            ? "cosmic"
                            : "glass-card text-white border-white/20"
                        }`}
                        onClick={() =>
                          handleThemeChange(themeOption.value as any)
                        }
                      >
                        {themeOption.icon}
                        <span>{themeOption.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass-card border-red-500/30">
              <CardHeader>
                <h3 className="text-xl font-semibold text-red-400">
                  Danger Zone
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Delete Account</h4>
                    <p className="text-space-400 text-sm">
                      Permanently delete your account and all data
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
