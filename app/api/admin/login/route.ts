// ============================================
// API: Проверка пароля админ-панели
// Пароль хранится в .env.local (ADMIN_PASSWORD)
// При успехе устанавливает HTTP-only cookie сессии
// ============================================

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (typeof password !== 'string' || password.length === 0) {
      return NextResponse.json(
        { success: false, error: 'invalid_request' },
        { status: 400 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'invalid_password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 часа
    });
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'invalid_request' },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return response;
}
