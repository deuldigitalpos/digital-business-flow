
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusinessAuth } from "@/context/BusinessAuthContext";
import PermissionGuard from "@/components/business/PermissionGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, History, Search } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ConsumableDashboard from "@/components/business-inventory/ConsumableDashboard";
import ConsumableList from "@/components/business-inventory/ConsumableList";
import ConsumableForm from "@/components/business-inventory/ConsumableForm";
import AddStockTransactionForm from "@/components/business-inventory/AddStockTransactionForm";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const BusinessConsumables: React.FC = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isStockFormOpen, setIsStockFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openCategoryPopover, setOpenCategoryPopover] = useState(false);
  const { data: categoriesData = [] } = useBusinessCategories();
  
  // Ensure categories is always a valid array
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

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
          
          <div className="flex flex-wrap gap-2">
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
              <CardTitle className="text-xl font-semibold">Consumables Management</CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-[200px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search consumables..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Popover open={openCategoryPopover} onOpenChange={setOpenCategoryPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCategoryPopover}
                      className="w-full sm:w-[200px] justify-between"
                    >
                      {selectedCategory === "all"
                        ? "All Categories"
                        : categories.find(category => category.id === selectedCategory)?.name || "All Categories"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="All Categories"
                          onSelect={() => {
                            setSelectedCategory("all");
                            setOpenCategoryPopover(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCategory === "all" ? "opacity-100" : "opacity-0"
                            )}
                          />
                          All Categories
                        </CommandItem>
                        {categories.filter(category => category && category.id).map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.name}
                            onSelect={() => {
                              setSelectedCategory(category.id);
                              setOpenCategoryPopover(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCategory === category.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {category.name || 'Unnamed Category'}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
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
