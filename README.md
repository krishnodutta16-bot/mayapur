# মায়াপুর

A private couple memory app — shared timeline, photo gallery, and anniversary reminders. Only two allowed emails can sign in.

The night-sky look comes from the Mayapur design (Bengali-first, glass panels, moon and petals).

## Setup

1. Copy `.env.example` to `.env`
2. Set **your two emails** and passwords:
   - `ALLOWED_EMAIL_1` / `ALLOWED_EMAIL_2`
   - `PARTNER_1_PASSWORD` / `PARTNER_2_PASSWORD`
   - `SESSION_SECRET` (32+ random characters)
3. Install and seed:

```sh
npm install
npx prisma db push
npx prisma db seed
npm run dev
```

Open http://localhost:3000 and sign in with one of the two emails.

Anyone else is refused at the gate. Photos are stored on disk (`uploads/`) and served only after login. Notes cannot be deleted. Search engines are blocked via `robots.txt` and `noindex`.
