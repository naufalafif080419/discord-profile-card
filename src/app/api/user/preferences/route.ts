import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getRedisClient } from '@/lib/redis';

function getPreferencesKey(userId: string): string {
  return `user-preferences:${userId}`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await getRedisClient();
    const key = getPreferencesKey(session.user.id);
    const data = await client.get(key);

    return NextResponse.json(data ? JSON.parse(data) : {});
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    // Basic validation could go here, but since it's user preferences, 
    // we're flexible. Maybe ensure it's an object.
    if (typeof body !== 'object' || body === null) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const client = await getRedisClient();
    const key = getPreferencesKey(session.user.id);
    
    // Store indefinitely (or set a very long TTL if preferred)
    await client.set(key, JSON.stringify(body));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving preferences:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
