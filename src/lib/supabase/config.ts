/**
 * Supabase Integration Bridge for Suarantara
 * 
 * Suarantara uses Prisma ORM connected to Supabase PostgreSQL for:
 * 1. NextAuth v5 User Accounts & RBAC (Redaksi, Advokat, Peneliti, Mahasiswa)
 * 2. Advocacy Case Tracker & Sensitive Case Chronology
 * 3. Encrypted Whistleblower Vault (Anti-Doxing & Safe Reporting)
 * 4. Policy Briefs, Indicators, Research Papers
 * 5. Student Voice / Kotak Aspirasi tickets
 * 
 * Connection Setup:
 * In .env or production environment:
 * DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
 * DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
 */

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  isConfigured: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  ),
}

export function getDatabaseProvider(): 'sqlite' | 'postgresql' {
  const url = process.env.DATABASE_URL || ''
  if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
    return 'postgresql'
  }
  return 'sqlite'
}
