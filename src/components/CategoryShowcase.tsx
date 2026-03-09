import Link from 'next/link';
import Image from 'next/image';

export default function CategoryShowcase() {
  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Left text */}
          <div className="md:w-1/3 text-center md:text-left order-2 md:order-1">
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#1a3a8f] leading-tight">
              Gentle remedies for<br />your body &amp; mind
            </h2>
          </div>

          {/* Category circles */}
          <div className="flex items-center gap-10 lg:gap-16 order-1 md:order-2">
            {/* Mental Health */}
            <Link href="/mental-healthrange" className="group flex flex-col items-center gap-3">
              <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden ring-4 ring-[#7c3aed] ring-offset-2 group-hover:ring-offset-4 transition-all shadow-lg">
                <Image
                  src="/assets/category-post-treatment.png"
                  alt="Mental Health Range"
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-bold tracking-widest text-[#7c3aed] uppercase text-center">
                MENTAL HEALTH<br />RANGE
              </span>
            </Link>

            {/* Post Treatment */}
            <Link href="/post-treatment-skincare" className="group flex flex-col items-center gap-3">
              <div className="relative w-28 h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden ring-4 ring-[#0d9488] ring-offset-2 group-hover:ring-offset-4 transition-all shadow-lg">
                <Image
                  src="/assets/category-mental-health.png"
                  alt="Post Treatment Skincare"
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-xs font-bold tracking-widest text-[#0d9488] uppercase text-center">
                POST TREATMENT<br />SKINCARE
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
