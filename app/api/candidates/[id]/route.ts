import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const candidate = await prisma.candidate.findUnique({
      where: { id }
    });
    if (!candidate) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(candidate);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch candidate' }, { status: 500 });
  }
}
