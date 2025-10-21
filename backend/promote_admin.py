"""
Script to promote a user to admin role
"""
import sqlite3
import os

# Database path - handle both running from backend/ and from project root
if os.path.exists('ecommerce.db'):
    DB_PATH = 'ecommerce.db'
elif os.path.exists('backend/ecommerce.db'):
    DB_PATH = 'backend/ecommerce.db'
else:
    DB_PATH = 'ecommerce.db'  # Will fail with helpful error message

def promote_user_to_admin(email: str):
    """Promote a user to admin by email"""
    try:
        # Connect to database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id, email, role FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        
        if not user:
            print(f"❌ User with email '{email}' not found.")
            return
        
        user_id, user_email, current_role = user
        
        if current_role == 'admin':
            print(f"✅ User '{email}' is already an admin!")
            return
        
        # Update user role to admin
        cursor.execute("UPDATE users SET role = 'admin' WHERE email = ?", (email,))
        conn.commit()
        
        print(f"✅ SUCCESS! User '{email}' (ID: {user_id}) promoted to admin!")
        print(f"   Previous role: {current_role}")
        print(f"   New role: admin")
        print(f"\n🎉 Refresh your browser and you'll see the Admin menu!")
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
    finally:
        conn.close()

def list_all_users():
    """List all users in the database"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, email, first_name, last_name, role FROM users")
        users = cursor.fetchall()
        
        if not users:
            print("No users found in database.")
            return
        
        print("\n📋 All Users:")
        print("-" * 80)
        print(f"{'ID':<5} {'Email':<30} {'Name':<25} {'Role':<10}")
        print("-" * 80)
        
        for user_id, email, first_name, last_name, role in users:
            full_name = f"{first_name} {last_name}"
            print(f"{user_id:<5} {email:<30} {full_name:<25} {role:<10}")
        
        print("-" * 80)
        
    except sqlite3.Error as e:
        print(f"❌ Database error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    print("🛡️  User Admin Promotion Tool")
    print("=" * 80)
    
    # Check if database exists
    if not os.path.exists(DB_PATH):
        print(f"\n❌ ERROR: Database not found at '{DB_PATH}'")
        print("\n💡 Make sure:")
        print("   1. The backend server has been run at least once (to create the database)")
        print("   2. You're running this script from the correct directory")
        print("\n🚀 To create the database, run the backend server:")
        print("   cd backend")
        print("   python -m uvicorn main:app --reload")
        print("\n   Then stop it (Ctrl+C) and run this script again.")
        exit(1)
    
    print(f"📂 Database found: {DB_PATH}")
    
    # List all users first
    list_all_users()
    
    # Prompt for email
    print("\n")
    email = input("Enter email of user to promote to admin: ").strip()
    
    if not email:
        print("❌ No email provided. Exiting.")
    else:
        promote_user_to_admin(email)

