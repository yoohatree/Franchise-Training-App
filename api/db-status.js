import { neon } from '@neondatabase/serverless';

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'private, no-store');

  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    return response.status(405).json({ status: 'method_not_allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return response.status(503).json({ status: 'database_not_configured' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT 1 AS connected`;
    if (rows[0]?.connected !== 1) throw new Error('Unexpected database response');
    return response.status(200).json({ status: 'connected' });
  } catch (error) {
    console.error('Neon connection check failed', error?.name || 'Error');
    return response.status(503).json({ status: 'database_unavailable' });
  }
}
