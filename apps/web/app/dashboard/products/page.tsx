import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function Products() {
  const products = await prisma.product.findMany({ include: { playbook: true } });
  return (
    <main style={{padding:'2rem'}}>
      <h1 style={{fontSize:'1.25rem', fontWeight:600}}>Catalog</h1>
      <ul style={{marginTop:16, display:'grid', gap:12}}>
        {products.map(p => (
          <li key={p.id} style={{border:'1px solid #eee', padding:12, borderRadius:8}}>
            <div style={{fontWeight:600}}>{p.title} ({p.sku})</div>
            <div>Price fence: ${p.playbook?.priceMin?.toString()} – ${p.playbook?.priceMax?.toString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
