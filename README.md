# Electrium Mobility Shop

Repository for the Electrium Shop project.

_Kanban board_: Visit the Kanban board for Electrium Shop on [Clickup](https://app.clickup.com/9003010024/v/li/901104924034)

# Setup

## Prerequisites

Install everything in this list before moving on to the next step!
Required:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/package-manager)
- [VS Code](https://code.visualstudio.com/download)
- [GitHub Desktop](https://desktop.github.com/download/) Note: This is the recommended tool for pushing your commit on GitHub.

**BONUS**: Have you ever considered signing up for the [GitHub Developer Pack](https://education.github.com/pack)? Check it out here!

## Setting up your local environment

1. Clone the repository on your IDE:

```
git clone https://github.com/Electrium-Mobility/Electrium-store.git
```

2. Download the `.env` file from our Discord server's `config-and-credentials` channel under webdev and place it into the root folder of your repo

3. Run the following commands in your IDE:

```
npm i
```

(i is a shortcut for install)

```
npm run build
```

```
npm run start
```

Electrium Shop should now be running on [localhost:3000](http://localhost:3000/).

## Environment Variables

The application requires the following environment variables to be set in your `.env.local` file:

### Required for Local Development:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `STRIPE_SECRET_KEY` - Your Stripe secret key (server-side only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `RESEND_API_KEY` - Your Resend API key for sending emails

### For Production Deployment:

When deploying to platforms like Netlify, Vercel, or Railway, you'll need to add these same environment variables to your deployment platform's settings.

**Note**: The code is designed to handle missing environment variables gracefully during build time, so the application will compile successfully even without these variables, but features like payments and emails won't work until the variables are properly configured.

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
