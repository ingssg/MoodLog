import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = cookies();

  return createServerClient(
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
          options?: Parameters<typeof cookieStore.set>[2]
        ) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Ignore - likely called from a Server Component where mutation isn't allowed
          }
        },
        async remove(name: string) {
          try {
            cookieStore.delete(name);
          } catch {
            // Ignore for Server Components
          }
        },
      },
    }
  );
}
