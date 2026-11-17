-- ====================================================================
-- SUPABASE OPTIMIZATION MIGRATION
-- Åtgärdar Auth RLS Initialization Plan, search_path och Storage Caching
-- Kör detta skript i Supabase SQL Editor för ditt projekt (portal)
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. FIX AUTH RLS INITIALIZATION PLAN PÅ TRANSACTIONS & BUDGETS
-- Genom att ersätta auth.uid() med (SELECT auth.uid()) utvärderas funktionen
-- en enda gång som en skalär subquery per fråga istället för en gång per rad.
-- --------------------------------------------------------------------

-- public.transactions
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'transactions') THEN
    ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
    
    -- Rensa gamla policies om de finns
    DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
    DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
    DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
    DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;
    DROP POLICY IF EXISTS "transactions_select_policy" ON public.transactions;
    DROP POLICY IF EXISTS "transactions_insert_policy" ON public.transactions;
    DROP POLICY IF EXISTS "transactions_update_policy" ON public.transactions;
    DROP POLICY IF EXISTS "transactions_delete_policy" ON public.transactions;
    DROP POLICY IF EXISTS "transactions_user_all" ON public.transactions;

    -- Skapa optimerade RLS policies med (SELECT auth.uid())
    CREATE POLICY "transactions_select_policy" ON public.transactions
      FOR SELECT USING (user_id = (SELECT auth.uid()));

    CREATE POLICY "transactions_insert_policy" ON public.transactions
      FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

    CREATE POLICY "transactions_update_policy" ON public.transactions
      FOR UPDATE USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

    CREATE POLICY "transactions_delete_policy" ON public.transactions
      FOR DELETE USING (user_id = (SELECT auth.uid()));

    -- Skapa index på user_id om det saknas för blixtsnabb RLS-filtrering
    CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
  END IF;
END $$;

-- public.budgets
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'budgets') THEN
    ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
    
    DROP POLICY IF EXISTS "Users can view own budgets" ON public.budgets;
    DROP POLICY IF EXISTS "Users can insert own budgets" ON public.budgets;
    DROP POLICY IF EXISTS "Users can update own budgets" ON public.budgets;
    DROP POLICY IF EXISTS "Users can delete own budgets" ON public.budgets;
    DROP POLICY IF EXISTS "budgets_select_policy" ON public.budgets;
    DROP POLICY IF EXISTS "budgets_insert_policy" ON public.budgets;
    DROP POLICY IF EXISTS "budgets_update_policy" ON public.budgets;
    DROP POLICY IF EXISTS "budgets_delete_policy" ON public.budgets;
    DROP POLICY IF EXISTS "budgets_user_all" ON public.budgets;

    CREATE POLICY "budgets_select_policy" ON public.budgets
      FOR SELECT USING (user_id = (SELECT auth.uid()));

    CREATE POLICY "budgets_insert_policy" ON public.budgets
      FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

    CREATE POLICY "budgets_update_policy" ON public.budgets
      FOR UPDATE USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

    CREATE POLICY "budgets_delete_policy" ON public.budgets
      FOR DELETE USING (user_id = (SELECT auth.uid()));

    CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets(user_id);
  END IF;
END $$;

-- --------------------------------------------------------------------
-- 2. FIX IMMUTABLE SEARCH_PATH PÅ DATABASFUNKTIONER (SECURITY ADVISOR)
-- Sätter explicit search_path = '' på alla funktioner i public-schemat
-- för att förhindra sökvägskapning (search_path hijacking).
-- --------------------------------------------------------------------
DO $$
DECLARE
  func RECORD;
BEGIN
  FOR func IN
    SELECT p.proname, pg_catalog.pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
  LOOP
    EXECUTE format('ALTER FUNCTION public.%I(%s) SET search_path = '''';', func.proname, func.args);
  END LOOP;
END $$;

-- --------------------------------------------------------------------
-- 3. INDEXERING PÅ PORTALENS HUVUDTABELLER FÖR LÄGRE DATABASBELASTNING
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_categories_created_at ON public.categories(created_at);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON public.links(created_at);
CREATE INDEX IF NOT EXISTS idx_guides_created_at ON public.guides(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at);
