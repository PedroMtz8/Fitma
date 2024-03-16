import Live from '@/components/Live';
import Navbar from '@/components/Navbar';

export default async function Home() {
  return (
    <main className='h-screen overflow-hidden ' >
      <Navbar />
      <section className='flex h-full flex-row'>
        <Live />
      </section>
    </main>
  );
}
