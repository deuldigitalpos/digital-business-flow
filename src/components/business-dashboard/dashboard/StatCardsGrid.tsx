
import React from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Wallet, 
  TrendingUp, 
  TrendingDown
} from 'lucide-react';
import StatCard from './StatCard';

const StatCardsGrid = () => {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Sales"
        value="$24,435"
        Icon={ShoppingCart}
        trend={{
          value: "12%",
          isPositive: true,
          TrendIcon: TrendingUp
        }}
        accentColor="orange-500"
      />
      <StatCard
        title="Inventory"
        value="$13,120"
        Icon={Package}
        trend={{
          value: "4%",
          isPositive: true,
          TrendIcon: TrendingUp
        }}
        accentColor="orange-400"
      />
      <StatCard
        title="Customers"
        value="134"
        Icon={Users}
        trend={{
          value: "8%",
          isPositive: true,
          TrendIcon: TrendingUp
        }}
        accentColor="orange-300"
      />
      <StatCard
        title="Expenses"
        value="$6,240"
        Icon={Wallet}
        trend={{
          value: "3%",
          isPositive: false,
          TrendIcon: TrendingDown
        }}
        accentColor="orange-200"
      />
    </div>
  );
};

export default StatCardsGrid;
