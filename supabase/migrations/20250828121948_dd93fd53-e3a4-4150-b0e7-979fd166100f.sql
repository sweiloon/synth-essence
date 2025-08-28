-- Fix remaining functions to have proper search_path
CREATE OR REPLACE FUNCTION public.refresh_deleted_avatars_view()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Clear the table
  DELETE FROM public.deleted_avatars;
  
  -- Populate with current deleted avatars
  INSERT INTO public.deleted_avatars (
    id, user_id, name, deleted_at, deleted_by, 
    deletion_reason, scheduled_hard_delete_at, days_until_hard_delete
  )
  SELECT 
    id,
    user_id,
    name,
    deleted_at,
    deleted_by,
    deletion_reason,
    scheduled_hard_delete_at,
    EXTRACT(DAYS FROM (scheduled_hard_delete_at - NOW())) AS days_until_hard_delete
  FROM public.avatars 
  WHERE status = 'deleted'
  ORDER BY deleted_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_hard_delete_avatars()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Hard delete knowledge files that are past their scheduled deletion date
  DELETE FROM public.avatar_knowledge_files 
  WHERE status = 'deleted' AND scheduled_hard_delete_at <= NOW();
  
  -- Hard delete avatars that are past their scheduled deletion date
  DELETE FROM public.avatars 
  WHERE status = 'deleted' AND scheduled_hard_delete_at <= NOW();
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    code TEXT;
    exists_check INTEGER;
BEGIN
    LOOP
        -- Generate a 8-character alphanumeric code
        code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
        
        -- Check if code already exists
        SELECT COUNT(*) INTO exists_check FROM public.profiles WHERE referral_code = code;
        
        -- If code doesn't exist, break the loop
        IF exists_check = 0 THEN
            EXIT;
        END IF;
    END LOOP;
    
    RETURN code;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, referral_code, referrer_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, ''),
    generate_referral_code(),
    NEW.raw_user_meta_data->>'referrer_code'
  );
  RETURN NEW;
END;
$$;