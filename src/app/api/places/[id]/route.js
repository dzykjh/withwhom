import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Place from '@/models/Place';

export async function GET(request, context) {
  await dbConnect();
  const place = await Place.findById(context.params.id);
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(place);
}

export async function PUT(request, context) {
  await dbConnect();
  const data = await request.json();
  const place = await Place.findByIdAndUpdate(context.params.id, data, { new: true });
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(place);
}

export async function DELETE(request, context) {
  await dbConnect();
  const place = await Place.findByIdAndDelete(context.params.id);
  if (!place) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
} 