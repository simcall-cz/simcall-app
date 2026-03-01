"use client";

import { Phone, TrendingUp, Clock, Award, PhoneCall } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCallHistory } from "@/hooks/useCallHistory";

export default function ProfilPage() {
  const { calls, isLoading } = useCallHistory({ limit: 200 });

  const completedCalls = calls.filter((c) => c.successRate > 0);
  const totalCalls = calls.length;
  const avgScore =
    completedCalls.length > 0
      ? Math.round(
        completedCalls.reduce((sum, c) => sum + c.successRate, 0) /
        completedCalls.length
      )
      : 0;
  const bestScore =
    completedCalls.length > 0
      ? Math.max(...completedCalls.map((c) => c.successRate))
      : 0;
  const totalSeconds = calls.reduce((sum, c) => {
    const parts = c.duration.split(":");
    return sum + (parseInt(parts[0] || "0") * 60 + parseInt(parts[1] || "0"));
  }, 0);
  const totalMinutes = Math.round(totalSeconds / 60);

  // Recent performance (last 5 calls)
  const recentCalls = completedCalls.slice(0, 5);
  const recentAvg =
    recentCalls.length > 0
      ? Math.round(
        recentCalls.reduce((sum, c) => sum + c.successRate, 0) /
        recentCalls.length
      )
      : 0;

  // Improvement (compare first half to second half of completed calls)
  let improvement = 0;
  if (completedCalls.length >= 4) {
    const mid = Math.floor(completedCalls.length / 2);
    const olderAvg =
      completedCalls
        .slice(mid)
        .reduce((sum, c) => sum + c.successRate, 0) /
      (completedCalls.length - mid);
    const newerAvg =
      completedCalls
        .slice(0, mid)
        .reduce((sum, c) => sum + c.successRate, 0) / mid;
    improvement = Math.round(newerAvg - olderAvg);
  }

  const stats = [
    {
      label: "Celkem hovorů",
      value: totalCalls.toString(),
      icon: Phone,
      bg: "bg-neutral-50",
      iconColor: "text-neutral-600",
    },
    {
      label: "Průměrné skóre",
      value: avgScore > 0 ? `${avgScore}%` : "—",
      icon: TrendingUp,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Nejlepší skóre",
      value: bestScore > 0 ? `${bestScore}%` : "—",
      icon: Award,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Čas tréninku",
      value: totalMinutes > 0 ? `${totalMinutes} min` : "—",
      icon: Clock,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Profil</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Váš přehled a výkonnost
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-lg ${stat.bg}`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500 truncate">
                    {stat.label}
                  </p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Výkonnost</CardTitle>
        </CardHeader>
        <CardContent>
          {completedCalls.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
              <p className="text-neutral-500 font-medium">
                Zatím žádné dokončené hovory
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                Zrealizujte první hovor pro zobrazení statistik
              </p>
              <Link href="/dashboard/hovory/novy-hovor">
                <Button className="mt-4" size="sm">
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Nový hovor
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Recent performance */}
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <span className="text-sm text-neutral-600">
                  Průměr posledních {recentCalls.length} hovorů
                </span>
                <Badge
                  className={
                    recentAvg >= 70
                      ? "bg-green-50 text-green-700"
                      : recentAvg >= 50
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-700"
                  }
                >
                  {recentAvg}%
                </Badge>
              </div>

              {/* Improvement */}
              {improvement !== 0 && (
                <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                  <span className="text-sm text-neutral-600">
                    Zlepšení oproti začátku
                  </span>
                  <Badge
                    className={
                      improvement > 0
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }
                  >
                    {improvement > 0 ? "+" : ""}
                    {improvement}%
                  </Badge>
                </div>
              )}

              {/* Completed ratio */}
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <span className="text-sm text-neutral-600">
                  Dokončené hovory
                </span>
                <span className="text-sm font-medium text-neutral-900">
                  {completedCalls.length} / {totalCalls}
                </span>
              </div>

              {/* Best score */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-neutral-600">
                  Nejlepší výsledek
                </span>
                <Badge className="bg-amber-50 text-amber-700">
                  {bestScore}%
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Action */}
      <Card className="border-primary-100 bg-gradient-to-r from-primary-50/50 to-white">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              Pokračujte v tréninku
            </h3>
            <p className="text-sm text-neutral-500 mt-1">
              Každý hovor vás posune blíž k lepším výsledkům.
            </p>
          </div>
          <Link href="/dashboard/hovory/novy-hovor">
            <Button size="lg" className="whitespace-nowrap">
              <PhoneCall className="w-5 h-5 mr-2" />
              Nový hovor
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
