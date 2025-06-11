import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Ensure database connection is established before any operations
    await dbConnect();
    
    const { name, email, password } = await request.json();

    // Input validation
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ 
        error: 'All fields are required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (password.length < 6) {
      return new Response(JSON.stringify({ 
        error: 'Password must be at least 6 characters long' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Wait for connection before database operations
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ 
        error: 'User already exists with this email' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });

    // Return success without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return new Response(JSON.stringify({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword
    }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific connection errors
    if (error.name === 'MongoNetworkError' || 
        error.code === 'ECONNREFUSED' || 
        error.message.includes('querySrv')) {
      return new Response(JSON.stringify({ 
        error: 'Database connection failed. Please check your internet connection and try again.' 
      }), { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (error.code === 11000) {
      return new Response(JSON.stringify({ 
        error: 'Email already registered' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
