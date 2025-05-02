
// This file has been deprecated and should no longer be used
// It's being kept temporarily to prevent breaking changes
// The functionality has been removed due to the non-existent business_units table

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AddonFormValues } from './types';

interface UnitSelectProps {
  form: UseFormReturn<AddonFormValues>;
}

export const UnitSelect: React.FC<UnitSelectProps> = () => {
  return null; // This component is no longer used
};
