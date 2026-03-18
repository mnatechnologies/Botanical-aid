import type { Metadata } from 'next';
import Image from 'next/image';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'About Us — Our Story & Mission',
  description:
    'Learn about Botanical Aid and founder Victoria Rabbah — a homeopath since 1999 creating natural wellness products. Discover our story, mission, and commitment to holistic healing with botanical formulations.',
  alternates: {
    canonical: 'https://www.botanicalaid.com.au/about',
  },
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <PageHero title="About Us" imageUrl="/assets/hero-about.jpg" />

      {/* Intro */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 space-y-5 text-gray-700 leading-relaxed">
              <h2 className="text-2xl font-bold text-[#1565c0] italic">
                At Botanical Aid, we believe in the power of nature to nurture and heal.
              </h2>
              <p>
                Our products are lovingly formulated with pure, natural ingredients to enhance
                therapeutic effects, the way nature intended. Guided by a commitment to holistic
                wellness, we craft solutions that support both emotional and physical wellbeing,
                empowering individuals to embrace self-care in its most natural form.
              </p>
              <p>
                With sustainability at the heart of everything we do, our mission is to create
                effective, plant-based remedies that honour the earth while prioritizing your
                health. Whether you&apos;re seeking relief from anxiety or recovery support,
                Botanical Aid is your trusted partner in harnessing nature&apos;s wisdom for a
                better, balanced you.
              </p>
            </div>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/circle/assets/about-extra.png"
                alt="Natural botanical ingredients"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Botanical Aid */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#1565c0] mb-6">
            Why choose Botanical Aid?
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            At Botanical Aid, we harness the incredible healing properties of natural remedies
            to nurture your mind and body. Our products are thoughtfully crafted with pure,
            natural ingredients that work in harmony with your body to restore balance, promote
            wellness, and support overall health.
          </p>
          <ul className="space-y-4 text-gray-700 leading-relaxed list-disc pl-6">
            <li>
              <strong>Natural and Pure:</strong> Every ingredient is carefully chosen from nature,
              free from harsh chemicals, and renowned for its restorative and healing properties.
            </li>
            <li>
              <strong>Healing Benefits:</strong> Our formulations are enriched with the therapeutic
              power of botanicals, which support the body&apos;s natural ability to heal. From
              calming inflammation to boosting skin health and relieving stress, these remedies
              nurture you holistically.
            </li>
            <li>
              <strong>Holistic Wellness:</strong> Designed to care for both body and mind, our
              products promote emotional well-being, help alleviate stress, and rejuvenate your
              body, offering a complete approach to self-care.
            </li>
            <li>
              <strong>Sustainable and Ethical:</strong> Our commitment to eco-friendly practices
              ensures that you can care for yourself while caring for the planet.
            </li>
            <li>
              <strong>Trusted Quality:</strong> Combining the wisdom of traditional natural
              remedies with modern expertise, Botanical Aid delivers products that you can rely
              on to improve your well-being.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-6">
            Choosing Botanical Aid means embracing the gifts of nature. Our products allow you
            to experience the profound healing that natural remedies provide, helping you achieve
            a balanced, harmonious, and healthier life. Let the power of nature guide your
            wellness journey.
          </p>
        </div>
      </section>

      {/* Meet Victoria */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#1565c0] mb-8">
            Meet Victoria — The heart behind Botanical Aid
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 space-y-5 text-gray-700 leading-relaxed">
              <p>
                Victoria&apos;s journey into natural healing began with a deeply personal
                experience that transformed her life and shaped her mission. As a devoted mother
                and passionate homeopath, Victoria first explored the world of natural remedies
                when her daughter suffered from severe anxiety at a young age. Witnessing her
                child&apos;s struggles with constant vomiting triggered by unfamiliar
                surroundings, Victoria was determined to find solutions that could bring comfort
                and healing.
              </p>
              <p>
                Drawing from her advanced diploma in homeopathy, Victoria began formulating balms,
                remedies, and creams to ease her daughter&apos;s anxiety. The success of these
                products not only provided solace to her family but ignited a spark to share this
                care with others. Since 2012, Victoria has expanded her work into creating a range
                of natural products that promote mental and physical well-being, now exported
                across Asia, Australia, and New Zealand.
              </p>
              <p>
                Victoria&apos;s expertise is backed by years of dedication to her craft. Practicing
                as a homeopath since 1999, she specializes in holistic approaches to mental health,
                particularly for children, incorporating play therapy to support healing. Her
                academic journey includes a Bachelor of Health and Science and postgraduate studies
                in Mental Health, enhancing her ability to create effective remedies. Victoria has
                also worked as a mental health consultant for corporate businesses since 2018,
                sharing her insights to foster well-being in professional environments.
              </p>
              <p>
                Today, Victoria channels her passion and experience into Botanical Aid, a company
                that blends natural medicines and oils to assist individuals on their journey of
                healing. With every product, Victoria aims to bring the nurturing power of nature
                to those in need, offering solutions inspired by love, expertise, and compassion.
                Botanical Aid is more than a business — it&apos;s her way of sharing a story of
                hope and healing with the world.
              </p>
            </div>
            <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/circle/assets/about-victoria.png"
                alt="Victoria — Founder of Botanical Aid"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Homeopathy — hero banner */}
      <section className="relative w-full min-h-[300px] flex items-center">
        <Image
          src="/circle/assets/about-homeopathy-banner.jpg"
          alt="About homeopathy"
          fill
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4 lg:px-6">
          <h2 className="text-4xl lg:text-5xl font-bold text-white">About homeopathy</h2>
        </div>
      </section>

      {/* Homeopathy Story */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#1565c0] mb-8">
            A journey from suffering to healing — My path to homeopathy
          </h2>
          <div className="space-y-5 text-gray-700 leading-relaxed">
            <p>
              It was the spring of 1994, and I was walking through Adelaide city, heading to my
              business course. What should have been a routine day quickly became
              overwhelming — my hayfever and sinus issues were unbearable. By the time I reached
              the building, my eyes were swollen, my face was red and rash-covered, and I could
              barely see. I had tried medications, creams, and countless doctor visits, but
              nothing provided relief.
            </p>
            <p>
              Desperate for a solution, a friend suggested I see a homeopath — something I knew
              little about. At that point, all I knew was that I couldn&apos;t keep suffering.
            </p>
            <p>
              Enter Sandra, a homeopath who made me feel instantly at ease. She took the time to
              understand my symptoms, prescribing a remedy tailored to my condition. After one
              session, I noticed a shift. By the third month, my symptoms had completely
              disappeared.
            </p>
            <p>
              Curious about the power of homeopathy, I enrolled in Sandra&apos;s first aid course
              and purchased a homeopathic first-aid kit. Using it for my family, I witnessed
              significant improvements in their health. That transformative experience changed my
              path forever — I knew I wanted to become a homeopath and help others find the same
              healing I had.
            </p>
            <p>
              Since then, I have dedicated myself to treating people, guiding them toward natural,
              effective solutions for their health. What started as a personal struggle became a
              lifelong passion, and I am honoured to share this journey with others.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
