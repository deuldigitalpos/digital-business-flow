
import React from "react";
import { Dialog } from "@/components/ui/dialog";
import AddStockTransactionForm from "./AddStockTransactionForm";

interface AddStockTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTransactionType?: 'consumable' | 'ingredient' | 'addon' | 'product';
}

const AddStockTransactionModal: React.FC<AddStockTransactionModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTransactionType = 'consumable' 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AddStockTransactionForm 
        onClose={onClose} 
        defaultTransactionType={defaultTransactionType} 
      />
    </Dialog>
  );
};

export default AddStockTransactionModal;
