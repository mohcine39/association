import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return NextResponse.json({ success: false, error: 'Admin secret not configured' }, { status: 500 });
    }

    if (password === adminSecret) {
      const response = NextResponse.json({ success: true });
      
      // Set a cookie that expires in 24 hours
      (await cookies()).set('admin_session', adminSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'كلمة المرور غير صحيحة' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'حدث خطأ غير متوقع' }, { status: 500 });
  }
}
