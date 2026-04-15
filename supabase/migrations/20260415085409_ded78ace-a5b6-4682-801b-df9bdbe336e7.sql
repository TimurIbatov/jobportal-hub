
-- Admin can view all vacancies (including inactive)
CREATE POLICY "Admins can view all vacancies"
ON public.vacancies FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can delete applications  
CREATE POLICY "Admins can delete any application"
ON public.applications FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admin can manage user_roles
CREATE POLICY "Admins can insert user roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all user roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
