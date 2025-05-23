"use client";
import Link from "next/link";
import Image from "next/image";
import { User, Bell, Search, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const systemLang = useTranslations("system");
  const navbarLang = useTranslations("navbar");

  const session = useSession({
    required: true,
  });

  return (
    <header className='sticky top-0 z-50 w-full bg-white border-b shadow-sm'>
      <div className='bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-500 px-4 py-3'>
        <div className='container flex items-center justify-between mx-auto'>
          <div className='flex items-center gap-4'>
            <Link href='/' className='flex items-center gap-3'>
              <div className='bg-white p-1 rounded-lg shadow-sm'>
                <Image
                  src='/globe.svg'
                  alt='GRANDPHARM Logo'
                  width={32}
                  height={32}
                  className='h-8 w-8'
                />
              </div>
            </Link>

            <div className='hidden md:flex relative ml-8'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70' />
              <input
                type='search'
                className='w-64 pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:bg-white/30'
                placeholder={systemLang("search")}
              />
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              className='text-white hover:bg-white/20 rounded-full'
            >
              <HelpCircle className='h-5 w-5' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='text-white hover:bg-white/20 rounded-full relative'
            >
              <Bell className='h-5 w-5' />
              <span className='absolute top-1 right-1 h-2 w-2 bg-cyan-400 rounded-full'></span>
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='text-white hover:bg-white/20 rounded-full'
            >
              <Settings className='h-5 w-5' />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-white hover:bg-white/20 rounded-full border border-white/30'
                >
                  <User className='h-5 w-5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuLabel>
                  {session.data?.user?.fullName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className='mr-2 h-4 w-4' />
                  {navbarLang("profile")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className='mr-2 h-4 w-4' />
                  {navbarLang("settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='text-red-600'
                  onClick={() => signOut()}
                >
                  {navbarLang("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className='bg-blue-900 px-4 py-1'>
        <div className='container flex justify-between items-center text-xs text-white/80 mx-auto'>
          <div className='flex items-center gap-4'>
            <span className='flex items-center gap-1'>
              <div className='h-1.5 w-1.5 bg-green-400 rounded-full'></div>
              {systemLang("status.active")}
            </span>
            <span>{systemLang("version")} 2.3.0</span>
          </div>
          <span>{systemLang("last_updated")}: 23.05.2025</span>
        </div>
      </div>
    </header>
  );
}
