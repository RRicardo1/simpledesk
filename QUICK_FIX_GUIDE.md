# 🚨 QUICK FIX: Site Can't Be Reached

## 🔧 IMMEDIATE SOLUTIONS

### **Solution 1: Manual Server Start (RECOMMENDED)**

**Step 1: Start Backend Server**
```bash
# Open Terminal 1
cd "/Users/RRicardo/Desktop/mysimpledesk/simpledesk/backend"

# Kill any existing processes
pkill -f node
pkill -f npm

# Install dependencies if needed
npm install

# Start backend
node server.js
```

**Expected Output:**
```
SimpleDesk server running on port 3001
🤖 AI Support initialized: Rule-based
Connected to PostgreSQL database
```

**Step 2: Start Frontend Server**
```bash
# Open Terminal 2 (NEW WINDOW)
cd "/Users/RRicardo/Desktop/mysimpledesk/simpledesk/frontend"

# Install dependencies if needed
npm install

# Build if needed
npm run build

# Start frontend
npx serve -s build -l 3000
```

**Expected Output:**
```
Local:            http://localhost:3000
```

### **Solution 2: Database Fix (If backend fails)**

If backend shows database errors:

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if stopped
brew services start postgresql

# Create database if it doesn't exist
createdb simpledesk

# Test connection
psql -d simpledesk -c "SELECT NOW();"
```

### **Solution 3: Port Conflict Fix**

If ports are in use:

```bash
# Kill processes on port 3001
lsof -ti:3001 | xargs kill -9

# Kill processes on port 3000  
lsof -ti:3000 | xargs kill -9

# Wait 5 seconds, then restart servers
```

### **Solution 4: Node.js Fix**

If Node.js is not working:

```bash
# Check Node version
node --version

# If not installed, install via Homebrew
brew install node

# Or download from https://nodejs.org/
```

### **Solution 5: Emergency Static Server**

If all else fails, serve frontend statically:

```bash
cd "/Users/RRicardo/Desktop/mysimpledesk/simpledesk/frontend/build"
python3 -m http.server 3000
```

## ✅ VERIFICATION STEPS

After starting servers, test these URLs:

1. **Frontend**: http://localhost:3000
   - Should show MySimpleDesk homepage

2. **Backend Health**: http://localhost:3001/api/health
   - Should return JSON: `{"status":"healthy"}`

3. **AI Test**: http://localhost:3000/ai-test
   - Should show AI chat interface

## 🚨 COMMON ERRORS & FIXES

### Error: "EADDRINUSE: address already in use"
```bash
# Fix: Kill the process using the port
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Error: "Cannot find module"
```bash
# Fix: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Error: "Database connection failed"
```bash
# Fix: Start PostgreSQL and create database
brew services start postgresql
createdb simpledesk
```

### Error: "Command not found"
```bash
# Fix: Install missing tools
brew install node
brew install postgresql
```

## 📞 FINAL STEPS

1. **Run troubleshooting script:**
   ```bash
   cd "/Users/RRicardo/Desktop/mysimpledesk/simpledesk"
   chmod +x troubleshoot.sh
   ./troubleshoot.sh
   ```

2. **Use auto-start script:**
   ```bash
   chmod +x start-servers.sh
   ./start-servers.sh
   ```

3. **Manual verification:**
   - Open http://localhost:3000 in browser
   - Check console for any JavaScript errors
   - Test the "AI Demo" link

## 🎯 SUCCESS INDICATORS

When working correctly, you should see:

✅ **Homepage loads** with "5-minute setup" messaging  
✅ **AI Demo works** at `/ai-test`  
✅ **Navigation works** between pages  
✅ **Pricing buttons** lead to registration  
✅ **No console errors** in browser dev tools  

If you're still having issues, check the browser's developer console (F12) for specific error messages.

---

**Need help?** Check the detailed troubleshooting in `troubleshoot.sh` or the full documentation in `/docs/`