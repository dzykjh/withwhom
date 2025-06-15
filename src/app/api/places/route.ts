import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Place from '@/models/Place';

export async function GET() {
  await dbConnect();
  const places = await Place.find().sort({ createdAt: -1 });
  return NextResponse.json(places);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const place = await Place.create(data);
  return NextResponse.json(place);
} 