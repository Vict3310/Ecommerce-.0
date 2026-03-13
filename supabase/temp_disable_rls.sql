-- TEMPORARILY allow anyone to insert products for seeding
-- RUN THIS, then run the seeding script, then RUN THE REVERT SECTION BELOW
alter table public.products disable row level security;
alter table public.categories disable row level security;

/* 
  AFTER RUNNING THE SEEDING SCRIPT, UNCOMMENT AND RUN THIS:
  
  alter table public.products enable row level security;
  alter table public.categories enable row level security;
*/
