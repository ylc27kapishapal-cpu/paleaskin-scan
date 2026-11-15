CREATE TABLE public.skin_scan_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  whatsapp_phone text NOT NULL,
  analysis jsonb NOT NULL,
  whatsapp_consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.skin_scan_reports TO anon, authenticated;
GRANT ALL ON public.skin_scan_reports TO service_role;
ALTER TABLE public.skin_scan_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a consented skin scan report"
  ON public.skin_scan_reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(email)) > 0
    AND length(trim(whatsapp_phone)) > 0
    AND whatsapp_consent = true
    AND jsonb_typeof(analysis) = 'object'
  );