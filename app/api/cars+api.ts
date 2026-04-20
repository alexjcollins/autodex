import { listCars } from '@/lib/data/store';

export async function GET() {
  const cars = listCars();
  return Response.json({ cars });
}
