-- create_db.sql
-- SQL para crear la tabla `messages` y políticas mínimas necesarias
-- Ejecutar en Supabase -> SQL Editor -> New query

-- 1) Crear la tabla `messages`
CREATE TABLE IF NOT EXISTS public.messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Índice por email para búsquedas (opcional)
CREATE INDEX IF NOT EXISTS idx_messages_user_email ON public.messages (user_email);

-- 3) (Opcional) Habilitar RLS y política básica para permitir INSERT desde ANON
-- Si usas solo `SERVICE_ROLE` desde server-side puedes saltarte RLS.
-- Asegúrate de entender las implicaciones de seguridad antes de permitir inserts desde ANON.

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy que permite INSERTs sin autenticación (solo si confías en el frontend)
-- Esta policy permite insertar cualquier fila; si la usas, considera agregar checks
-- para limitar tamaño del mensaje, validar email, o rate-limit desde frontend.
CREATE POLICY IF NOT EXISTS allow_anon_inserts ON public.messages
  FOR INSERT
  USING (true)
  WITH CHECK (true);

-- 4) (Opcional) Ejemplo de policy más restrictiva para permitir solo inserts
-- donde el campo `user_email` tenga formato básico (regex)
-- Esta policy no sustituye validaciones de aplicación pero añade una capa.
--
-- CREATE POLICY IF NOT EXISTS allow_basic_email_insert ON public.messages
--   FOR INSERT
--   USING (true)
--   WITH CHECK (user_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- 5) (Opcional) Revoke permisos públicos si prefieres controlar todo con Service Role
-- REVOKE ALL ON TABLE public.messages FROM public;

-- Fin
