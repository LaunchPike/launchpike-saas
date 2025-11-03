# Admin User Setup

To automatically create an admin user when starting the project, add the following environment variables to your `.env.server` file:

## Setup

1. Open the `.env.server` file (or create it if it doesn't exist)

2. Add the following lines:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password-here
```

**Important:** 
- Replace `admin@example.com` with your email
- Replace `your-secure-password-here` with your desired password
- Use a strong password for production environment!

## Usage

After adding the environment variables:

1. **On first project start:**
   ```bash
   # If you need to create/update migrations
   wasp db migrate-dev
   
   # Create admin user (run once or when needed)
   wasp db seed
   ```

2. **Run the project:**
   ```bash
   wasp start
   ```

**Note:** `wasp db seed` needs to be run once after setting up the environment variables, or whenever you need to update/create the admin user.

The `seedAdminUser` function automatically:
- ✅ Creates a new admin user if one doesn't exist
- ✅ Updates existing user, setting admin privileges and updating password
- ✅ Automatically verifies email (isEmailVerified: true)
- ✅ Skips creation if variables are not set

**Tip:** If you want the admin to be created automatically on every start, you can create a simple script or add `wasp db seed` to your project startup process.

## Logging In

After starting the project and running seed:

1. Open `/login`
2. Enter your `ADMIN_EMAIL` in the email field
3. Enter your `ADMIN_PASSWORD` in the password field
4. Click "Log in"

You will immediately get access to the admin panel!

## Logs

When running `wasp db seed` or `wasp start`, you will see in the console:

```
🔐 Creating/updating admin user: admin@example.com
✅ Admin user created: admin@example.com
🔑 Email: admin@example.com
🔑 Password: your-password (use this to log in)
```

## Additional

### Multiple Admins

You can also add multiple admins via `ADMIN_EMAILS` (comma-separated):

```env
ADMIN_EMAILS=admin1@example.com,admin2@example.com,admin3@example.com
ADMIN_EMAIL=admin@example.com  # Main admin (created automatically)
```

Users from `ADMIN_EMAILS` will receive admin privileges when registering via signup.

### Disabling Automatic Creation

If you don't want to automatically create an admin user, simply don't set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.server`. The function will skip admin creation.
