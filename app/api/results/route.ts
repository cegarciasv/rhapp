import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await prisma.testResult.create({
      data: {
        candidateId: body.candidateId,
        testName: body.testName,
        answers: JSON.stringify(body.answers),
        scores: JSON.stringify(body.scores),
      }
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const results = await prisma.testResult.findMany({
      include: { candidate: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
