
-- Add verification fields to profiles
ALTER TABLE public.profiles 
ADD COLUMN is_verified boolean NOT NULL DEFAULT false,
ADD COLUMN verification_status text NOT NULL DEFAULT 'none',
ADD COLUMN verification_doc_url text;

-- verification_status: 'none' | 'pending' | 'approved' | 'rejected'

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public) VALUES ('verification-docs', 'verification-docs', false);

-- Storage policies: users upload their own docs
CREATE POLICY "Users can upload verification docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'verification-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own verification docs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'verification-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins can view all verification docs
CREATE POLICY "Admins can view all verification docs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'verification-docs' AND public.has_role(auth.uid(), 'admin'));

-- Admins can delete verification docs
CREATE POLICY "Admins can delete verification docs"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'verification-docs' AND public.has_role(auth.uid(), 'admin'));
