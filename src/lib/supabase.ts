import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://ghgtqxwvtaofcgemwpnz.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVjMTVjYjM2LTNiNmYtNGQyNy1hMjg3LWQ5NzVkNjFmZWIwYiJ9.eyJwcm9qZWN0SWQiOiJnaGd0cXh3dnRhb2ZjZ2Vtd3BueiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwNjA5MDQ5LCJleHAiOjIwOTU5NjkwNDksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.DiHNB34Q9mxrBpr0COWh1w5ppiEtQjraornJDso5nKI';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };