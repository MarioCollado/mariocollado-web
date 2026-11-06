-- create_schema.sql
-- SQL para crear la estructura mínima que usa el proyecto
-- Ejecutar en Supabase → SQL Editor

-- 1) Crear el esquema (opcional, usa public por defecto)
-- CREATE SCHEMA IF NOT EXISTS public;

-- 2) Tabla messages
CREATE TABLE IF NOT EXISTS public.messages (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_name text NOT NULL,
  user_email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Índices recomendados
CREATE INDEX IF NOT EXISTS idx_messages_user_email ON public.messages (user_email);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages (created_at DESC);

-- 4) (Opcional) Habilitar RLS y política para permitir inserciones desde anon (si NO usas service role)
-- ATENCION: esta policy permite INSERTs sin autenticación. Úsala solo si confías en controles client-side o rate limiting.
-- ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY allow_anon_inserts ON public.messages
--   FOR INSERT
--   USING (true)
--   WITH CHECK (true);

-- 5) (Opcional) Política más segura que valida longitud del mensaje y formato de email
-- CREATE FUNCTION public.is_valid_email(email text) RETURNS boolean LANGUAGE sql IMMUTABLE AS $$
--   SELECT email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$';
-- $$;
-- CREATE POLICY allow_valid_inserts ON public.messages
--   FOR INSERT
--   USING (true)
--   WITH CHECK (
--     char_length(message) > 0
--     AND char_length(message) <= 5000
--     AND public.is_valid_email(user_email)
--     AND char_length(user_name) > 0
--   );

-- 6) (Opcional) Grant permissions if using service role for server-side only
-- REVOKE ALL ON TABLE public.messages FROM public;
-- GRANT SELECT, INSERT ON public.messages TO authenticated;
-- GRANT ALL PRIVILEGES ON TABLE public.messages TO postgres; -- o al rol administrador del proyecto

-- 7) Ejemplo de insert (para pruebas)
-- INSERT INTO public.messages (user_name, user_email, message) VALUES ('Prueba', 'prueba@example.com', 'Mensaje de prueba');

-- FIN
