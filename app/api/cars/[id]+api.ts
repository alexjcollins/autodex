import { getCar } from '@/lib/data/store';

export async function GET(_request: Request, { id }: Record<string, string>) {
  const car = getCar(id);
  if (!car) {
    return Response.json({ error: 'Car not found' }, { status: 404 });
  }
  return Response.json({ car });
}
