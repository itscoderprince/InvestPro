"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    TrendingUp,
    PlusCircle,
    Wallet,
    MessageSquare,
    User,
    LogOut,
    Settings,
    ChevronRight,
    ChevronsUpDown,
    ShieldCheck,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Navigation data
const navData = {
    main: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard
        },
        {
            title: "My Investments",
            url: "/investments",
            icon: TrendingUp
        },
    ],
    finance: [
        {
            title: "Invest Now",
            url: "/invest",
            icon: PlusCircle,
        },
        {
            title: "Withdraw Funds",
            url: "/withdraw",
            icon: Wallet,
        },
    ],
    account: [
        {
            title: "Profile & KYC",
            url: "/kyc",
            icon: User,
        },
        {
            title: "Support Tickets",
            url: "/support",
            icon: MessageSquare
        },
    ],
}

export function UserSidebar({ ...props }) {
    const pathname = usePathname()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <Sidebar collapsible="icon" className="bg-[#0f172a] border-r-0" {...props}>
            <SidebarHeader className="bg-[#0f172a] border-b border-white/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-white/5 data-[state=open]:text-white hover:bg-white/5 hover:text-white"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white">
                                <TrendingUp className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold text-white">InvestHub</span>
                                <span className="truncate text-xs text-gray-400">User Dashboard</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-[#0f172a]">
                {/* Overview */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-500 text-xs uppercase tracking-wider">
                        Overview
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navData.main.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            className={cn(
                                                "hover:bg-white/5 hover:text-white transition-all",
                                                isActive ? "bg-[#2563eb] text-white shadow-lg shadow-blue-500/20" : "text-gray-400"
                                            )}
                                        >
                                            <Link href={item.url}>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Finance */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-500 text-xs uppercase tracking-wider">
                        Finance
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navData.finance.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            tooltip={item.title}
                                            className={cn(
                                                "hover:bg-white/5 hover:text-white transition-all",
                                                isActive ? "bg-[#2563eb] text-white shadow-lg shadow-blue-500/20" : "text-gray-400"
                                            )}
                                        >
                                            <Link href={item.url}>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Account & Support */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-500 text-xs uppercase tracking-wider">
                        Account
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navData.account.map((item) => {
                                const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.title}
                                            className={cn(
                                                "hover:bg-white/5 hover:text-white transition-all",
                                                isActive ? "bg-[#2563eb] !text-white shadow-lg shadow-blue-500/20" : "text-gray-400"
                                            )}
                                        >
                                            <Link href={item.url}>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="bg-[#0f172a] border-t border-white/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        {mounted ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-white/5 data-[state=open]:text-white hover:bg-white/5 hover:text-white"
                                    >
                                        <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0f172a] to-[#334155] text-white text-sm font-bold">
                                            JD
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold text-white">John Doe</span>
                                            <span className="truncate text-xs text-green-500 flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" />
                                                Verified
                                            </span>
                                        </div>
                                        <ChevronsUpDown className="ml-auto size-4 text-gray-400" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side="bottom"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuItem asChild>
                                        <Link href="/kyc" className="cursor-pointer">
                                            <User className="mr-2 size-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/settings" className="cursor-pointer">
                                            <Settings className="mr-2 size-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                        <LogOut className="mr-2 size-4" />
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <SidebarMenuButton size="lg" className="hover:bg-white/5 hover:text-white">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0f172a] to-[#334155] text-white text-sm font-bold">
                                    JD
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold text-white">John Doe</span>
                                    <span className="truncate text-xs text-gray-400">john@example.com</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4 text-gray-400" />
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
