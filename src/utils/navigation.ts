import { NavItem } from "./types/interfaces.ts";

export const guestNavigation: NavItem[] = [
  { name: "HOME", href: "/" },
  { name: "PRODUCTS", href: "/products" },
  { name: "CHANGELOG", href: "/changelog" },
];

export const userNavigation: NavItem[] = [
    ...guestNavigation,
  { name: "DASHBOARD", href: "/dashboard" },
];

export const adminNavigation: NavItem[] = [
  ...userNavigation,
  { name: "Admin Panel", href: "/admin/admin_dashboard" },
];

export const accountDropdownSignedOut: NavItem[] = [
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];

export const accountDropdownSignedIn: NavItem[] = [
  { name: "Profile", href: "/profile" },
  { name: "Logout", href: "/logout" },
];
