-- Insert categories
INSERT INTO categories (id, name, slug, description)
VALUES
  (uuid_generate_v4(), 'T-Shirts', 'tshirts', NULL),
  (uuid_generate_v4(), 'New In', 'new', NULL),
  (uuid_generate_v4(), 'Featured', 'featured', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Insert Big Boxy Bear products (category_id = T-Shirts)
INSERT INTO products (name, description, price, images, category_id, featured, in_stock)
SELECT
  p.name,
  'Premium boxy fit tee. Heavyweight cotton/polyester blend, relaxed cut. Part of the Big Boxy Bear range — wear it when you''re ready to be seen.',
  599.00,
  ARRAY['https://placehold.co/600x600/e5e5e5/737373?text=Big+Boxy+Bear']::text[],
  c.id,
  true,
  true
FROM categories c
CROSS JOIN (
  VALUES
    ('Big Boxy Bear T-shirt — Black'),
    ('Big Boxy Bear T-shirt — Grey'),
    ('Big Boxy Bear T-shirt — Beige'),
    ('Big Boxy Bear T-shirt — Green')
) AS p(name)
WHERE c.slug = 'tshirts';

-- Use real images for the Big Boxy Bear Black tee instead of placeholders
UPDATE products
SET images = ARRAY['/left.png','/middle.jpeg','/right.jpeg']::text[]
WHERE name = 'Big Boxy Bear T-shirt — Black';