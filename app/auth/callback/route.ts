import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error_description = requestUrl.searchParams.get("error_description");
  const error = requestUrl.searchParams.get("error");
  const origin = requestUrl.origin;

  console.log("Callback received:", {
    code: code ? "present" : "missing",
    error,
    error_description,
    fullUrl: requestUrl.toString(),
  });

  // Handle OAuth errors
  if (error || error_description) {
    console.error("OAuth error:", { error, error_description });
    return NextResponse.redirect(
      `${origin}/?error=auth_failed&message=${encodeURIComponent(error_description || error || "Unknown error")}`
    );
  }

  if (!code) {
    console.error("No code provided in callback");
    return NextResponse.redirect(`${origin}/?error=auth_failed&message=no_code`);
  }

  try {
    const cookieStore = cookies();
    let response = NextResponse.redirect(`${origin}/home`);

    // Debug: Log all cookies
    const allCookies = cookieStore.getAll();
    console.log("=== Callback Start ===");
    console.log("All cookies in callback:", allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
    console.log("Looking for PKCE code_verifier cookie...");
    
    // Check for specific Supabase cookies
    const supabaseCookies = allCookies.filter(c => 
      c.name.includes('supabase') || 
      c.name.includes('code') || 
      c.name.includes('verifier') ||
      c.name.includes('pkce')
    );
    console.log("Supabase-related cookies:", supabaseCookies.map(c => c.name));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return cookieStore.get(name)?.value;
          },
          async set(
            name: string,
            value: string,
            options?: Parameters<typeof response.cookies.set>[2]
          ) {
            cookieStore.set(name, value, options);
            response.cookies.set(name, value, options);
          },
          async remove(
            name: string,
            options?: Parameters<typeof response.cookies.set>[2]
          ) {
            cookieStore.delete(name);
            response.cookies.delete(name);
          },
        },
      }
    );

    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (exchangeError) {
      console.error("Error exchanging code for session:", exchangeError);
      return NextResponse.redirect(
        `${origin}/?error=auth_failed&message=${encodeURIComponent(exchangeError.message)}`
      );
    }

    // Verify that we have a session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user after session exchange");
      return NextResponse.redirect(`${origin}/?error=auth_failed&message=no_user`);
    }

    console.log("Session exchange successful, redirecting to home");
    return response;
  } catch (err) {
    console.error("Unexpected error in callback:", err);
    return NextResponse.redirect(
      `${origin}/?error=auth_failed&message=${encodeURIComponent(err instanceof Error ? err.message : "Unexpected error")}`
    );
  }
}

