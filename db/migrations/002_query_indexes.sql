BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_nursing_licensees_name_cursor
    ON public.nursing_licensees (last_name, first_name, license_number, id);

CREATE INDEX IF NOT EXISTS idx_nursing_licensees_license_cursor
    ON public.nursing_licensees (license_number, id);

CREATE INDEX IF NOT EXISTS idx_nursing_licensees_first_name_trgm
    ON public.nursing_licensees USING gin (first_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_nursing_licensees_last_name_trgm
    ON public.nursing_licensees USING gin (last_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_nursing_licensees_name_raw_trgm
    ON public.nursing_licensees USING gin (name_raw gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_nursing_licensees_license_number_trgm
    ON public.nursing_licensees USING gin (license_number gin_trgm_ops);

COMMIT;
