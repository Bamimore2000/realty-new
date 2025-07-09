// pages/index.js

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <section
        className="h-screen bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560185008-5d57cc3121b3')",
        }}
      >
        <div className="bg-black bg-opacity-60 w-full h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            Find Your Dream Home
          </h1>
          <p className="text-lg md:text-xl mb-6 text-center max-w-2xl">
            Explore premium listings and make the best real estate decisions
            with RealtyWork.
          </p>
          <a
            href="#contact"
            className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Get Started
          </a>
        </div>
      </section>
    </div>
  );
}
