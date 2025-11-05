import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  if (process.env.ADMIN_KEY !== 'supersecret123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const intentions = await prisma.intention.findMany();
  return NextResponse.json(intentions);
}
