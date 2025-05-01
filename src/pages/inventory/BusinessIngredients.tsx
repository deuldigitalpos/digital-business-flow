
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
import IngredientDashboard from "@/components/business-inventory/IngredientDashboard";
import IngredientList from "@/components/business-inventory/IngredientList";
import IngredientForm from "@/components/business-inventory/IngredientForm";
import AddStockTransactionForm from "@/components/business-inventory/AddStockTransactionForm";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";

const BusinessIngredients: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isStockFormOpen, setIsStockFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { data: categories = [] } = useBusinessCategories();

  // Helper function to ensure we never have empty string values
  const getSafeCategoryValue = (id: string | null | undefined, name: string | null | undefined): string => {
    // If we have a valid ID and it's not an empty string, use it
    if (id && id.trim() !== '') return id;
    
    // Generate a unique, non-empty fallback value using sanitized name or default
    const safeName = name && name.trim() !== '' ? name.trim() : 'unnamed';
    return `category-${safeName}-${Math.random().toString(36).substring(2, 9)}`;
  };

  return (
    <PermissionGuard permission="inventory">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Raw Ingredients</h1>
            <p className="text-muted-foreground">
              Manage your raw ingredient inventory
            </p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isAddFormOpen} onOpenChange={setIsAddFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Ingredient
                </Button>
              </DialogTrigger>
              <IngredientForm ingredient={null} onClose={() => setIsAddFormOpen(false)} />
            </Dialog>
            
            <Dialog open={isStockFormOpen} onOpenChange={setIsStockFormOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <History className="mr-2 h-4 w-4" /> Add Stock
                </Button>
              </DialogTrigger>
              <AddStockTransactionForm 
                onClose={() => setIsStockFormOpen(false)} 
                defaultTransactionType="ingredient" 
              />
            </Dialog>
          </div>
        </div>

        <IngredientDashboard />

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Ingredients Management</CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:w-auto w-full">
                <Input
                  placeholder="Search ingredients..."
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
                    {(categories || []).map(category => {
                      const safeValue = getSafeCategoryValue(category.id, category.name);
                      return (
                        <SelectItem 
                          key={safeValue}
                          value={safeValue}
                        >
                          {category.name || 'Unnamed Category'}
                        </SelectItem>
                      );
                    })}
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
                <IngredientList 
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

export default BusinessIngredients;
