-- Enable Realtime for study rooms (messages and optionally members)
alter publication supabase_realtime add table public.room_messages;
alter publication supabase_realtime add table public.room_members;
