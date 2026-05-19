"use client";

import { useApiReachable } from "@features/platform-status";
import { WhatsNewBell } from "@features/whats-new";
import { cn } from "@infra/utils";
import { Button } from "@shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@shared/components/ui/dropdown-menu";
import { Logo } from "@shared/components/ui/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@shared/components/ui/tooltip";
import { useAuth } from "@shared/hooks";
import {
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MobileDrawer } from "./mobile-drawer";
import { MORE_ITEMS, NAV_ITEMS, type NavItem } from "./nav-items";
import { useScrolled } from "./use-navbar";

function NavLink({ item }: { item: NavItem }) {
  return (
    <Link
      href={item.href}
      className={cn(
        "relative px-5 py-2 text-base font-medium rounded-full",
        "text-muted-foreground transition-all duration-300",
        "hover:text-foreground hover:bg-primary/10",
      )}
      {...(item.external && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      {item.label}
      {item.label === "CLI" && (
        <span className="absolute -top-1 -right-2 px-1.5 py-1 text-[8px] font-bold uppercase leading-none rounded-full bg-primary text-primary-foreground tracking-wide">
          New
        </span>
      )}
    </Link>
  );
}

function UserAvatar({
  name,
  picture,
  size = "sm",
}: {
  name?: string;
  picture?: string;
  size?: "sm" | "md";
}) {
  // Trigger avatars sit inside a 40px hit-area; 28px keeps breathing
  // room around the initials so the cluster doesn't feel cramped.
  const dims = size === "md" ? "h-9 w-9" : "h-7 w-7";
  const text = size === "md" ? "text-sm" : "text-xs";

  if (picture) {
    return (
      <img
        src={picture}
        alt={name || "User"}
        className={cn(dims, "rounded-full object-cover ring-1 ring-border/60")}
      />
    );
  }

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div
      className={cn(
        dims,
        "rounded-full flex items-center justify-center",
        "bg-gradient-to-br from-primary/80 to-primary text-primary-foreground",
        "ring-1 ring-border/60",
        text,
        "font-semibold",
      )}
    >
      {initials}
    </div>
  );
}

export function Navbar() {
  const scrolled = useScrolled();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const reachable = useApiReachable();

  return (
    <>
      <nav
        style={{ top: "var(--status-banner-h, 0px)" }}
        className={cn(
          "fixed w-full z-50",
          "transition-all duration-500 ease-in-out",
          scrolled
            ? "bg-background/85 backdrop-blur-2xl border-b border-border/60 py-4 shadow-sm"
            : "bg-transparent border-b border-transparent py-6",
        )}
      >
        <div className="max-w-page mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-10 relative">
            {/* Left: Brand */}
            <div className="flex-1 flex justify-start items-center z-10">
              <Link href="/" className="flex items-center group">
                <Logo className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" />
              </Link>
              <span
                className={cn(
                  "ml-3 inline-flex items-center",
                  "h-[18px] px-2 rounded-full",
                  "text-[10px] font-bold uppercase tracking-wider leading-none",
                  "bg-primary/10 text-primary",
                )}
                aria-label="Beta version"
              >
                Beta
              </span>
            </div>

            {/* Center: Navigation */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center z-20">
              <div
                className={cn(
                  "flex items-center p-1.5 rounded-full",
                  "transition-all duration-500",
                  scrolled
                    ? "bg-muted/60 border border-border/50"
                    : "bg-transparent",
                )}
              >
                {NAV_ITEMS.map((item) => (
                  <NavLink key={item.label} item={item} />
                ))}

                {/* Resources Dropdown */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-1.5 px-5 py-2 rounded-full",
                        "text-base font-medium",
                        "text-muted-foreground transition-all duration-300",
                        "hover:text-foreground hover:bg-primary/10",
                        "focus:outline-none",
                      )}
                    >
                      More
                      <ChevronDown className="w-3.5 h-3.5 opacity-40 transition-opacity group-hover:opacity-100" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    sideOffset={8}
                    className="w-52 p-1.5 rounded-xl"
                  >
                    {MORE_ITEMS.map((item) => (
                      <DropdownMenuItem key={item.label} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "w-full px-3 py-2.5 rounded-lg cursor-pointer",
                            "text-base font-medium text-muted-foreground",
                            "transition-colors duration-200",
                            "hover:text-foreground hover:bg-muted/80",
                          )}
                          {...(item.external && {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          })}
                        >
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex-1 flex justify-end items-center gap-2 z-10">
              {/* Utility cluster (bell + avatar) at h-10. The labeled
                  AI Agent pill below shares the same h-10 so the row
                  reads at one consistent height. */}
              <div className="hidden md:flex items-center gap-1">
                <WhatsNewBell />

                {!isLoading &&
                  (isAuthenticated && user ? (
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          aria-label={`Signed in as ${user.name || user.email}`}
                          className={cn(
                            "h-10 pl-1 pr-3 rounded-full gap-2",
                            "bg-muted/50 hover:bg-muted",
                            "shadow-none",
                          )}
                        >
                          <UserAvatar name={user.name} picture={user.picture} />
                          <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                            {user.name && user.name !== user.email
                              ? user.name.split(" ")[0]
                              : (user.email?.split("@")[0] ?? "Account")}
                          </span>
                          <ChevronDown className="w-3.5 h-3.5 opacity-50 -ml-0.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-72 p-0 rounded-xl overflow-hidden"
                      >
                        <div className="bg-muted/40 px-4 py-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              name={user.name}
                              picture={user.picture}
                              size="md"
                            />
                            <div className="flex-1 min-w-0">
                              {user.name && user.name !== user.email ? (
                                <>
                                  <p className="text-sm font-semibold truncate text-foreground">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {user.email}
                                  </p>
                                </>
                              ) : (
                                <p className="text-sm font-medium truncate text-foreground">
                                  {user.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="p-1.5">
                          <DropdownMenuItem asChild>
                            <Link
                              href="/settings"
                              className={cn(
                                "px-3 py-2.5 rounded-lg cursor-pointer text-sm",
                                "text-muted-foreground",
                                "hover:text-foreground hover:bg-muted/80",
                                "transition-colors duration-150",
                              )}
                            >
                              <Settings className="w-4 h-4 mr-2.5" />
                              Settings
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={logout}
                            className={cn(
                              "px-3 py-2.5 rounded-lg cursor-pointer text-sm",
                              "text-muted-foreground",
                              "hover:text-destructive hover:bg-destructive/10",
                              "transition-colors duration-150",
                            )}
                          >
                            <LogOut className="w-4 h-4 mr-2.5" />
                            Sign out
                          </DropdownMenuItem>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : reachable ? (
                    <Button
                      variant="outline"
                      onClick={() => login()}
                      className={cn(
                        "h-10 rounded-full px-4 gap-1.5",
                        "bg-muted/50 hover:bg-muted shadow-none",
                      )}
                    >
                      <User className="w-4 h-4" />
                      Sign in
                    </Button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => login()}
                          aria-disabled
                          className={cn(
                            "h-10 rounded-full px-4 gap-1.5",
                            "bg-muted/30 text-muted-foreground shadow-none cursor-not-allowed",
                          )}
                        >
                          <User className="w-4 h-4" />
                          Sign in
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={6}>
                        Sign-in unavailable
                      </TooltipContent>
                    </Tooltip>
                  ))}
              </div>

              {/* Primary CTA — same h-10 as the cluster so the right
                  side reads as one row. Brand color anchors the eye;
                  no drop shadow needed. */}
              <Button
                asChild
                className="hidden md:inline-flex h-10 rounded-full px-4 gap-1.5"
              >
                <Link href="/agent" className="group">
                  <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="text-sm font-semibold">AI Agent</span>
                </Link>
              </Button>

              {/* Mobile Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "md:hidden h-10 w-10 rounded-full",
                  "text-foreground hover:bg-primary/10",
                  "transition-colors",
                )}
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
