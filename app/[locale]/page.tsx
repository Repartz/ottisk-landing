// ============================================
// ГЛАВНАЯ СТРАНИЦА: Сборка всех секций лендинга
// ============================================

import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Portfolio } from '@/components/sections/Portfolio';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { Footer } from '@/components/layout/Footer';
import { PreloaderGate } from '@/components/animations/PreloaderGate';

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PreloaderGate>
      <main className="relative">
        <Header />
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Process />
        <Testimonials />
        <FAQ />
        <Footer />
      </main>
    </PreloaderGate>
  );
}
