"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Users, Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserHeader from "@/components/user-dashboard/UserHeader";
import UserSidebar from "@/components/user-dashboard/UserSidebar";
import UserNav from "@/components/user-dashboard/UserNav";

interface UserData {
  username: string;
  email: string;
  accountBalance: number;
  welcomeBonus: number;
  totalProfits: number;
  totalWithdrawal: number;
  totalDeposit: number;
  role: string[];
  isActive: boolean;
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // For now, we'll use mock data since we don't have a user profile API yet
        // In a real implementation, you'd fetch from /api/user/profile
        const mockUserData: UserData = {
          username: "John Doe",
          email: "john@example.com",
          accountBalance: 20,
          welcomeBonus: 20,
          totalProfits: 0,
          totalWithdrawal: 0,
          totalDeposit: 0,
          role: ["user"],
          isActive: true,
        };
        
        setUser(mockUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const stats = [
    {
      title: "Account Balance",
      value: user ? `$${user.accountBalance.toFixed(2)}` : "$0.00",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Welcome Bonus",
      value: user ? `$${user.welcomeBonus.toFixed(2)}` : "$0.00",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Profits",
      value: user ? `$${user.totalProfits.toFixed(2)}` : "$0.00",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Deposits",
      value: user ? `$${user.totalDeposit.toFixed(2)}` : "$0.00",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <UserHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {user?.username || 'User'}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's what's happening with your Secure Rise account today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
          </div>
        </main>
      </div>


      <UserNav />
    </div>
  );
}