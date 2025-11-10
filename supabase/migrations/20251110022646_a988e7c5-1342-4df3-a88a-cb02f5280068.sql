-- Add new columns to products table for detailed item formatting
ALTER TABLE products
ADD COLUMN IF NOT EXISTS base TEXT,
ADD COLUMN IF NOT EXISTS meio_a_meio TEXT,
ADD COLUMN IF NOT EXISTS frutas TEXT,
ADD COLUMN IF NOT EXISTS mix_ins TEXT,
ADD COLUMN IF NOT EXISTS toppings TEXT;