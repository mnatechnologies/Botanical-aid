import Link from 'next/link';
import Image from 'next/image';

const values = [
  'Natural and Pure',
  'Healing Benefits',
  'Holistic Wellness',
  'Sustainable and Ethical',
  'Trusted Quality',
];

export default function WhyChooseUs({ image = '/assets/why-choose-us.jpg' }: { image?: string }) {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
        {/* Left — dark navy */}
        <div className="flex items-center px-10 lg:px-16 py-14 lg:py-20" style={{ backgroundColor: '#1a3a8f' }}>
          <div className="max-w-lg w-full">
            <p className="text-white/60 text-xs font-semibold tracking-widest uppercase flex items-center gap-2 mb-3">
              <span className="text-green-400">✿</span> Why Choose Us?
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6 leading-tight">
              Why choose Botanical Aid?
            </h2>
            <ul className="space-y-3 mb-8">
              {values.map((v) => (
                <li key={v} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                  <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  {v}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/about"
                className="px-6 py-2.5 text-sm font-semibold text-white border border-white rounded hover:bg-white hover:text-[#1a3a8f] transition-colors"
              >
                READ MORE
              </Link>
              <Link
                href="/products"
                className="px-6 py-2.5 text-sm font-semibold text-white rounded hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#22c55e' }}
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>

        {/* Right — photo */}
        <div className="relative min-h-[320px] lg:min-h-0">
          <Image
            src={image}
            alt="Natural wellness — butterfly on flower"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
