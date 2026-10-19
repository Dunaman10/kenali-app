"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  GraduationCap,
  HeartHandshake,
  Microscope,
  ChevronUp,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { useGameSound } from "@/lib/sound";

export type Role = "siswa" | "admin_bk" | "admin_mahasiswa";

interface RoleOption {
  role: Role;
  label: string;
  sublabel: string;
  href: string;
  icon: typeof GraduationCap;
  color: string;
  badgeBg: string;
}

const ROLES: RoleOption[] = [
  {
    role: "siswa",
    label: "Siswa SMP",
    sublabel: "Ahmad (Kelas 8B)",
    href: "/dashboard/siswa",
    icon: GraduationCap,
    color: "text-teal-600 border-teal-500",
    badgeBg: "bg-teal-500 text-white",
  },
  {
    role: "admin_bk",
    label: "Admin Guru BK",
    sublabel: "Ibu Nurul, S.Pd",
    href: "/dashboard/bk",
    icon: HeartHandshake,
    color: "text-amber-600 border-amber-500",
    badgeBg: "bg-amber-500 text-white",
  },
  {
    role: "admin_mahasiswa",
    label: "Admin Mahasiswa",
    sublabel: "Tim Peneliti S1 Keperawatan",
    href: "/dashboard/mahasiswa",
    icon: Microscope,
    color: "text-sky-600 border-sky-500",
    badgeBg: "bg-sky-500 text-white",
  },
];

export function DemoRoleSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { play } = useGameSound();

  // Detect active role from path
  let currentRole: Role | "guest" = "guest";
  if (pathname.startsWith("/dashboard/siswa")) currentRole = "siswa";
  else if (pathname.startsWith("/dashboard/bk")) currentRole = "admin_bk";
  else if (pathname.startsWith("/dashboard/mahasiswa")) currentRole = "admin_mahasiswa";

  const activeRoleOption = ROLES.find((r) => r.role === currentRole);
  const isStudentDashboard = pathname.startsWith("/dashboard/siswa");

  return (
    <div
      className={`fixed ${
        isStudentDashboard
          ? "bottom-20 right-3 sm:bottom-5 sm:right-5"
          : "bottom-3 right-3 sm:bottom-4 sm:right-4"
      } z-50 font-sans select-none`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="mb-2 w-72 sm:w-84 max-w-[calc(100vw-1.5rem)] bg-white rounded-3xl border-2 border-slate-300 border-b-4 p-3.5 sm:p-4 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-teal-100 text-teal-700">
                  <UserCheck className="size-4" />
                </span>
                <div>
                  <h4 className="font-display text-sm font-bold text-slate-800 leading-tight">
                    Demo Role Switcher
                  </h4>
                  <p className="text-[11px] font-bold text-slate-400">
                    Ganti peran secara instan
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Prototipe
              </span>
            </div>

            {/* List of roles */}
            <div className="space-y-1.5">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const isActive = r.role === currentRole;

                return (
                  <Link
                    key={r.role}
                    href={r.href}
                    onClick={() => {
                      play("pop");
                      setIsOpen(false);
                    }}
                    className={`group flex items-center justify-between p-2.5 rounded-2xl border-2 transition-all active:scale-[0.98] ${
                      isActive
                        ? "bg-slate-50 border-teal-500 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-9 rounded-xl flex items-center justify-center font-bold border-2 transition-transform group-hover:scale-105 ${
                          isActive
                            ? r.badgeBg + " border-transparent"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div className="text-left">
                        <p className="font-display text-sm font-bold text-slate-800 leading-none">
                          {r.label}
                        </p>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                          {r.sublabel}
                        </p>
                      </div>
                    </div>

                    {isActive && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                        Aktif
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Link to login page */}
            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                href="/login"
                onClick={() => {
                  play("pop");
                  setIsOpen(false);
                }}
                className="flex items-center gap-1.5 text-slate-500 hover:text-teal-600 font-bold transition-colors py-1"
              >
                <KeyRound className="size-3.5" />
                Halaman Login
              </Link>
              <Link
                href="/"
                onClick={() => {
                  play("pop");
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold transition-colors py-1"
              >
                Showcase Home
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={() => {
          play("pop");
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl border-2 border-b-3 sm:border-b-4 font-display font-bold text-xs sm:text-sm shadow-md transition-all active:translate-y-[1px] ${
          activeRoleOption
            ? "bg-white text-slate-800 border-slate-300 hover:border-slate-400"
            : "bg-teal-500 text-white border-teal-600 hover:bg-teal-600"
        }`}
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 sm:size-4 text-amber-500 animate-spin-slow shrink-0" />
          <span className="hidden sm:inline text-slate-500">Peran:</span>
          <span className="font-bold text-teal-700">
            {activeRoleOption ? activeRoleOption.label : "Peran"}
          </span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 shrink-0"
        >
          <ChevronUp className="size-3.5 sm:size-4" />
        </motion.span>
      </motion.button>
    </div>
  );
}

export default DemoRoleSwitcher;
