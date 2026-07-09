// src/components/Layout.jsx
import React from 'react';
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";

function normalizeRole(role) {
  if (!role) return 'USER';
  const upperRole = role.toUpperCase();
  if (['ADMIN', 'TECHNICIEN'].includes(upperRole)) return upperRole;
  return 'USER';
}

export default function Layout({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F5F8FC]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00428C]" />
      </div>
    );
  }

  const actualRole = role || user?.role;
  const menuRole = normalizeRole(actualRole);

  return (
    <div className="flex flex-col h-screen bg-slate-100">

    <Navbar />

    <div className="flex flex-1 overflow-hidden">

        <Sidebar
            role={menuRole}
            actualRole={actualRole}
        />

        <main className="flex-1 overflow-y-auto bg-slate-100 p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-full p-6">
                {children}
            </div>
        </main>

    </div>

</div>
  );
}