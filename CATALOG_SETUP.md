# TuLink - Catalog Module Setup Guide

## Overview
The catalog module allows you to manage categories and products for your virtual store. It includes:
- **Categories Management**: Create, edit, delete, and organize product categories
- **Products Management**: Add products with images, pricing, stock tracking, and availability status
- **Automatic Stock Management**: Products are automatically marked as unavailable when stock reaches 0

## Database Setup

### Step 1: Run the SQL Script
1. Go to your Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/catalog_setup.sql`
3. Click "Run" to execute the script

This will create:
- `categories` table with RLS policies
- `products` table with RLS policies
- Auto-deactivation trigger for out-of-stock products
- Auto-update triggers for `updated_at` fields

### Step 2: Create Storage Bucket for Product Images
1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Bucket name: `product-images`
4. **Public**: ✅ Enable (make it public)
5. Click "Create bucket"

### Step 3: Configure Storage Policies
After creating the bucket, run these SQL commands in the SQL Editor to set up storage policies:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Users can upload their own product images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update their own images
CREATE POLICY "Users can update their own product images"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own product images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow anyone to view product images (public read)
CREATE POLICY "Anyone can view product images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-images');
```

## Features

### Categories
- ✅ Create, edit, and delete categories
- ✅ Toggle active/inactive status
- ✅ Optional descriptions
- ✅ Custom sort order
- ✅ Row Level Security (users can only access their own categories)

### Products
- ✅ Create, edit, and delete products
- ✅ Upload product images (stored in Supabase Storage)
- ✅ Set price in Dominican Pesos (RD$)
- ✅ Track stock inventory
- ✅ **Automatic deactivation** when stock reaches 0
- ✅ Filter products by category
- ✅ Toggle active/inactive status manually
- ✅ Row Level Security (users can only access their own products)

### Image Upload
- Images are stored in the `product-images` bucket
- Organized by user ID for security
- Public URLs for easy display
- Supports JPG, PNG, WebP formats
- Drag-and-click interface with preview

## Usage

### Accessing the Catalog
1. Log in to your TuLink account
2. Navigate to `/dashboard/catalogo`
3. You'll be redirected to the Categories page by default
4. Use the navigation tabs to switch between Categories and Products

### Creating Categories
1. Click "Nueva Categoría"
2. Enter a name (required)
3. Optionally add a description
4. Click "Crear"

### Creating Products
1. Click "Nuevo Producto"
2. Upload a product image (optional but recommended)
3. Fill in product details:
   - Name (required)
   - Description (optional)
   - Price in RD$ (required)
   - Stock quantity (required)
   - Category (optional)
4. Click "Crear"

### Stock Management
- When you set stock to 0, the product is automatically marked as inactive
- You can still view and edit inactive products
- Inactive products show a "No disponible" badge
- You can manually reactivate products if you add stock

## Security

### Row Level Security (RLS)
All catalog data is protected by RLS policies:
- Users can only see their own categories and products
- All operations (CRUD) are restricted to the resource owner
- Image uploads are scoped to user ID folders

### Storage Security
- Only authenticated users can upload
- Users can only modify their own images
- Images are publicly viewable (necessary for product display)

## Troubleshooting

### Images Not Uploading
- Verify the `product-images` bucket exists and is public
- Check that storage policies are configured correctly
- Ensure your Supabase URL and anon key are correct in `.env.local`

### Products Not Appearing
- Check browser console for errors
- Verify RLS policies are active in Supabase
- Confirm the user is authenticated

### Stock Not Auto-Deactivating
- Verify the `check_product_stock()` trigger exists
- Check the trigger is attached to the products table
- Test by updating a product's stock to 0 in Supabase dashboard

## Next Steps
- Add bulk import/export functionality
- Implement product variants (size, color, etc.)
- Add product search and advanced filtering
- Create public catalog view for customers
- Integrate with WhatsApp ordering system
