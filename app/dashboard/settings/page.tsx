"use client";

import React from "react";
import { User, Bell, Shield, Smartphone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-secondary font-medium">Manage your account and preferences.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-border divide-y divide-border overflow-hidden">
        <SettingsItem 
            icon={<User className="w-5 h-5 text-blue-500" />} 
            title="Profile Information" 
            desc="Change your name, class, and school details." 
        />
        <SettingsItem 
            icon={<Bell className="w-5 h-5 text-purple-500" />} 
            title="Notifications" 
            desc="Configure how you receive study reminders." 
        />
        <SettingsItem 
            icon={<Shield className="w-5 h-5 text-emerald-500" />} 
            title="Privacy & Security" 
            desc="Manage your passwords and data privacy." 
        />
        <SettingsItem 
            icon={<Smartphone className="w-5 h-5 text-amber-500" />} 
            title="App Appearance" 
            desc="Switch between light and dark mode." 
        />
      </div>

      <div className="flex justify-between items-center p-8 bg-red-50 rounded-[2.5rem] border border-red-100">
        <div>
            <p className="font-bold text-red-600">Danger Zone</p>
            <p className="text-sm text-red-500 font-medium">Log out or delete your account permanently.</p>
        </div>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 rounded-2xl gap-2 font-bold px-6">
            <LogOut className="w-4 h-4" /> Log Out
        </Button>
      </div>
    </div>
  );
}

function SettingsItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="p-6 md:p-8 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer group">
            <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                    {icon}
                </div>
                <div>
                    <p className="font-bold group-hover:text-primary transition-colors">{title}</p>
                    <p className="text-sm text-secondary font-medium">{desc}</p>
                </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
        </div>
    );
}
