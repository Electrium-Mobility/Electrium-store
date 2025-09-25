import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="flex flex-col md:flex-row items-center gap-10 mb-16 bg-[hsl(var(--surface))] p-6 rounded-lg">
      <div className="flex-1">
        <Image
          src="/img/bike-graphic.svg"
          alt="About Us"
          width={500}
          height={400}
        />
      </div>

      <div className="flex-1 text-left">
        <h2 className="text-3xl font-bold text-[hsl(var(--btn-primary))] mb-4">
          Electrium Shop
        </h2>
        <p className="text-[hsl(var(--text-primary))] opacity-80">
          At Electrium Mobility, we're passionate about shaping the future of
          transportation with innovative, sustainable, and affordable electric
          mobility solutions. Our shop offers a curated selection of electric
          bikes, skateboards, and one-wheels—designed for students,
          professionals, and eco-conscious riders looking for efficient and fun
          ways to commute.
        </p>
      </div>
    </section>
  );
}
