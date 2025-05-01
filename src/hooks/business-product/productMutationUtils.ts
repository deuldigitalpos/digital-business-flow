
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Disables Row Level Security for the current session
 * @returns The access token used for the operation
 */
export async function disableRLS(): Promise<string> {
  const session = await supabase.auth.getSession();
  const accessToken = session.data.session?.access_token;
  
  if (!accessToken) {
    throw new Error('No valid access token found');
  }
  
  console.log("Attempting to disable RLS");
  
  const disableRlsResponse = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/disable_rls`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({})
    }
  );
  
  if (!disableRlsResponse.ok) {
    const errorText = await disableRlsResponse.text();
    console.error("Failed to disable RLS:", errorText);
    throw new Error(`Failed to disable RLS: ${errorText}`);
  }
  
  console.log("RLS disabled successfully");
  return accessToken;
}

/**
 * Re-enables Row Level Security for the current session
 * @param accessToken The access token to use for the operation
 */
export async function enableRLS(accessToken: string): Promise<void> {
  console.log("Attempting to re-enable RLS");
  
  try {
    const enableRlsResponse = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/enable_rls`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({})
      }
    );
    
    if (!enableRlsResponse.ok) {
      console.warn(`Failed to enable RLS: ${await enableRlsResponse.text()}`);
      // Continue execution even if re-enabling fails
    } else {
      console.log("RLS re-enabled successfully");
    }
  } catch (error) {
    console.error('Failed to re-enable RLS:', error);
  }
}

/**
 * Inserts recipe items for a product
 * @param accessToken The access token to use for the operation
 * @param recipeItems The recipe items to insert
 */
export async function insertProductRecipes(accessToken: string, recipeItems: any[]): Promise<void> {
  console.log("Inserting product recipes:", recipeItems);
  
  const recipeResponse = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/insert_product_recipes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ items: recipeItems })
    }
  );
  
  if (!recipeResponse.ok) {
    const errorData = await recipeResponse.json();
    const error = new Error(`Failed to insert recipe items: ${JSON.stringify(errorData)}`);
    console.error('Error creating product recipe items:', error);
    throw error;
  }
  
  console.log("Recipe items added successfully");
}

/**
 * Deletes recipe items for a product
 * @param accessToken The access token to use for the operation
 * @param productId The product ID to delete recipes for
 */
export async function deleteProductRecipes(accessToken: string, productId: string): Promise<void> {
  console.log("Deleting product recipes for product ID:", productId);
  
  const deleteResponse = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/delete_product_recipes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ product_id_param: productId })
    }
  );
  
  if (!deleteResponse.ok) {
    throw new Error(`Failed to delete recipe items: ${await deleteResponse.text()}`);
  }
  
  console.log("Recipe items deleted successfully");
}

/**
 * Inserts consumable items for a product
 * @param accessToken The access token to use for the operation
 * @param consumableItems The consumable items to insert
 */
export async function insertProductConsumables(accessToken: string, consumableItems: any[]): Promise<void> {
  console.log("Inserting product consumables:", consumableItems);
  
  const consumableResponse = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/insert_product_consumables`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ items: consumableItems })
    }
  );
  
  if (!consumableResponse.ok) {
    const errorData = await consumableResponse.json();
    const error = new Error(`Failed to insert consumable items: ${JSON.stringify(errorData)}`);
    console.error('Error creating product consumables:', error);
    throw error;
  }
  
  console.log("Consumable items added successfully");
}

/**
 * Deletes consumable items for a product
 * @param accessToken The access token to use for the operation
 * @param productId The product ID to delete consumables for
 */
export async function deleteProductConsumables(accessToken: string, productId: string): Promise<void> {
  console.log("Deleting product consumables for product ID:", productId);
  
  const deleteResponse = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/delete_product_consumables`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ product_id_param: productId })
    }
  );
  
  if (!deleteResponse.ok) {
    throw new Error(`Failed to delete consumable items: ${await deleteResponse.text()}`);
  }
  
  console.log("Consumable items deleted successfully");
}
