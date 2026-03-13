"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search, Users, ShieldCheck, UserX, CreditCard,
  Pencil, Trash2, Save, AlertTriangle, Eye,
  ChevronDown, UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string | null;
  plan: string;
  subscriptionStatus: string | null;
  subscriptionId: string | null;
  createdAt: string;
  banned: boolean | null;
}

interface UsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

const planColors: Record<string, string> = {
  basic: "bg-slate-100 text-slate-700 border-slate-200",
  pro: "bg-violet-100 text-violet-700 border-violet-200",
  premium: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-orange-100 text-orange-700 border-orange-200",
  expired: "bg-red-100 text-red-700 border-red-200",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Use empty base so requests go through the Next.js proxy (/api/*),
// ensuring the session cookie (set on www.inicioofficial.com) is included.
const BASE = "";

// ── Create User Modal ─────────────────────────────────────────────────────────
function CreateUserModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (created: AdminUser) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin" | "agent">("user");
  const [plan, setPlan] = useState<"basic" | "pro" | "premium">("basic");
  const [emailVerified, setEmailVerified] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setCreating(true);
    setError(null);
    
    // Validate name
    if (!name || name.trim().length === 0) {
      setError("Name is required");
      setCreating(false);
      return;
    }
    
    // Validate email
    if (!email || !email.includes("@")) {
      setError("Valid email is required");
      setCreating(false);
      return;
    }
    
    // Validate password
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      setCreating(false);
      return;
    }
    
    try {
      const res = await fetch(`${BASE}/api/admin/users`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email,
          password,
          role,
          plan,
          emailVerified,
        }),
      });
      
      if (!res.ok) {
        const text = await res.text();
        let j: any = {};
        try {
          j = JSON.parse(text);
        } catch {
          console.error("[CreateUser] Response not JSON:", text);
        }
        
        console.error("[CreateUser] Failed to create:", {
          status: res.status,
          statusText: res.statusText,
          response: j,
          responseText: text.substring(0, 500),
          sent: {
            name,
            email,
            role,
            plan,
            emailVerified,
          }
        });
        
        // Extract error message
        let errorMessage = "Create failed";
        if (j.message) {
          errorMessage = j.message;
        } else if (j.error?.message) {
          errorMessage = j.error.message;
        } else if (j.error?.issues) {
          errorMessage = j.error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ');
        } else if (typeof j.error === 'string') {
          errorMessage = j.error;
        }
        
        throw new Error(errorMessage);
      }
      
      const created: AdminUser = await res.json();
      onCreated(created);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-4" />
            Create New User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name *</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className={cn(
                !name || name.trim().length === 0 ? "border-red-300 focus-visible:ring-red-500" : ""
              )}
            />
            {(!name || name.trim().length === 0) && (
              <p className="text-xs text-red-600">Name is required</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email *</label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className={cn(
                !email || !email.includes("@") ? "border-red-300 focus-visible:ring-red-500" : ""
              )}
            />
            {(!email || !email.includes("@")) && (
              <p className="text-xs text-red-600">Valid email is required</p>
            )}
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Password *</label>
            <Input
              type="password"
              placeholder="Enter password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={cn(
                password && password.length > 0 && password.length < 8 ? "border-red-300 focus-visible:ring-red-500" : ""
              )}
            />
            {password && password.length > 0 && password.length < 8 ? (
              <p className="text-xs text-red-600">
                Password must be at least 8 characters ({password.length}/8)
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters required
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "user" | "admin" | "agent")}
                  className="w-full appearance-none rounded-md border bg-background px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Plan</label>
              <div className="relative">
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as "basic" | "pro" | "premium")}
                  className="w-full appearance-none rounded-md border bg-background px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="basic">Free</option>
                  <option value="pro">Pro</option>
                  <option value="premium">Premium</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border p-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <ShieldCheck className={cn(
                  "size-4",
                  emailVerified ? "text-green-500" : "text-muted-foreground"
                )} />
                <span className="text-sm font-medium">Email Verified</span>
              </div>
              <button
                type="button"
                onClick={() => setEmailVerified((v) => !v)}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  emailVerified ? "bg-green-500" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform",
                    emailVerified ? "translate-x-[18px]" : "translate-x-1"
                  )}
                />
              </button>
            </label>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={creating}>Cancel</Button>
          <Button 
            onClick={handleCreate} 
            disabled={
              creating || 
              !name || 
              name.trim().length === 0 || 
              !email ||
              !email.includes("@") ||
              !password ||
              password.length < 8
            }
          >
            <UserPlus className="size-3.5 mr-1.5" />
            {creating ? "Creating…" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditUserModal({
  user,
  onClose,
  onSaved,
}: {
  user: AdminUser;
  onClose: () => void;
  onSaved: (updated: AdminUser) => void;
}) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<"user" | "admin" | "agent">(
    user.role === "admin" ? "admin" : user.role === "agent" ? "agent" : "user"
  );
  const [plan, setPlan] = useState<"basic" | "pro" | "premium">(
    (user.plan as "basic" | "pro" | "premium") ?? "basic"
  );
  const [emailVerified, setEmailVerified] = useState(user.emailVerified);
  const [password, setPassword] = useState("");
  const [banned, setBanned] = useState(!!user.banned);
  const [banReason, setBanReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    
    // Validate name
    if (!name || name.trim().length === 0) {
      setError("Name is required");
      setSaving(false);
      return;
    }
    
    // Validate password length if provided
    if (password && password.length < 8) {
      setError("Password must be at least 8 characters");
      setSaving(false);
      return;
    }
    
    try {
      const res = await fetch(`${BASE}/api/admin/users/${user.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email,
          role,
          plan,
          emailVerified,
          ...(password ? { password } : {}),
          banned,
          ...(banned && banReason ? { banReason } : {}),
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        let j: any = {};
        try {
          j = JSON.parse(text);
        } catch {
          console.error("[EditUser] Response not JSON:", text);
        }
        
        console.error("[EditUser] Failed to update:", {
          status: res.status,
          statusText: res.statusText,
          response: j,
          responseText: text.substring(0, 500),
          sent: {
            name,
            email,
            role,
            plan,
            emailVerified,
            password: password ? "***" : undefined,
            banned,
            banReason: banned && banReason ? banReason : undefined,
          }
        });
        
        // Extract error message from various formats
        let errorMessage = "Save failed";
        if (j.message) {
          errorMessage = j.message;
        } else if (j.error?.message) {
          errorMessage = j.error.message;
        } else if (j.error?.issues) {
          // Zod validation errors
          errorMessage = j.error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join(', ');
        } else if (typeof j.error === 'string') {
          errorMessage = j.error;
        }
        
        throw new Error(errorMessage);
      }
      const updated: AdminUser = await res.json();
      onSaved(updated);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="size-4" />
            Edit User
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border">
          <div className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-violet-600 to-fuchsia-600 text-white font-bold shrink-0">
            {user.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <span className="ml-auto text-xs text-muted-foreground font-mono shrink-0">
            {user.id.slice(0, 8)}…
          </span>
        </div>

        <div className="space-y-4 mt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className={cn(
                !name || name.trim().length === 0 ? "border-red-300 focus-visible:ring-red-500" : ""
              )}
            />
            {(!name || name.trim().length === 0) && (
              <p className="text-xs text-red-600">Name is required</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Role</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "user" | "admin" | "agent")}
                  className="w-full appearance-none rounded-md border bg-background px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Plan</label>
              <div className="relative">
                <select
                  value={plan}
                  onChange={(e) => setPlan(e.target.value as "basic" | "pro" | "premium")}
                  className="w-full appearance-none rounded-md border bg-background px-3 py-2 text-sm pr-8 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="basic">Free</option>
                  <option value="pro">Pro</option>
                  <option value="premium">Premium</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              New Password (optional)
            </label>
            <Input
              type="password"
              placeholder="Enter new password (8+ characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={cn(
                password && password.length > 0 && password.length < 8 && "border-red-300 focus-visible:ring-red-500"
              )}
            />
            {password && password.length > 0 && password.length < 8 ? (
              <p className="text-xs text-red-600">
                Password must be at least 8 characters ({password.length}/8)
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Leave empty to keep current password
              </p>
            )}
          </div>

          <div className="rounded-xl border p-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <ShieldCheck className={cn(
                  "size-4",
                  emailVerified ? "text-green-500" : "text-muted-foreground"
                )} />
                <span className="text-sm font-medium">Email Verified</span>
              </div>
              <button
                type="button"
                onClick={() => setEmailVerified((v) => !v)}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  emailVerified ? "bg-green-500" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform",
                    emailVerified ? "translate-x-[18px]" : "translate-x-1"
                  )}
                />
              </button>
            </label>
          </div>

          <div className="rounded-xl border p-3 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <UserX className="size-4 text-red-500" />
                <span className="text-sm font-medium">Banned</span>
              </div>
              <button
                type="button"
                onClick={() => setBanned((b) => !b)}
                className={cn(
                  "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                  banned ? "bg-red-500" : "bg-muted"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform",
                    banned ? "translate-x-[18px]" : "translate-x-1"
                  )}
                />
              </button>
            </label>
            {banned && (
              <Input
                placeholder="Ban reason (optional)"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="text-sm"
              />
            )}
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            disabled={
              saving || 
              !name || 
              name.trim().length === 0 || 
              (password.length > 0 && password.length < 8)
            }
          >
            <Save className="size-3.5 mr-1.5" />
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteUserModal({
  user,
  onClose,
  onDeleted,
}: {
  user: AdminUser;
  onClose: () => void;
  onDeleted: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/api/admin/users/${user.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { message?: string }).message ?? "Delete failed");
      }
      onDeleted(user.id);
    } catch (err) {
      setError((err as Error).message);
      setDeleting(false);
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="size-4" />
            Delete User
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-1">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
            <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              This is <strong>permanent</strong>. All data for this user will be deleted and cannot be recovered.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-muted/40 border">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">
              Type <span className="font-mono font-semibold text-foreground">{user.email}</span> to confirm
            </label>
            <Input
              placeholder={user.email}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>
        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose} disabled={deleting}>Cancel</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== user.email || deleting}
          >
            <Trash2 className="size-3.5 mr-1.5" />
            {deleting ? "Deleting…" : "Delete permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── View Details Modal ────────────────────────────────────────────────────────
function ViewUserModal({
  user,
  onClose,
  onEdit,
}: {
  user: AdminUser;
  onClose: () => void;
  onEdit: () => void;
}) {
  const rows = [
    { label: "User ID",        value: user.id,                          mono: true  },
    { label: "Name",           value: user.name,                        mono: false },
    { label: "Email",          value: user.email,                       mono: true  },
    { label: "Role",           value: user.role ?? "user",              mono: false },
    { label: "Plan",           value: user.plan,                        mono: false },
    { label: "Subscription",   value: user.subscriptionStatus ?? "—",  mono: false },
    { label: "Sub ID",         value: user.subscriptionId ?? "—",      mono: true  },
    { label: "Joined",         value: formatDate(user.createdAt),       mono: false },
    { label: "Account Status", value: user.banned ? "Banned" : "Active", mono: false },
  ];

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="size-4" />
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border">
          <div className="flex size-12 items-center justify-center rounded-full bg-linear-to-br from-violet-600 to-fuchsia-600 text-white text-lg font-bold shrink-0">
            {user.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className={cn("inline-flex rounded px-1.5 py-0.5 text-xs font-medium border capitalize", planColors[user.plan] ?? planColors.basic)}>
                {user.plan}
              </span>
              {user.banned && (
                <span className="inline-flex rounded px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 border border-red-200">Banned</span>
              )}
              {user.role === "admin" && (
                <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
                  <ShieldCheck className="size-3" /> Admin
                </span>
              )}
              {user.role === "agent" && (
                <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                  <Users className="size-3" /> Agent
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border divide-y text-sm mt-1">
          {rows.map(({ label, value, mono }) => (
            <div key={label} className="flex items-start justify-between px-3 py-2.5 gap-3">
              <span className="text-muted-foreground shrink-0">{label}</span>
              <span className={cn("text-right break-all", mono && "font-mono text-xs")}>{value}</span>
            </div>
          ))}
        </div>

        <DialogFooter className="gap-2 mt-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button onClick={onEdit}>
            <Pencil className="size-3.5 mr-1.5" />
            Edit user
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [viewUser, setViewUser] = useState<AdminUser | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchUsers = useCallback(
    async (currentPage: number, searchTerm: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(currentPage), limit: String(limit) });
        if (searchTerm) params.set("search", searchTerm);
        const res = await fetch(`${BASE}/api/admin/users?${params}`, { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch users");
        setData(await res.json());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(1, search); }, 400);
    return () => clearTimeout(t);
  }, [search, fetchUsers]);

  useEffect(() => { fetchUsers(page, search); }, [page]); // eslint-disable-line

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  function handleSaved(updated: AdminUser) {
    setData((prev) => prev ? { ...prev, users: prev.users.map((u) => u.id === updated.id ? updated : u) } : prev);
    setEditUser(null);
    setViewUser(null);
  }

  function handleCreated(created: AdminUser) {
    setData((prev) => prev ? { ...prev, users: [created, ...prev.users], total: prev.total + 1 } : prev);
    setShowCreateModal(false);
  }

  function handleDeleted(id: string) {
    setData((prev) => prev ? { ...prev, users: prev.users.filter((u) => u.id !== id), total: prev.total - 1 } : prev);
    setDeleteUser(null);
  }

  return (
    <div>
      {showCreateModal && (
        <CreateUserModal onClose={() => setShowCreateModal(false)} onCreated={handleCreated} />
      )}
      {viewUser && !editUser && (
        <ViewUserModal
          user={viewUser}
          onClose={() => setViewUser(null)}
          onEdit={() => { setEditUser(viewUser); setViewUser(null); }}
        />
      )}
      {editUser && (
        <EditUserModal user={editUser} onClose={() => setEditUser(null)} onSaved={handleSaved} />
      )}
      {deleteUser && (
        <DeleteUserModal user={deleteUser} onClose={() => setDeleteUser(null)} onDeleted={handleDeleted} />
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {data ? `${data.total.toLocaleString()} registered users` : "Loading…"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0 shadow-md shrink-0"
          >
            <UserPlus className="size-4 mr-2" />
            Create User
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">{error}</div>
      )}

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Plan</th>
                <th className="px-4 py-3 text-left font-medium">Subscription</th>
                <th className="px-4 py-3 text-left font-medium">Joined</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0 animate-pulse">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-muted" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-28 bg-muted rounded" />
                          <div className="h-3 w-40 bg-muted rounded" />
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-3.5 w-16 bg-muted rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : data?.users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <Users className="mx-auto size-8 mb-2 opacity-40" />
                    No users found
                  </td>
                </tr>
              ) : (
                data?.users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-violet-600 to-fuchsia-600 text-white text-xs font-bold shrink-0">
                          {user.name?.charAt(0)?.toUpperCase() ?? "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-40">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
                          <ShieldCheck className="size-3" /> Admin
                        </span>
                      ) : user.role === "agent" ? (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                          <Users className="size-3" /> Agent
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">User</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border capitalize", planColors[user.plan] ?? planColors.basic)}>
                        <CreditCard className="size-3" />{user.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.subscriptionStatus ? (
                        <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-medium border capitalize", statusColors[user.subscriptionStatus] ?? "bg-gray-100 text-gray-700")}>
                          {user.subscriptionStatus}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {user.emailVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          ✓ Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 border border-orange-200">
                          ⚠ Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.banned ? (
                        <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                          <UserX className="size-3" /> Banned
                        </span>
                      ) : (
                        <span className="inline-flex rounded-md px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewUser(user)}
                          title="View details"
                          className="inline-flex items-center justify-center size-7 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setEditUser(user)}
                          title="Edit user"
                          className="inline-flex items-center justify-center size-7 rounded-md hover:bg-violet-50 transition-colors text-muted-foreground hover:text-violet-700"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteUser(user)}
                          title="Delete user"
                          className="inline-flex items-center justify-center size-7 rounded-md hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3 bg-muted/20">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, data?.total ?? 0)} of {data?.total.toLocaleString()} users
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-xs text-muted-foreground">{page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
