export const prerender = false;

// src/pages/api/save-message.js
import { createClient } from "@supabase/supabase-js";

export async function POST({ request }) {
  try {
    // Obtener datos del request
    const { userName, userEmail, message } = await request.json();

    // Validaciones
    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "El mensaje es requerido.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!userEmail || userEmail.trim().length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "El email es requerido.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!userName || userName.trim().length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "El nombre es requerido.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail.trim())) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Formato de email inválido.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validar variables de entorno
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Variables de Supabase no configuradas");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Error de configuración del servidor.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Usar Service Role Key si está disponible, sino usar ANON KEY
    const supabaseKey = supabaseServiceKey || supabaseAnonKey;
    console.log("Usando clave:", supabaseServiceKey ? "SERVICE_ROLE" : "ANON");

    // Inicializar cliente de Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Preparar datos para insertar
    const messageData = {
      user_name: userName.trim(),
      user_email: userEmail.trim().toLowerCase(),
      message: message.trim(),
      created_at: new Date().toISOString(),
    };

    console.log(
      "Intentando guardar mensaje en Supabase:",
      messageData.user_email
    );

    // Guardar en Supabase
    const { data, error: dbError } = await supabase
      .from("messages")
      .insert([messageData])
      .select("id, created_at");

    if (dbError) {
      console.error("Error de Supabase:", dbError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Error guardando el mensaje en la base de datos.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Mensaje guardado exitosamente:", data[0]?.id);

    // Enviar email usando una API externa (opcional)
    let emailSent = false;
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const yourEmail = import.meta.env.YOUR_EMAIL;

    if (resendApiKey && yourEmail) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "onboarding@resend.dev", // Cambiar por tu dominio verificado
            to: yourEmail,
            subject: `Nuevo mensaje de ${userName.trim()} - Mario Collado Web`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #ec4899; border-bottom: 2px solid #06b6d4; padding-bottom: 10px;">
                  Nuevo mensaje desde tu web
                </h2>
                
                <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>👤 Nombre:</strong> ${userName.trim()}</p>
                  <p><strong>📧 Email:</strong> ${userEmail.trim()}</p>
                  <p><strong>📅 Fecha:</strong> ${new Date().toLocaleString(
                    "es-ES",
                    {
                      timeZone: "Europe/Madrid",
                    }
                  )}</p>
                </div>
                
                <div style="background: white; border-left: 4px solid #ec4899; padding: 20px; margin: 20px 0;">
                  <h3 style="color: #374151; margin-top: 0;">💬 Mensaje:</h3>
                  <p style="line-height: 1.6; color: #4b5563;">${message
                    .trim()
                    .replace(/\n/g, "<br>")}</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
                  <p style="color: #6b7280; margin: 0;">
                    Responde directamente a este email para contactar con ${userName.trim()}
                  </p>
                </div>
              </div>
            `,
            reply_to: userEmail.trim(),
          }),
        });

        if (emailResponse.ok) {
          emailSent = true;
          console.log("Email enviado exitosamente");
        } else {
          console.error("Error enviando email:", await emailResponse.text());
        }
      } catch (emailErr) {
        console.error("Error en el proceso de email:", emailErr);
      }
    } else {
      console.log("Configuración de email no disponible, saltando envío");
    }

    // Respuesta exitosa
    return new Response(
      JSON.stringify({
        success: true,
        message: "Mensaje enviado exitosamente",
        data: {
          id: data[0]?.id,
          timestamp: data[0]?.created_at,
          emailSent,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error general en la API:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error interno del servidor. Inténtalo de nuevo más tarde.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Para manejar preflight requests de CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
