export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">About ELLYTIC</h1>
        <p className="mt-3 text-gray-600">Building a digital, low-bureaucracy Greece.</p>

        <section className="mt-10 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="mt-2 leading-relaxed">
              We simplify and digitize Greek administrative processes for EU citizens, Greek nationals, investors,
              expats, pensioners, and the Greek diaspora. Using AI and automation, we eliminate bureaucracy,
              reduce costs, and ensure transparency.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">About Us</h2>
            <p className="mt-2 leading-relaxed">
              We are a product-first team building a modern service network for Greece. We combine legal know-how
              with automation to make processes reliable, fast, and affordable.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Our Vision</h2>
            <p className="mt-2 leading-relaxed">
              A digital Greece—where administrative processes are fast, affordable, and easy for everyone.
              Despite economic growth, Greece's markets are still dominated by outdated, inefficient, and costly
              service providers (e.g., lawyers, notaries, accountants). Citizens often pay high fees for
              low-complexity services like opening bank accounts or obtaining an AFM tax number. Outdated
              regulations frustrate homebuyers, investors, and especially the Greek diaspora—particularly in
              countries like Germany.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Solutions</h2>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Automate processes like E1 & recurring E9 tax declarations (also for Greek citizens)</li>
              <li>AI-powered translations and document processing</li>
              <li>Streamline services without the need for lawyers or accountants</li>
              <li>Data-driven insights for investors, agents, and stakeholders</li>
              <li>Collaborate with or act as real estate agents and legal partners</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Our Goal</h2>
            <p className="mt-2 leading-relaxed">
              To create a zero-bureaucracy, fully digital environment—while building a transparent, low-cost
              service network for Greece and its international community.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

