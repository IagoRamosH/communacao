import capaHero from '../assets/voluntario1.jpg';

function Hero() {
  return (
    <section
      className="h-[400px] flex items-center justify-center text-white text-center bg-cover bg-center"
      style={{
        backgroundImage:
          `url(${capaHero})`,
      }}
    >
      <div className="bg-black/40 w-full h-full flex items-center justify-center">
        <h2 className="text-2xl font-semibold">
          Encontre eventos sociais na sua comunidade
        </h2>
      </div>
    </section>
  );
}

export default Hero;