-- Jadikan produk lama aktif bila NULL
UPDATE "Product" SET "isActive" = TRUE WHERE "isActive" IS NULL;

-- Pastikan featured default false bila NULL
UPDATE "Product" SET "featured" = FALSE WHERE "featured" IS NULL;

-- Optional: kalau mau featuredOrder jadi besar (di akhir) bila NULL
UPDATE "Product" SET "featuredOrder" = 9999 WHERE "featured" = TRUE AND "featuredOrder" IS NULL;
