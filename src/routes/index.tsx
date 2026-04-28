import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import heroImg from "@/assets/hero-architecture.jpg";
import sobreImg from "@/assets/sobre-leticia.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Letícia de Andrade — Arquitetura e Interiores" },
      {
        name: "description",
        content:
          "Arquitetura e interiores em Itapema e Porto Belo. Projetos que saem do papel com fidelidade — escuta ativa, estética e funcionalidade.",
      },
      { property: "og:title", content: "Letícia de Andrade — Arquitetura e Interiores" },
      {
        property: "og:description",
        content:
          "Projetos de arquitetura e interiores em Itapema e Porto Belo (SC).",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!navRef.current) return;
      navRef.current.classList.toggle("scrolled", window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="leticia-site">
        <nav id="navbar" ref={navRef}>
          <a href="#hero" className="nav-logo">Letícia de Andrade</a>
          <ul className="nav-links">
            <li><a href="#servicos">Serviços</a></li>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#projetos">Projetos</a></li>
            <li><a href="#processo">Processo</a></li>
            <li><a href="#depoimentos">Depoimentos</a></li>
            <li><a href="#contato">Contato</a></li>
          </ul>
        </nav>

        <section id="hero">
          <div
            className="hero-bg"
            style={{ backgroundImage: `url(${heroImg})` }}
          />
          <span className="hero-year">2026</span>
          <div className="hero-content">
            <span className="hero-tag">Escritório — Itapema & Porto Belo, SC</span>
            <h1 className="hero-title">
              Letícia de<br />
              <em>Andrade</em>
            </h1>
            <p className="hero-sub">
              Arquitetura e Interiores — Projetos que saem do papel com fidelidade
            </p>
            <a href="https://wa.me/5549999933040" className="hero-cta" target="_blank" rel="noreferrer">
              <WhatsIcon />
              Falar no WhatsApp
            </a>
          </div>
          <span className="scroll-hint">Role para baixo</span>
        </section>

        <section id="servicos">
          <div className="service-card reveal">
            <span className="service-number">01</span>
            <h3 className="service-title">Projeto de Interiores</h3>
            <p className="service-desc">
              Para quem quer transformar o espaço com estética, funcionalidade e fidelidade na execução.
              Do conceito à entrega com segurança em cada etapa.
            </p>
            <div className="service-tags">
              <span className="service-tag">Apartamento Novo</span>
              <span className="service-tag">Reforma</span>
            </div>
          </div>
          <div className="service-card reveal" style={{ transitionDelay: "0.15s" }}>
            <span className="service-number">02</span>
            <h3 className="service-title">Projeto Arquitetônico</h3>
            <p className="service-desc">
              Para quem precisa de um projeto completo, com segurança técnica e clareza em cada
              etapa do desenvolvimento.
            </p>
            <div className="service-tags">
              <span className="service-tag">Do Zero</span>
              <span className="service-tag">Reforma</span>
            </div>
          </div>
        </section>

        <section id="sobre">
          <div className="reveal">
            <span className="sobre-label">Nossa História</span>
            <h2 className="sobre-title">Arquitetura que nasce da escuta</h2>
            <p className="sobre-text">
              Com mais de 50 ambientes e casas projetados, sou arquiteta especialista em design de
              interiores, com atuação focada em projetos criativos em Itapema e Porto Belo. Meu
              trabalho nasce da escuta ativa e da compreensão real da rotina de cada cliente,
              transformando ideias em espaços que unem estética, funcionalidade e viabilidade de
              execução.
              <br /><br />
              Acredito que um bom projeto é aquele que sai do papel com fidelidade, trazendo
              segurança durante a obra e tranquilidade no resultado final.
            </p>
            <div className="sobre-stats">
              <div><span className="stat-number">50+</span><span className="stat-label">Ambientes Projetados</span></div>
              <div><span className="stat-number">6+</span><span className="stat-label">Anos de Experiência</span></div>
              <div><span className="stat-number">5</span><span className="stat-label">Cidades de Atuação</span></div>
            </div>
          </div>
          <div className="sobre-image reveal" style={{ transitionDelay: "0.2s" }}>
            <img src={sobreImg} alt="Letícia de Andrade — arquiteta" loading="lazy" width={1024} height={1280} />
          </div>
        </section>

        <section id="projetos">
          <div className="projetos-header reveal">
            <h2 className="projetos-title">Nossos Trabalhos</h2>
            <span className="projetos-label">Our Work</span>
          </div>
          <div className="projetos-grid">
            {projetos.map((p, i) => (
              <div key={p.nome} className="projeto-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className={`projeto-placeholder ${p.cls}`} />
                <div className="projeto-info-top"><span className="projeto-nome">{p.nome}</span></div>
                <div className="projeto-overlay">
                  <span className="projeto-tipo">{p.tipo}</span>
                  <span className="projeto-nome-bottom">{p.nome}</span>
                  <a href="#" className="projeto-link">Veja o Projeto →</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="processo">
          <div className="processo-header reveal">
            <span className="processo-label">Como Trabalhamos</span>
            <h2 className="processo-title">
              Do conceito<br />
              <em style={{ fontStyle: "italic", color: "#555" }}>à entrega</em>
            </h2>
          </div>
          <div className="etapas">
            {etapas.map((e, i) => (
              <div key={e.num} className="etapa reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="etapa-line" />
                <span className="etapa-num">{e.num}</span>
                <h4 className="etapa-title">{e.title}</h4>
                <p className="etapa-desc">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="depoimentos">
          <div className="dep-header reveal">
            <span className="dep-label">O que dizem</span>
            <h2 className="dep-title">Clientes que<br />confiaram</h2>
          </div>
          <div className="dep-grid">
            {depoimentos.map((d, i) => (
              <div key={d.author} className="dep-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className="dep-quote">&ldquo;</span>
                <p className="dep-text">{d.text}</p>
                <span className="dep-author">{d.author}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="contato">
          <div className="contato-content reveal">
            <span className="contato-label">Vamos Conversar</span>
            <h2 className="contato-title">Pronta para transformar o seu espaço?</h2>
            <a href="https://wa.me/5549999933040" className="contato-cta" target="_blank" rel="noreferrer">
              <WhatsIcon size={18} />
              Falar no WhatsApp
            </a>
            <div className="contato-social">
              <a href="https://instagram.com/leticiadeandradearquiteta" target="_blank" rel="noreferrer">Instagram</a>
              <a href="mailto:leticiadeandradearquitetura@gmail.com">leticiadeandradearquitetura@gmail.com</a>
            </div>
          </div>
        </section>

        <footer>
          <span>© 2026 Letícia de Andrade Arquitetura e Interiores</span>
          <span>Itapema & Porto Belo — SC</span>
        </footer>
      </div>
    </>
  );
}

const projetos = [
  { nome: "Apartamento Bleu", tipo: "Interiores — Apartamento Novo", cls: "p1" },
  { nome: "Apartamento Sole", tipo: "Interiores — Reforma", cls: "p2" },
  { nome: "Bruno Personal Studio", tipo: "Arquitetônico — Porto Belo", cls: "p3" },
  { nome: "Apartamento Sana", tipo: "Interiores — Itapema", cls: "p4" },
];

const etapas = [
  { num: "01", title: "Conversa Inicial", desc: "Escuta ativa para entender sua rotina, seus gostos e o que você imagina para o espaço." },
  { num: "02", title: "Proposta e Briefing", desc: "Apresentação do escopo, prazo e investimento antes de qualquer compromisso." },
  { num: "03", title: "Desenvolvimento", desc: "Criação do projeto com plantas, perspectivas 3D e especificações técnicas detalhadas." },
  { num: "04", title: "Acompanhamento", desc: "Suporte durante a execução da obra para garantir fidelidade ao projeto." },
];

const depoimentos = [
  { text: "Recomendo pelo seu toque refinado, atenção aos detalhes e pela forma sutil com que conduz tudo dentro do orçamento recomendado.", author: "José Adelar da Costa" },
  { text: "O trabalho foi realmente incrível, nosso escritório ficou maravilhoso! Ela fez o projeto e executou do zero — o resultado foi simplesmente maravilhoso.", author: "@bruno.personalonline" },
  { text: "Me ajudou muito a montar meu espaço do jeitinho que eu queria, respeitando meus gostos e minhas ideias. Indico seu trabalho sempre.", author: "@nutricintiasilva" },
];

function WhatsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: size, height: size }}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.121.555 4.112 1.528 5.836L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.371l-.36-.214-3.723.886.903-3.628-.234-.373A9.818 9.818 0 1112 21.818z" />
    </svg>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

.leticia-site { --black:#0a0a0a; --gray-dark:#1a1a1a; --gray-mid:#555; --gray-light:#aaa; --off-white:#f5f3ef; --beige:#ede9e1; --white:#ffffff;
  font-family:'DM Sans',sans-serif; background:var(--off-white); color:var(--black); overflow-x:hidden; scroll-behavior:smooth;
}
.leticia-site *, .leticia-site *::before, .leticia-site *::after { box-sizing:border-box; margin:0; padding:0; }
html { scroll-behavior:smooth; }

.leticia-site nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; justify-content:space-between; align-items:center; padding:24px 60px; background:transparent; transition:background 0.4s; }
.leticia-site nav.scrolled { background:rgba(10,10,10,0.92); backdrop-filter:blur(8px); }
.leticia-site nav.scrolled .nav-logo, .leticia-site nav.scrolled .nav-links a { color:var(--white); }
.leticia-site .nav-logo { font-family:'Cormorant Garamond',serif; font-size:15px; font-weight:400; letter-spacing:0.2em; text-transform:uppercase; color:var(--white); text-decoration:none; }
.leticia-site .nav-links { display:flex; gap:40px; list-style:none; }
.leticia-site .nav-links a { font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--white); text-decoration:none; opacity:0.8; transition:opacity 0.2s; }
.leticia-site .nav-links a:hover { opacity:1; }

.leticia-site #hero { position:relative; height:100vh; min-height:700px; overflow:hidden; display:flex; align-items:flex-end; padding:80px 60px; background:var(--black); }
.leticia-site .hero-bg { position:absolute; inset:0; z-index:0; background-size:cover; background-position:center 30%; }
.leticia-site .hero-bg::after { content:''; position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.15) 100%); }
.leticia-site .hero-content { position:relative; z-index:2; max-width:700px; }
.leticia-site .hero-tag { font-size:11px; letter-spacing:0.25em; text-transform:uppercase; color:var(--gray-light); margin-bottom:20px; display:block; opacity:0; animation:fadeUp 0.8s ease 0.2s forwards; }
.leticia-site .hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(52px,8vw,96px); font-weight:300; line-height:0.95; color:var(--white); margin-bottom:28px; opacity:0; animation:fadeUp 0.9s ease 0.4s forwards; }
.leticia-site .hero-title em { font-style:italic; color:var(--gray-light); }
.leticia-site .hero-sub { font-size:13px; letter-spacing:0.08em; color:var(--gray-light); margin-bottom:48px; opacity:0; animation:fadeUp 0.9s ease 0.6s forwards; }
.leticia-site .hero-cta { display:inline-flex; align-items:center; gap:12px; background:var(--white); color:var(--black); text-decoration:none; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; padding:16px 32px; font-weight:500; transition:background 0.3s; opacity:0; animation:fadeUp 0.9s ease 0.8s forwards; }
.leticia-site .hero-cta:hover { background:var(--beige); }
.leticia-site .hero-year { position:absolute; top:100px; right:60px; font-family:'Cormorant Garamond',serif; font-size:13px; color:var(--gray-light); letter-spacing:0.1em; z-index:2; opacity:0; animation:fadeIn 1s ease 1s forwards; }
.leticia-site .scroll-hint { position:absolute; bottom:40px; right:60px; writing-mode:vertical-rl; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:var(--gray-light); z-index:2; opacity:0; animation:fadeIn 1s ease 1.2s forwards; }

.leticia-site #servicos { background:var(--black); padding:100px 60px; display:grid; grid-template-columns:1fr 1fr; gap:1px; position:relative; }
.leticia-site #servicos::before { content:'O QUE FAZEMOS'; position:absolute; top:60px; left:60px; font-size:10px; letter-spacing:0.3em; color:var(--gray-mid); }
.leticia-site .service-card { padding:80px 60px 60px; border-top:1px solid #2a2a2a; transition:background 0.3s; }
.leticia-site .service-card:hover { background:#111; }
.leticia-site .service-number { font-family:'Cormorant Garamond',serif; font-size:48px; font-weight:300; color:#2a2a2a; display:block; margin-bottom:24px; line-height:1; }
.leticia-site .service-title { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:400; color:var(--white); margin-bottom:16px; line-height:1.2; }
.leticia-site .service-desc { font-size:13px; color:var(--gray-light); line-height:1.8; max-width:320px; }
.leticia-site .service-tags { display:flex; gap:12px; margin-top:32px; flex-wrap:wrap; }
.leticia-site .service-tag { font-size:10px; letter-spacing:0.15em; text-transform:uppercase; color:var(--gray-mid); border:1px solid #2a2a2a; padding:6px 14px; }

.leticia-site #sobre { background:var(--off-white); padding:120px 60px; display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
.leticia-site .sobre-label { font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:var(--gray-mid); display:block; margin-bottom:32px; }
.leticia-site .sobre-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,5vw,60px); font-weight:300; line-height:1.1; margin-bottom:32px; color:var(--black); }
.leticia-site .sobre-text { font-size:14px; line-height:1.9; color:var(--gray-mid); max-width:480px; }
.leticia-site .sobre-stats { display:flex; gap:48px; margin-top:48px; padding-top:40px; border-top:1px solid #ddd; }
.leticia-site .stat-number { font-family:'Cormorant Garamond',serif; font-size:40px; font-weight:300; color:var(--black); display:block; line-height:1; }
.leticia-site .stat-label { font-size:11px; letter-spacing:0.1em; color:var(--gray-mid); margin-top:6px; display:block; }
.leticia-site .sobre-image { position:relative; height:600px; background:var(--gray-dark); overflow:hidden; }
.leticia-site .sobre-image img { width:100%; height:100%; object-fit:cover; object-position:center; display:block; }
.leticia-site .sobre-image::after { content:''; position:absolute; bottom:-20px; left:-20px; width:160px; height:160px; border:1px solid var(--beige); z-index:-1; }

.leticia-site #projetos { background:var(--beige); padding:120px 60px; }
.leticia-site .projetos-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:60px; }
.leticia-site .projetos-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,5vw,56px); font-weight:300; color:var(--black); line-height:1; }
.leticia-site .projetos-label { font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:var(--gray-mid); }
.leticia-site .projetos-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.leticia-site .projeto-card { position:relative; overflow:hidden; cursor:pointer; background:var(--gray-dark); }
.leticia-site .projeto-placeholder { width:100%; height:420px; transition:filter 0.6s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.6s ease; filter:grayscale(100%); background-size:cover; background-position:center; }
.leticia-site .projeto-card:hover .projeto-placeholder { filter:grayscale(0%); transform:scale(1.03); }
.leticia-site .p1 { background:linear-gradient(135deg,#8B7355 0%,#C4A882 40%,#6B5B45 100%); }
.leticia-site .p2 { background:linear-gradient(135deg,#5B6B7A 0%,#8BA3B5 40%,#3D5060 100%); }
.leticia-site .p3 { background:linear-gradient(135deg,#7A6B5B 0%,#B5A08A 40%,#5A4B3B 100%); }
.leticia-site .p4 { background:linear-gradient(135deg,#6B7A5B 0%,#9AB08A 40%,#4B5A3B 100%); }
.leticia-site .projeto-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%); display:flex; flex-direction:column; justify-content:flex-end; padding:32px; opacity:0; transition:opacity 0.4s ease; }
.leticia-site .projeto-card:hover .projeto-overlay { opacity:1; }
.leticia-site .projeto-info-top { position:absolute; top:0; left:0; right:0; padding:24px 32px; display:flex; justify-content:space-between; align-items:flex-start; }
.leticia-site .projeto-nome { font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:rgba(255,255,255,0.6); background:rgba(0,0,0,0.4); padding:8px 16px; backdrop-filter:blur(4px); transition:color 0.3s; }
.leticia-site .projeto-card:hover .projeto-nome { color:rgba(255,255,255,0.9); }
.leticia-site .projeto-nome-bottom { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300; color:var(--white); margin-bottom:8px; }
.leticia-site .projeto-tipo { font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:var(--gray-light); margin-bottom:16px; }
.leticia-site .projeto-link { font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:var(--white); text-decoration:none; display:inline-flex; align-items:center; gap:8px; border-bottom:1px solid rgba(255,255,255,0.4); padding-bottom:2px; width:fit-content; }

.leticia-site #processo { background:var(--black); padding:120px 60px; }
.leticia-site .processo-header { margin-bottom:80px; }
.leticia-site .processo-label { font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:var(--gray-mid); display:block; margin-bottom:20px; }
.leticia-site .processo-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,5vw,60px); font-weight:300; color:var(--white); line-height:1; }
.leticia-site .etapas { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:#1a1a1a; }
.leticia-site .etapa { background:var(--black); padding:48px 36px; border-top:1px solid #1a1a1a; position:relative; transition:background 0.3s; }
.leticia-site .etapa:hover { background:#0d0d0d; }
.leticia-site .etapa-num { font-family:'Cormorant Garamond',serif; font-size:64px; font-weight:300; color:#1e1e1e; line-height:1; margin-bottom:32px; display:block; }
.leticia-site .etapa-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:400; color:var(--white); margin-bottom:12px; }
.leticia-site .etapa-desc { font-size:13px; color:var(--gray-mid); line-height:1.7; }
.leticia-site .etapa-line { position:absolute; top:0; left:0; width:0; height:2px; background:var(--white); transition:width 0.4s ease; }
.leticia-site .etapa:hover .etapa-line { width:100%; }

.leticia-site #depoimentos { background:var(--off-white); padding:120px 60px; }
.leticia-site .dep-header { margin-bottom:72px; }
.leticia-site .dep-label { font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:var(--gray-mid); display:block; margin-bottom:20px; }
.leticia-site .dep-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,5vw,56px); font-weight:300; color:var(--black); line-height:1; }
.leticia-site .dep-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:32px; }
.leticia-site .dep-card { background:var(--white); padding:48px 40px; position:relative; transition:transform 0.3s; }
.leticia-site .dep-card:hover { transform:translateY(-4px); }
.leticia-site .dep-quote { font-family:'Cormorant Garamond',serif; font-size:72px; font-weight:300; color:var(--beige); line-height:0.6; margin-bottom:24px; display:block; }
.leticia-site .dep-text { font-size:14px; line-height:1.8; color:var(--gray-mid); font-style:italic; margin-bottom:32px; }
.leticia-site .dep-author { font-size:11px; letter-spacing:0.15em; text-transform:uppercase; color:var(--black); border-top:1px solid var(--beige); padding-top:20px; display:block; }

.leticia-site #contato { background:var(--black); padding:140px 60px; text-align:center; position:relative; overflow:hidden; }
.leticia-site #contato::before { content:'CONTATO'; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-family:'Cormorant Garamond',serif; font-size:clamp(80px,15vw,200px); font-weight:300; color:transparent; -webkit-text-stroke:1px #1a1a1a; white-space:nowrap; pointer-events:none; z-index:0; }
.leticia-site .contato-content { position:relative; z-index:1; }
.leticia-site .contato-label { font-size:10px; letter-spacing:0.3em; text-transform:uppercase; color:var(--gray-mid); display:block; margin-bottom:24px; }
.leticia-site .contato-title { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,5vw,64px); font-weight:300; color:var(--white); line-height:1.1; margin-bottom:48px; max-width:600px; margin-left:auto; margin-right:auto; }
.leticia-site .contato-cta { display:inline-flex; align-items:center; gap:14px; background:var(--white); color:var(--black); text-decoration:none; font-size:12px; letter-spacing:0.2em; text-transform:uppercase; padding:20px 48px; font-weight:500; transition:background 0.3s, transform 0.2s; }
.leticia-site .contato-cta:hover { background:var(--beige); transform:translateY(-2px); }
.leticia-site .contato-social { margin-top:64px; display:flex; justify-content:center; gap:40px; flex-wrap:wrap; }
.leticia-site .contato-social a { font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:var(--gray-mid); text-decoration:none; transition:color 0.2s; }
.leticia-site .contato-social a:hover { color:var(--white); }

.leticia-site footer { background:#050505; padding:32px 60px; display:flex; justify-content:space-between; align-items:center; border-top:1px solid #111; }
.leticia-site footer span { font-size:11px; color:var(--gray-mid); letter-spacing:0.1em; }

@keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
.leticia-site .reveal { opacity:0; transform:translateY(40px); transition:opacity 0.8s ease, transform 0.8s ease; }
.leticia-site .reveal.visible { opacity:1; transform:translateY(0); }

@media (max-width:900px) {
  .leticia-site nav { padding:20px 24px; } .leticia-site .nav-links { display:none; }
  .leticia-site #hero { padding:80px 24px; } .leticia-site #servicos { grid-template-columns:1fr; padding:80px 24px; }
  .leticia-site #sobre { grid-template-columns:1fr; padding:80px 24px; gap:48px; } .leticia-site .sobre-image { height:400px; }
  .leticia-site #projetos, .leticia-site #processo, .leticia-site #depoimentos, .leticia-site #contato { padding:80px 24px; }
  .leticia-site .projetos-grid { grid-template-columns:1fr; } .leticia-site .etapas { grid-template-columns:1fr 1fr; }
  .leticia-site .dep-grid { grid-template-columns:1fr; } .leticia-site footer { padding:24px; flex-direction:column; gap:12px; text-align:center; }
  .leticia-site .hero-year, .leticia-site .scroll-hint { display:none; }
}
`;
