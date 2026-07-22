-- Public talent submissions create a linked prequalification result in the same browser flow.
-- Keep this insert-only policy explicit so anonymous applicants can save the gate outcome
-- while reads remain admin-only.
DROP POLICY IF EXISTS "Anyone can insert prequalification results" ON public.prequalification_results;
DROP POLICY IF EXISTS "Public can insert prequalification results" ON public.prequalification_results;

CREATE POLICY "Public can insert prequalification results"
ON public.prequalification_results
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
