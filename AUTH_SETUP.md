# TuLink Authentication Setup Guide

This guide will walk you through setting up Supabase Authentication for TuLink.

## 📋 Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created

## 🔧 Setup Steps

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Project Settings** → **API**
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### Step 2: Configure Environment Variables

1. Create a `.env.local` file in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the values in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### Step 3: Run the Database Setup Script

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste the entire content of `supabase/setup.sql`
5. Click **Run** to execute the script

This script will:
- Create the `profiles` table
- Set up Row Level Security (RLS) policies
- Create triggers for automatic `updated_at` updates
- Create helper functions

### Step 4: Configure Authentication Settings

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** provider (it should be enabled by default)
3. Configure email settings:
   - Go to **Authentication** → **Email Templates**
   - Customize the confirmation email if desired

### Step 5: Set Up Email Confirmation (Optional)

By default, Supabase requires email confirmation. To disable this for development:

1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. Toggle **off** "Enable email confirmations" (for development only)
4. For production, keep it enabled and configure your email templates

### Step 6: Test the Authentication Flow

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test the registration flow:
   - Click "Comenzar prueba gratis" on the landing page
   - Fill in your name, email, and password
   - Submit the form
   - You should be redirected to `/dashboard`

3. Test the login flow:
   - Go to `/login`
   - Enter your credentials
   - You should be redirected to `/dashboard`

## 📁 File Structure

```
tulink/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── middleware.ts      # Middleware client
│   └── auth/
│       ├── auth.ts            # Auth utility functions
│       └── AuthContext.tsx    # React context provider
├── app/
│   ├── registro/
│   │   └── page.tsx           # Registration page
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── dashboard/
│   │   └── page.tsx           # Protected dashboard
│   ├── layout.tsx             # Root layout with AuthProvider
│   └── page.tsx               # Landing page
├── middleware.ts               # Route protection middleware
├── types/
│   └── database.types.ts      # TypeScript types
└── supabase/
    └── setup.sql              # Database setup script
```

## 🔐 Authentication Flow

### Registration Flow
1. User clicks "Comenzar prueba gratis" on landing page
2. User is taken to `/registro`
3. User fills in name, email, and password
4. Form validates inputs in real-time
5. On submit, creates user in Supabase Auth
6. Creates profile with 30-day trial period
7. Redirects to `/dashboard`

### Login Flow
1. User goes to `/login`
2. User enters email and password
3. Form validates inputs
4. On submit, authenticates with Supabase
5. Redirects to `/dashboard`

### Route Protection
- `/dashboard` requires authentication
- `/login` and `/registro` redirect to dashboard if already logged in
- Middleware handles server-side route protection

## 🛡️ Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Password validation**: Minimum 6 characters
- **Session management**: Automatic session refresh
- **Cookie-based auth**: Secure HTTP-only cookies
- **Trial tracking**: Automatic 30-day trial period tracking

## 📊 Database Schema

### profiles table
```sql
id                  UUID (primary key, references auth.users)
name                TEXT (user's business name)
email               TEXT (user's email)
trial_start_date    TIMESTAMP (when trial started)
trial_end_date      TIMESTAMP (30 days from start)
created_at          TIMESTAMP (auto-set)
updated_at          TIMESTAMP (auto-updated)
```

## 🚀 Next Steps

After authentication is working, you can:

1. **Add OAuth providers** (Google, GitHub, etc.)
2. **Implement password reset** functionality
3. **Add email verification** for production
4. **Create subscription management** for after trial ends
5. **Add user profile editing**
6. **Implement analytics** tracking

## 🐛 Troubleshooting

### "Invalid API key" error
- Double-check your `.env.local` values
- Make sure you're using the `anon` key, not the `service_role` key
- Restart your dev server after changing env variables

### "Email already exists" error
- This means the email is already registered
- Try logging in instead or use the password reset feature

### Profile not being created
- Check the Supabase logs for any errors
- Verify the database setup script ran successfully
- Check RLS policies are correctly configured

### Redirect loops
- Clear your browser cookies
- Check middleware configuration in `middleware.ts`

## 📝 Important Notes

1. **Never commit `.env.local`** - It's in `.gitignore` for security
2. **Enable email confirmation in production** - Don't skip email verification
3. **Use HTTPS in production** - Required for secure cookies
4. **Monitor trial expirations** - Set up notifications before trial ends

## 🔗 Useful Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js App Router Auth](https://nextjs.org/docs/app/building-your-application/authentication)
- [@supabase/ssr Package](https://supabase.com/docs/guides/auth/server-side/nextjs)

---

**Need help?** Check the Supabase dashboard logs and Next.js console output for error messages.
