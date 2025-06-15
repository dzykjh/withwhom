import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Place from '@/models/Place';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const place = await Place.findById(params.id);
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(place);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const data = await req.json();
  const place = await Place.findByIdAndUpdate(params.id, data, { new: true });
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(place);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const place = await Place.findByIdAndDelete(params.id);
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
} 