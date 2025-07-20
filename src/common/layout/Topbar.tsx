import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Routes from '@common/defs/routes';
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useAuth from '@modules/auth/hooks/api/useAuth';
import Stack from '@mui/material/Stack';
import Logo from '@common/assets/svgs/Logo';
import { ArrowForwardIos, Logout } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { setUserLanguage } from '@common/components/lib/utils/language';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NotificationDropdown } from '@modules/notifications/components/NotificationDropdown';
import { useUnreadCount } from '@modules/notifications/hooks/useNotifications';
import { useUnreadConversations } from '@modules/chat/hooks/useUnreadConversations';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';

interface TopbarItem {
  label: string;
  link?: string;
  onClick?: () => void;
  dropdown?: Array<{
    label: string;
    link?: string;
    value?: string;
    onClick?: () => void;
    flag?: string;
  }>;
}

const Topbar = () => {
  const { t } = useTranslation(['topbar']);
  const router = useRouter();
  const { asPath } = router;
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, logout } = useAuth();
  // const userIsAdmin = user?.userType === 'ADMIN' || user?.userType === 'SUPERADMIN';
  const [anchorNotif, setAnchorNotif] = useState<null | HTMLElement>(null);
  const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);

  // Get unread notification count
  const { data: unreadCountData, refetch: refetchUnreadCount } = useUnreadCount();
  const unreadCount = unreadCountData?.unreadCount || 0;

  // Get unread conversation count
  const { data: unreadConversationsData } = useUnreadConversations();
  const unreadConversationsCount = unreadConversationsData?.unreadCount || 0;

  // Notification dropdown handlers
  const handleNotifClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorNotif(event.currentTarget);
  };
  const handleNotifClose = () => {
    setAnchorNotif(null);
  };

  // User menu handlers
  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorUser(event.currentTarget);
  };
  const handleUserClose = () => {
    setAnchorUser(null);
  };

  // const dropdownWidth = 137;
  const toggleSidebar = () => {
    setShowDrawer((oldValue) => !oldValue);
  };
  const navItems: TopbarItem[] = [
    {
      label: t('topbar:home'),
      link: Routes.Common.Home,
      onClick: () => router.push(Routes.Common.Home),
    },
    {
      label: t('topbar:language'),
      dropdown: [
        {
          label: t('topbar:language_french'),
          link: asPath,
          value: 'fr',
          flag: 'fr',
        },
        {
          label: t('topbar:language_english'),
          link: `${asPath}`,
          value: 'en',
          flag: 'us',
        },
        {
          label: t('topbar:language_spanish'),
          link: `${asPath}`,
          value: 'es',
          flag: 'es',
        },
      ],
    },
    ...(user
      ? [
          {
            label: t('topbar:user'),
            dropdown: [
              {
                label: t('topbar:profile'),
                link: Routes.Users.Me,
                onClick: () => router.push(Routes.Users.Me),
              },
              {
                label: t('topbar:logged.logout'),
                onClick: () => logout(),
              },
            ],
          },
        ]
      : []),
  ];

  const toggleDropdown = () => {
    setShowDropdown((oldValue) => !oldValue);
  };

  const onNavButtonClick = (item: TopbarItem) => {
    if (item.dropdown) {
      return toggleDropdown;
    }
    return () => {
      setShowDrawer(false);
      if (item.onClick) {
        item.onClick();
      }
    };
  };

  const onAuthButtonClick = (mode: string) => {
    if (router.pathname === Routes.Common.Home) {
      if (mode === 'login') {
        return router.push(Routes.Auth.Login);
      }
      if (mode === 'register') {
        return router.push(Routes.Auth.Register);
      }
    }
    // if login coming from any other page then add url query param to redirect back to the same page after login
    if (mode === 'login') {
      router.push({
        pathname: Routes.Auth.Login,
        query: { url: encodeURIComponent(router.pathname) },
      });
    }
    if (mode === 'register') {
      router.push({
        pathname: Routes.Auth.Register,
        query: { url: encodeURIComponent(router.pathname) },
      });
    }
  };

  if (!user) {
    // Old unauthenticated layout
    return (
      <AppBar
        position="static"
        sx={{
          boxShadow: (theme) => theme.customShadows.z1,
          backgroundColor: 'common.white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 1201,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0, sm: 0 }, minHeight: 64 }}>
            <Stack direction="row" alignItems="center" flexGrow={1}>
              <Logo
                id="topbar-logo"
                onClick={() => router.push(Routes.Common.Home)}
                sx={{ cursor: 'pointer' }}
              />
            </Stack>
            <List sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <ListItem>
                <ListItemText>{t('topbar:language')}</ListItemText>
                <KeyboardArrowDown />
                <List
                  className="dropdown-menu"
                  sx={{
                    backgroundColor: 'common.white',
                    boxShadow: (theme) => theme.customShadows.z12,
                    position: 'absolute',
                    top: 48,
                    left: 0,
                    padding: 0,
                    width: 137,
                    borderBottomLeftRadius: 24,
                    borderBottomRightRadius: 24,
                    visibility: 'hidden',
                    zIndex: 1000000,
                  }}
                >
                  <ListItemButton onClick={() => setUserLanguage('fr')}>
                    <ListItemText>Français</ListItemText>
                  </ListItemButton>
                  <ListItemButton onClick={() => setUserLanguage('en')}>
                    <ListItemText>English</ListItemText>
                  </ListItemButton>
                  <ListItemButton onClick={() => setUserLanguage('es')}>
                    <ListItemText>Español</ListItemText>
                  </ListItemButton>
                </List>
              </ListItem>
              <ListItem>
                <Button
                  variant="text"
                  onClick={() => onAuthButtonClick('login')}
                  sx={{ textTransform: 'none' }}
                >
                  {t('topbar:login')}
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  variant="contained"
                  onClick={() => onAuthButtonClick('register')}
                  sx={{ textTransform: 'none' }}
                >
                  {t('topbar:register')}
                </Button>
              </ListItem>
            </List>
            <IconButton onClick={toggleSidebar} sx={{ display: { md: 'none', sm: 'flex' }, ml: 1 }}>
              <MenuIcon fontSize="medium" sx={{ color: 'grey.700' }} />
            </IconButton>
          </Toolbar>
        </Container>
        {/* Drawer for mobile nav remains unchanged */}
      </AppBar>
    );
  }

  // Modernized authenticated layout
  return (
    <AppBar
      position="static"
      sx={{
        boxShadow: (theme) => theme.customShadows.z1,
        backgroundColor: 'common.white',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: 1201,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 0, sm: 0 }, minHeight: 64 }}>
          {/* Left: Logo and Org/Project Switcher */}
          <Stack direction="row" alignItems="center" spacing={2} flexGrow={1}>
            <Logo
              id="topbar-logo"
              onClick={() => router.push(Routes.Common.Home)}
              sx={{ cursor: 'pointer', mr: 2 }}
            />
            {/* Org/Project Switcher Placeholder */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              {/* <Button
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2, textTransform: 'none' }}
                disabled
              >
                {t('topbar:org_switcher', 'Select Org/Project')}
              </Button> */}
            </Box>
          </Stack>

          {/* Center: Quick Links */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 0 }}>
            <Tooltip title={t('topbar:help', 'Help & Support')}>
              <IconButton>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('topbar:dashboard', 'Dashboard')}>
              <IconButton onClick={() => router.push(Routes.Common.Home)}>
                <DashboardIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('topbar:chat', 'Chat')}>
              <IconButton onClick={() => router.push(Routes.Chat.Index)}>
                <Badge badgeContent={unreadConversationsCount} color="primary" max={99}>
                  <ChatIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            {/* <Tooltip title={t('topbar:settings', 'Settings')}>
              <IconButton onClick={() => router.push(Routes.Users.Settings)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip> */}
          </Stack>

          {/* Right: Notifications, Dark Mode, User */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Notifications */}
            <Tooltip title={t('topbar:notifications', 'Notifications')}>
              <IconButton onClick={handleNotifClick}>
                <Badge badgeContent={unreadCount} color="error" max={99}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <NotificationDropdown
              anchorEl={anchorNotif}
              open={Boolean(anchorNotif)}
              onClose={handleNotifClose}
              unreadCount={unreadCount}
              onUnreadCountChange={refetchUnreadCount}
            />

            {/* User Avatar & Menu */}
            {user && (
              <>
                <Tooltip title={user.firstName + ' ' + user.lastName}>
                  <IconButton onClick={handleUserClick} sx={{ p: 0 }}>
                    <Avatar
                      src={user.profile?.profile_picture || undefined}
                      alt={user.firstName || user.email}
                      sx={{ width: 40, height: 40, ml: 1 }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorUser}
                  open={Boolean(anchorUser)}
                  onClose={handleUserClose}
                  PaperProps={{ sx: { mt: 1.5, minWidth: 200 } }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar
                        src={user.profile?.profile_picture || undefined}
                        alt={user.firstName || user.email}
                        sx={{ width: 32, height: 32 }}
                      />
                      <Box>
                        <Box sx={{ fontWeight: 600 }}>
                          {user.firstName} {user.lastName}
                        </Box>
                        <Box sx={{ fontSize: 13, color: 'text.secondary' }}>{user.email}</Box>
                      </Box>
                    </Stack>
                  </Box>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleUserClose();
                      router.push(Routes.Users.Me);
                    }}
                  >
                    {t('topbar:profile', 'Profile')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleUserClose();
                      router.push(Routes.Users.Settings);
                    }}
                  >
                    {t('topbar:settings', 'Settings')}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleUserClose();
                      logout();
                    }}
                  >
                    {t('topbar:logged.logout', 'Logout')}
                  </MenuItem>
                </Menu>
              </>
            )}
          </Stack>

          {/* Mobile menu button */}
          <IconButton onClick={toggleSidebar} sx={{ display: { md: 'none', sm: 'flex' }, ml: 1 }}>
            <MenuIcon fontSize="medium" sx={{ color: 'grey.700' }} />
          </IconButton>
        </Toolbar>
      </Container>
      <Drawer anchor="right" open={showDrawer} onClose={() => setShowDrawer(false)}>
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontWeight: 700,
            width: 250,
          }}
        >
          <Box
            sx={{
              padding: 4,
              '.topbar-logo': {
                width: '250px',
              },
            }}
          >
            <Logo id="responsive-topbar-logo" />
          </Box>
          {navItems.map((item, index) => {
            if (item.label === 'Utilisateur') {
              return null;
            }
            return (
              <ListItem
                key={index}
                disablePadding
                sx={{
                  ...(item.dropdown && {
                    display: 'flex',
                    flexDirection: 'column',
                  }),
                }}
              >
                <ListItemButton
                  onClick={!item.dropdown ? onNavButtonClick(item) : toggleDropdown}
                  sx={{
                    width: '100%',
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      ...(router.pathname === item.link && {
                        color: 'primary.main',
                      }),
                    }}
                  >
                    {item.label}
                  </ListItemText>
                  {item.dropdown && (
                    <ListItemIcon color="grey.800" sx={{ minWidth: 'unset' }}>
                      <KeyboardArrowDown sx={{ color: 'grey.800' }} />
                    </ListItemIcon>
                  )}
                </ListItemButton>
                {item.dropdown && (
                  <List
                    sx={{
                      width: '100%',
                      transition: 'all, 0.2s',
                      height: 0,
                      paddingY: 0,
                      ...(showDropdown && {
                        height: `calc(${item.dropdown.length} * 48px)`,
                      }),
                    }}
                    className="dropdown-list"
                  >
                    {item.dropdown.map((dropdownItem, dropdownItemIndex) => {
                      const content = (
                        <ListItemButton
                          sx={{
                            display: 'flex',
                            gap: 1,
                            paddingLeft: 4,
                          }}
                        >
                          <ListItemText>{dropdownItem.label}</ListItemText>
                        </ListItemButton>
                      );

                      return (
                        <ListItem
                          key={dropdownItemIndex}
                          sx={{
                            padding: 0,
                            visibility: 'hidden',
                            ...(showDropdown && {
                              visibility: 'visible',
                            }),
                            display: 'unset',
                          }}
                        >
                          {dropdownItem.link ? (
                            <Link href={dropdownItem.link} locale={dropdownItem.value}>
                              {content}
                            </Link>
                          ) : (
                            content
                          )}
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </ListItem>
            );
          })}
          <ListItem key="profile" disablePadding>
            <ListItemButton
              onClick={() => router.push(Routes.Users.Me)}
              sx={{
                width: '100%',
              }}
            >
              <ListItemText
                primaryTypographyProps={{
                  ...(router.pathname === Routes.Users.Me && {
                    color: 'primary.main',
                  }),
                }}
              >
                Mon Profil
              </ListItemText>
            </ListItemButton>
          </ListItem>
          {!user ? (
            <>
              <ListItem
                disablePadding
                sx={{
                  backgroundColor: 'transparent',
                  marginBottom: 3,
                }}
              >
                <ListItemButton
                  onClick={() => {
                    setShowDrawer(false);
                    router.push(Routes.Auth.Login);
                  }}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      ...(router.pathname === Routes.Auth.Login && {
                        color: 'primary.main',
                      }),
                    }}
                  >
                    {t('topbar:login')}
                  </ListItemText>
                </ListItemButton>
              </ListItem>
              <Button
                variant="contained"
                endIcon={
                  <ArrowForwardIos
                    fontSize="small"
                    className="arrow-icon"
                    sx={{ fontSize: '12px', transition: 'all, 0.15s' }}
                  />
                }
                onClick={() => {
                  setShowDrawer(false);
                  router.push(Routes.Auth.Register);
                }}
                sx={{
                  display: 'flex',
                  flex: 1,
                  width: 150,
                  '&:hover': {
                    '.arrow-icon': {
                      transform: 'translateX(0.25rem)',
                    },
                  },
                }}
              >
                {t('topbar:register')}
              </Button>
            </>
          ) : (
            <>
              <Button
                color="error"
                onClick={() => {
                  setShowDrawer(false);
                  logout();
                }}
                sx={{
                  display: 'flex',
                }}
                startIcon={<Logout />}
                variant="outlined"
              >
                {t('topbar:logged.logout')}
              </Button>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};
// const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
//   color: theme.palette.grey[700],
//   borderRadius: theme.shape.borderRadius + 'px',
//   '&:hover': {
//     backgroundColor: 'transparent',
//   },
//   '.MuiTouchRipple-child': {
//     backgroundColor: theme.palette.primary.main,
//   },
// }));
export default Topbar;
