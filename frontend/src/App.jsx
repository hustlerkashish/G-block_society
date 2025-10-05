import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  useMediaQuery,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // ✅ for language switching

// Icons
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BuildIcon from "@mui/icons-material/Build";
import EventIcon from "@mui/icons-material/Event";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DescriptionIcon from "@mui/icons-material/Description";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListItemButton from "@mui/material/ListItemButton";

// Pages & Components
import MemberManagement from "./pages/MemberManagement";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import Maintenance from "./pages/Maintenance";
import UserMaintenance from "./pages/UserMaintenance";
import AdminMaintenance from "./pages/AdminMaintenance";
import AdminMemberManagement from "./pages/AdminMemberManagement";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PayMaintenance from "./pages/PayMaintenance";
import UserComplaints from "./pages/UserComplaints";
import AdminComplaints from "./pages/AdminComplaints";
import Events from "./pages/Events";
import AdminEvents from "./pages/AdminEvents";
import Notices from "./pages/Notices";
import Documents from "./pages/Documents";
import UserProfile from "./pages/UserProfile";
import LoadingPage from "./components/LoadingPage";
import ProfileButton from "./components/ProfileButton";
import FinanceDashboard from "./pages/FinanceDashboard";
import Transactions from "./pages/Transactions";

// Admin navigation items
const adminNavItemsBase = [
  { key: "nav.dashboard", icon: <HomeIcon />, path: "/admin-dashboard" },
  { key: "nav.memberManagement", icon: <HomeIcon />, path: "/members" },
  { key: "nav.maintenanceBilling", icon: <AccountBalanceWalletIcon />, path: "/maintenance" },
  { key: "nav.financeDashboard", icon: <ReceiptIcon />, path: "/finance-dashboard" },
  { key: "nav.transactions", icon: <ReceiptIcon />, path: "/transactions" },
  { key: "nav.complaints", icon: <BuildIcon />, path: "/complaints" },
  { key: "nav.eventsAdmin", icon: <EventIcon />, path: "/admin-events" },
  { key: "nav.notices", icon: <NotificationsIcon />, path: "/notices" },
  { key: "nav.documents", icon: <DescriptionIcon />, path: "/documents" },
  { key: "nav.reports", icon: <BarChartIcon />, path: "/reports" },
];

// User navigation items
const userNavItemsBase = [
  { key: "nav.dashboard", icon: <HomeIcon />, path: "/user-dashboard" },
  { key: "nav.maintenanceBilling", icon: <AccountBalanceWalletIcon />, path: "/maintenance" },
  { key: "nav.complaints", icon: <BuildIcon />, path: "/complaints" },
  { key: "nav.eventsUser", icon: <EventIcon />, path: "/events" },
  { key: "nav.notices", icon: <NotificationsIcon />, path: "/notices" },
  { key: "nav.documents", icon: <DescriptionIcon />, path: "/documents" },
];

const drawerWidthExpanded = 260;
const drawerWidthCollapsed = 72;

function Placeholder({ title }) {
  return (
    <Box p={3}>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1" color="text.secondary">
        This is a placeholder for the {title} module.
      </Typography>
    </Box>
  );
}

export default function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const theme = createTheme({ palette: { mode: darkMode ? "dark" : "light" } });

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showLoading, setShowLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);

  const { t, i18n } = useTranslation(); // ✅ i18n hook
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lng', lng);
  };

  const drawerWidth = collapsed ? drawerWidthCollapsed : drawerWidthExpanded;

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleProfileClick = () => {
    window.location.href = "/profile";
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setIsFirstLogin(false);
  };

  // Navigation items based on role
  const navItemsBase = user?.role === "admin" ? adminNavItemsBase : userNavItemsBase;
  const navItems = navItemsBase.map(item => ({ ...item, text: t(item.key) }));

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? "center" : "initial",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? "auto" : 2,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        {!user ? (
          <Login setUser={setUser} onLoginSuccess={() => setShowLoading(true)} />
        ) : showLoading ? (
          <LoadingPage onComplete={handleLoadingComplete} />
        ) : (
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
              <Toolbar>
                <IconButton
                  color="inherit"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>

                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  {t('app.title')}
                </Typography>

                {/* ✅ Language Switcher */}
                <select
                  onChange={(e) => changeLanguage(e.target.value)}
                  value={i18n.language}
                  style={{
                    marginRight: "16px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="gu">ગુજરાતી</option>
                </select>

                {/* Dark mode toggle */}
                <IconButton
                  color="inherit"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>

                {/* Profile Button */}
                <ProfileButton
                  user={user}
                  onProfileClick={handleProfileClick}
                  onLogout={handleLogout}
                />
              </Toolbar>
            </AppBar>

            {isMobile ? (
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ "& .MuiDrawer-paper": { width: drawerWidthExpanded } }}
              >
                {drawer}
              </Drawer>
            ) : (
              <Drawer
                variant="permanent"
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  transition: "width 0.3s",
                  "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    transition: "width 0.3s",
                    overflowX: "hidden",
                  },
                }}
              >
                {drawer}
              </Drawer>
            )}

            {/* Main Content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                bgcolor: "background.default",
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                transition: "margin 0.3s",
              }}
            >
              <Toolbar />
              <Routes>
                {/* Admin Routes */}
                {user.role === "admin" && (
                  <>
                    <Route path="/admin-dashboard" element={<AdminDashboard user={user} />} />
                    <Route path="/members" element={<AdminMemberManagement user={user} />} />
                    <Route path="/admin-events" element={<AdminEvents user={user} />} />
                    <Route path="/finance-dashboard" element={<FinanceDashboard user={user} />} />
                    <Route path="/transactions" element={<Transactions user={user} />} />
                    <Route path="/reports" element={<Placeholder title="Reports & Analytics" />} />
                  </>
                )}

                {/* User Routes */}
                {user.role === "resident" && (
                  <Route path="/user-dashboard" element={<UserDashboard user={user} />} />
                )}

                {/* Shared Routes */}
                <Route
                  path="/maintenance"
                  element={
                    user.role === "admin" ? (
                      <AdminMaintenance user={user} />
                    ) : (
                      <UserMaintenance user={user} />
                    )
                  }
                />
                <Route
                  path="/complaints"
                  element={
                    user.role === "admin" ? (
                      <AdminComplaints user={user} />
                    ) : (
                      <UserComplaints user={user} />
                    )
                  }
                />
                <Route path="/pay-maintenance" element={<PayMaintenance />} />
                <Route path="/events" element={<Events user={user} />} />
                <Route path="/notices" element={<Notices user={user} />} />
                <Route path="/documents" element={<Documents user={user} />} />
                <Route path="/change-password" element={<ChangePassword user={user} />} />
                <Route
                  path="/profile"
                  element={
                    <UserProfile
                      user={user}
                      onLogout={() => {
                        setUser(null);
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                      }}
                    />
                  }
                />

                {/* Default Redirect */}
                <Route
                  path="*"
                  element={
                    user.role === "admin" ? (
                      <AdminDashboard user={user} />
                    ) : (
                      <UserDashboard user={user} />
                    )
                  }
                />
              </Routes>
            </Box>
          </Box>
        )}
      </Router>
    </ThemeProvider>
  );
}
