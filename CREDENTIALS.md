# GovTransparency - User Credentials

## System Users

### 🔐 ADMIN User
**Role**: System Administrator
- **Email**: `admin@govtransparency.in`
- **Password**: `admin@123`
- **Permissions**: Full system access, user management, all operations
- **Status**: ✅ Verified
- ⚠️ **IMPORTANT**: Change password after first login

### 👔 GOV_EMPLOYEE User
**Role**: Government Employee
- **Email**: `gov@test.com`
- **Password**: `password123`
- **Department**: Public Works
- **Permissions**: Create projects, add events, manage complaints
- **Status**: ✅ Verified

### 👤 Test User (if exists)
**Role**: Government Employee
- **Email**: `test@example.com`
- **Password**: `password123`
- **Permissions**: Create projects, add events
- **Status**: ✅ Verified

---

## Login Instructions

1. **Navigate to**: `http://localhost:5173/login`
2. **Enter credentials** from above
3. **Access dashboard** based on your role

---

## Role Permissions

### ADMIN
- ✅ View all projects
- ✅ Create/Edit/Delete projects
- ✅ Manage users
- ✅ Verify government employees
- ✅ View all complaints
- ✅ Access audit logs
- ✅ System configuration

### GOV_EMPLOYEE
- ✅ Create new projects
- ✅ Update project progress
- ✅ Add project events
- ✅ View all projects
- ✅ Respond to complaints
- ✅ Upload documents

### PUBLIC
- ✅ View public projects
- ✅ Submit complaints
- ✅ Track complaint status
- ❌ Cannot create projects
- ❌ Cannot modify projects

---

## Creating New Users

### Via Registration Page
1. Go to `http://localhost:5173/register`
2. Fill in details:
   - **Name**: Full name
   - **Email**: Valid email address
   - **Password**: Minimum 6 characters
   - **Department**: (Optional) If provided, user becomes GOV_EMPLOYEE

### Via API
```powershell
# Register GOV_EMPLOYEE
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
    department = "Public Works"
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:3001/auth/register' `
    -Method POST `
    -Headers @{'Content-Type'='application/json'} `
    -Body $body
```

---

## Security Notes

### Current Configuration (MVP/Demo)
- ✅ GOV_EMPLOYEE users are **auto-verified** on registration
- ✅ JWT tokens expire after **15 minutes**
- ✅ Passwords are hashed with **bcrypt**
- ⚠️ JWT_SECRET is set to a default value

### Production Recommendations
1. **Change JWT_SECRET** to a strong random value
2. **Disable auto-verification** - require admin approval
3. **Implement email verification**
4. **Add refresh tokens** for better UX
5. **Enable MFA** for admin accounts
6. **Implement password reset** functionality
7. **Add rate limiting** on auth endpoints
8. **Use HTTPS** in production

---

## Testing Credentials

All test credentials use simple passwords for development convenience:
- Default password pattern: `password123` or `admin@123`
- All users are pre-verified
- No email verification required

**Remember**: These are for development/testing only. Use proper security measures in production!

---

## Quick Reference

| Role | Email | Password | Can Create Projects |
|------|-------|----------|-------------------|
| ADMIN | admin@govtransparency.in | admin@123 | ✅ Yes |
| GOV_EMPLOYEE | gov@test.com | password123 | ✅ Yes |
| PUBLIC | (register new) | (your choice) | ❌ No |

---

## Scripts Available

- **Create Admin**: `cd server; npx tsx src/scripts/create-admin.ts`
- **Verify Users**: `cd server; npx tsx src/scripts/verify-users.ts`
- **Test API**: `.\test-login.ps1`

---

*Last Updated: 2026-01-28*
