function Hero() {
  return (
    <section
      className="h-[350px] flex items-center justify-center text-white text-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1733306621909-1d63c088a93e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZG9hJUMzJUE3JUMzJUEzbyUyMGRlJTIwY2FyaWRhZGV8ZW58MHx8MHx8fDA%3D')",
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