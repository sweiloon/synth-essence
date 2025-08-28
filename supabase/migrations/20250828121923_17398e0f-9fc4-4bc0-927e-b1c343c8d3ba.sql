-- Fix function search_path issues for avatar functions
CREATE OR REPLACE FUNCTION public.soft_delete_avatar(
  avatar_id_param UUID, 
  deletion_reason_param TEXT DEFAULT 'User requested deletion'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hard_delete_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate hard delete date (90 days from now)
  hard_delete_date := NOW() + INTERVAL '90 days';
  
  -- Soft delete the avatar
  UPDATE public.avatars 
  SET 
    status = 'deleted',
    deleted_at = NOW(),
    deleted_by = auth.uid(),
    deletion_reason = deletion_reason_param,
    scheduled_hard_delete_at = hard_delete_date,
    updated_at = NOW()
  WHERE id = avatar_id_param AND user_id = auth.uid() AND status = 'active';
  
  -- Soft delete all related knowledge files
  UPDATE public.avatar_knowledge_files 
  SET 
    status = 'deleted',
    deleted_at = NOW(),
    deleted_by = auth.uid(),
    deletion_reason = 'Parent avatar deleted',
    scheduled_hard_delete_at = hard_delete_date,
    updated_at = NOW()
  WHERE avatar_id = avatar_id_param AND user_id = auth.uid() AND status = 'active';
  
  -- Refresh the deleted avatars view
  PERFORM public.refresh_deleted_avatars_view();
END;
$$;

-- Fix restore avatar function
CREATE OR REPLACE FUNCTION public.restore_avatar(avatar_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Restore the avatar
  UPDATE public.avatars 
  SET 
    status = 'active',
    deleted_at = NULL,
    deleted_by = NULL,
    deletion_reason = NULL,
    scheduled_hard_delete_at = NULL,
    updated_at = NOW()
  WHERE id = avatar_id_param AND user_id = auth.uid() AND status = 'deleted';
  
  -- Restore all related knowledge files
  UPDATE public.avatar_knowledge_files 
  SET 
    status = 'active',
    deleted_at = NULL,
    deleted_by = NULL,
    deletion_reason = NULL,
    scheduled_hard_delete_at = NULL,
    updated_at = NOW()
  WHERE avatar_id = avatar_id_param AND user_id = auth.uid() AND status = 'deleted';
  
  -- Refresh the deleted avatars view
  PERFORM public.refresh_deleted_avatars_view();
END;
$$;