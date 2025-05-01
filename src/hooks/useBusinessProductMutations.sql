
-- SQL functions to support product recipe and consumable operations
-- These functions should be added to your Supabase database

-- Function to insert product recipes
CREATE OR REPLACE FUNCTION public.insert_product_recipes(items jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert recipe items from the JSON array
  INSERT INTO public.business_product_recipes (product_id, ingredient_id, quantity, unit_id, cost)
  SELECT 
    (item->>'product_id')::uuid,
    (item->>'ingredient_id')::uuid,
    (item->>'quantity')::numeric,
    (item->>'unit_id')::uuid,
    (item->>'cost')::numeric
  FROM jsonb_array_elements(items) AS item;
END;
$$;

-- Function to delete product recipes by product ID
CREATE OR REPLACE FUNCTION public.delete_product_recipes(product_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.business_product_recipes
  WHERE product_id = product_id_param;
END;
$$;

-- Function to insert product consumables
CREATE OR REPLACE FUNCTION public.insert_product_consumables(items jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert consumable items from the JSON array
  INSERT INTO public.business_product_consumables (product_id, consumable_id, quantity, unit_id, cost)
  SELECT 
    (item->>'product_id')::uuid,
    (item->>'consumable_id')::uuid,
    (item->>'quantity')::numeric,
    (item->>'unit_id')::uuid,
    (item->>'cost')::numeric
  FROM jsonb_array_elements(items) AS item;
END;
$$;

-- Function to delete product consumables by product ID
CREATE OR REPLACE FUNCTION public.delete_product_consumables(product_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.business_product_consumables
  WHERE product_id = product_id_param;
END;
$$;
