import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function TopHeader({ user }: { user: any }) {
  return (
    <header className="md:hidden flex items-center justify-between px-4 h-16 bg-white border-b border-gray-200 shrink-0 sticky top-0 z-40">
      <Link href="/dashboard" className="block outline-none">
        <Image 
          src="/mysitebook-logo-dark.png" 
          alt="MySiteBook" 
          width={300} 
          height={100} 
          className="w-[160px] lg:w-[180px] h-auto object-contain drop-shadow-sm -ml-1" 
        />
      </Link>
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center shrink-0 uppercase text-sm border border-accent/30">
          {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
        </div>
      </div>
    </header>
  );
}
