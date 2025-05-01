
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import PermissionGuard from "@/components/business/PermissionGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, History } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import ConsumableDashboard from "@/components/business-inventory/ConsumableDashboard";
import ConsumableList from "@/components/business-inventory/ConsumableList";
import ConsumableForm from "@/components/business-inventory/ConsumableForm";
import AddStockTransactionForm from "@/components/business-inventory/AddStockTransactionForm";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";

const BusinessConsumables: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isStockFormOpen, setIsStockFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all"); // Initialize with 'all'
  const { data: categories } = useBusinessCategories();

  return (
    <PermissionGuard permission="inventory">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Consumables</h1>
            <p className="text-muted-foreground">
              Manage your consumable inventory items
            </p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Consumable
                </Button>
              </DialogTrigger>
              <ConsumableForm consumable={null} onClose={() => setIsAddFormOpen(false)} />
            </Dialog>
            
            <Dialog open={isStockFormOpen} onOpenChange={setIsStockFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <History className="mr-2 h-4 w-4" /> Add Stock
                </Button>
              </DialogTrigger>
              <AddStockTransactionForm 
                onClose={() => setIsStockFormOpen(false)} 
                defaultTransactionType="consumable" 
              />
            </Dialog>
          </div>
        </div>

        <ConsumableDashboard />

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Consumables Management</CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:w-auto w-full">
                <Input
                  placeholder="Search consumables..."
                  className="w-full sm:w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories?.map(category => (
                      <SelectItem key={category.id} value={category.id || "no-category"}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="list" className="flex-1 sm:flex-none">List View</TabsTrigger>
                <TabsTrigger value="activity" className="flex-1 sm:flex-none">Activity Log</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <ConsumableList 
                  searchTerm={searchTerm}
                  categoryFilter={selectedCategory === "all" ? undefined : selectedCategory}
                />
              </TabsContent>
              
              <TabsContent value="activity">
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Activity log functionality coming soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PermissionGuard>
  );
};

export default BusinessConsumables;
