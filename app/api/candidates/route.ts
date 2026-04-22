import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const candidate = await prisma.candidate.create({
      data: {
        name: body.name,
        email: body.email,
        position: body.position,
        age: body.age?.toString(),
        education: body.education,
        civilStatus: body.civilStatus,
        testDate: body.testDate,
      }
    });
    return NextResponse.json(candidate);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      include: { results: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(candidates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}
