"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BellRing, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  MessageSquare, 
  UserPlus, 
  CreditCard,
  Loader2,
  ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cs } from "date-fns/locale";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function markAsRead(id: string) {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      
      await fetch(`/api/admin/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true })
      });
      // Optionally re-fetch to sync completely
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteNotification(id: string) {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
      await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE"
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function markAllAsRead() {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;

    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

    // For simplicity, we can just loop them. In a real heavy app we'd have a bulk endpoint.
    for (const id of unreadIds) {
      fetch(`/api/admin/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true })
      }).catch(console.error);
    }
  }

  const getIcon = (type: string, isRead: boolean) => {
    const className = `w-5 h-5 ${isRead ? 'text-neutral-400' : 'text-primary-600'}`;
    switch (type) {
      case 'meeting': return <Calendar className={className} />;
      case 'form': return <MessageSquare className={className} />;
      case 'user': return <UserPlus className={className} />;
      case 'payment': return <CreditCard className={className} />;
      default: return <BellRing className={className} />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-primary-500" />
            Centrum upozornění
          </h1>
          <p className="text-neutral-500 mt-1">
            Přehled veškerých událostí od klientů na jednom místě.
          </p>
        </div>
        
        {notifications.some(n => !n.is_read) && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            Označit vše jako přečtené
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BellRing className="w-8 h-8 text-neutral-300" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-1">Žádná upozornění</h3>
              <p className="text-neutral-500">Zatím se nestalo nic nového. Až se něco stane, uvidíte to zde.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              <AnimatePresence initial={false}>
                {notifications.map((n) => (
                  <motion.div 
                    key={n.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-4 sm:p-5 flex gap-4 transition-colors ${!n.is_read ? 'bg-primary-50/50 hover:bg-primary-50' : 'hover:bg-neutral-50'}`}
                  >
                    <div className="shrink-0 mt-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!n.is_read ? 'bg-white shadow-sm ring-1 ring-primary-100' : 'bg-neutral-100'}`}>
                        {getIcon(n.type, n.is_read)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-semibold text-base ${!n.is_read ? 'text-primary-950' : 'text-neutral-800'}`}>
                            {n.title}
                          </h4>
                          {!n.is_read && (
                            <Badge variant="default" className="bg-primary-500 text-[10px] uppercase font-bold px-1.5 py-0">Nové</Badge>
                          )}
                        </div>
                        <span className="text-xs text-neutral-400 whitespace-nowrap">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: cs })}
                        </span>
                      </div>
                      
                      <p className={`text-sm ${!n.is_read ? 'text-neutral-700' : 'text-neutral-500'} mb-3`}>
                        {n.message}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        {n.link && (
                          <Link href={n.link}>
                            <Button size="sm" variant="secondary" className="h-8 gap-1 text-xs">
                              Zobrazit detail <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        )}
                        {!n.is_read && (
                          <Button size="sm" variant="ghost" onClick={() => markAsRead(n.id)} className="h-8 text-xs text-neutral-500 hover:text-neutral-900">
                            Označit přečteno
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-neutral-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => deleteNotification(n.id)}
                        title="Smazat upozornění"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
