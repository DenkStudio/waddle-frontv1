"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  loginMethod: string;
}

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("waddle_user");
    if (!userData) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Mock transaction data
    const mockTransactions: Transaction[] = [
      {
        id: "tx_1",
        type: "deposit",
        amount: 500.00,
        description: "Credit Card Deposit",
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: "completed"
      },
      {
        id: "tx_2",
        type: "withdrawal",
        amount: -150.25,
        description: "ATM Withdrawal",
        date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: "completed"
      },
      {
        id: "tx_3",
        type: "transfer",
        amount: -75.00,
        description: "Transfer to John Smith",
        date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        status: "completed"
      },
      {
        id: "tx_4",
        type: "deposit",
        amount: 1000.00,
        description: "USDT Deposit",
        date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        status: "completed"
      }
    ];

    setTransactions(mockTransactions);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("waddle_user");
    router.push("/login");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">W</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Waddle</h1>
              <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="gray" size="sm">
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardHeader>
            <CardTitle className="text-white/90">Total Balance</CardTitle>
            <CardDescription className="text-white/70">
              Available funds in your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">
              {formatCurrency(user.balance)}
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => router.push("/deposit")}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                size="sm"
              >
                Deposit
              </Button>
              <Button 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                size="sm"
              >
                Withdraw
              </Button>
              <Button 
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                size="sm"
              >
                Transfer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+$1,500.00</div>
              <p className="text-xs text-gray-500 mt-1">↗ 12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Account Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">Premium</div>
              <p className="text-xs text-gray-500 mt-1">Since {user.loginMethod}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest account activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' 
                        ? 'bg-green-100 text-green-600'
                        : transaction.type === 'withdrawal'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {transaction.type === 'deposit' && '↓'}
                      {transaction.type === 'withdrawal' && '↑'}
                      {transaction.type === 'transfer' && '→'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
