-- ========================================
-- CONFIGURACIÓN DE RLS PARA TABLA MESSAGES
-- ========================================
-- Ejecuta estos comandos en el SQL Editor de Supabase

-- 1. Crear la tabla messages si no existe
CREATE TABLE IF NOT EXISTS public.messages (
    id BIGSERIAL PRIMARY KEY,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS en la tabla
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 3. Crear política para permitir INSERT a usuarios anónimos
-- Esta política permite que cualquier usuario anónimo pueda insertar mensajes
CREATE POLICY "Allow anonymous users to insert messages" 
ON public.messages 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 4. Crear política para permitir SELECT solo a usuarios autenticados (opcional)
-- Solo si quieres que solo usuarios autenticados puedan leer los mensajes
CREATE POLICY "Allow authenticated users to read messages" 
ON public.messages 
FOR SELECT 
TO authenticated 
USING (true);

-- 5. Si quieres que cualquier usuario pueda leer los mensajes (menos seguro)
-- Descomenta la siguiente línea:
-- CREATE POLICY "Allow anyone to read messages" ON public.messages FOR SELECT USING (true);

-- ========================================
-- VERIFICACIÓN
-- ========================================
-- Para verificar que las políticas están activas:
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'messages';

-- Para ver la estructura de la tabla:
\d public.messages;

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================
-- 1. Las políticas RLS se aplican automáticamente a todas las consultas
-- 2. Si usas SUPABASE_SERVICE_ROLE_KEY, las políticas RLS se saltan
-- 3. Si usas SUPABASE_ANON_KEY, las políticas RLS se aplican
-- 4. Asegúrate de que tu tabla tenga exactamente estos campos:
--    - id (BIGSERIAL PRIMARY KEY)
--    - user_name (TEXT)
--    - user_email (TEXT) 
--    - message (TEXT)
--    - created_at (TIMESTAMPTZ)
