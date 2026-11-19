// Cloud backup settings (Supabase). See README → "Cloud backup setup".
// The anon / publishable key is safe to publish: Row Level Security in
// supabase/schema.sql makes sure each user can only read and write their own bills.
window.BILL_LEDGER_CONFIG = {
  supabaseUrl: '',      // e.g. 'https://abcdxyz.supabase.co'
  supabaseAnonKey: ''   // Project Settings → API Keys → anon / publishable key
};
