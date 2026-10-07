/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, X, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    setDisplayed('');
    setDone(false);

    const timeoutId = setTimeout(() => {
      let currentIndex = 0;
      intervalId = setInterval(() => {
        currentIndex += 1;
        setDisplayed(text.slice(0, currentIndex));
        if (currentIndex >= text.length) {
          if (intervalId) clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    company: '',
    budget: '$5,000 - $15,000 USD',
    notes: '',
  });

  const availableServices = [
    'Tienda Online',
    'Catálogo Digital',
    'Landing Page',
    'Desarrollo Custom',
  ];

  // Typewriter hook with headline
  const { displayed, done } = useTypewriter('Interfaces que\nescalan tus ventas', 38, 600);

  // Video element and Scrubbing hooks
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  // Desktop Mouse Scrubbing Hook
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;

      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 10;

      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const timeDelta = (delta / window.innerWidth) * 0.8 * duration;
      const current = Number.isFinite(video.currentTime) ? video.currentTime : targetTimeRef.current;
      const newTarget = Math.min(Math.max(0, current + timeDelta), duration);
      targetTimeRef.current = newTarget;

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        try {
          video.currentTime = targetTimeRef.current;
        } catch {
          isSeekingRef.current = false;
        }
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (Math.abs(video.currentTime - targetTimeRef.current) > 0.08) {
        isSeekingRef.current = true;
        try {
          video.currentTime = targetTimeRef.current;
        } catch {
          isSeekingRef.current = false;
        }
      }
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, []);

  // Mobile Autoplay Hook (< 1024 width)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (window.innerWidth < 1024) {
      video.autoplay = true;
      video.loop = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled silently for autoplay policies
        });
      }
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        video.autoplay = true;
        video.loop = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleService = (service: string) => {
    setServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setIsInquiryModalOpen(false);
    }, 2400);
  };

  return (
    <div className="relative bg-white text-neutral-900 font-sans selection:bg-[#EAECE9] selection:text-[#1C2E1E] antialiased overflow-x-hidden flex flex-col lg:block lg:min-h-screen">
      {/* 4. Interactive Navbar */}
      <header className="fixed top-0 inset-x-0 z-10 px-5 sm:px-8 py-4 sm:py-5 flex flex-row justify-between items-center bg-transparent">
        {/* Logo (Left side) */}
        <div className="flex flex-row gap-2 items-center">
          <span className="text-[15px] sm:text-[16px] tracking-tight text-black font-medium select-none">
            Austral Digital&reg;
          </span>
          <span className="text-[16px] sm:text-[18px] text-black select-none tracking-[-0.02em] font-medium leading-none mb-0.5">
            ✱
          </span>
        </div>

        {/* Desktop Nav Links (Center) */}
        <nav className="hidden md:flex flex-row text-[14px] font-normal text-black gap-1 items-center">
          <a
            href="#servicios"
            className="hover:opacity-60 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('servicios-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Servicios
          </a>
          <span className="opacity-30">,&nbsp;</span>
          <a
            href="#casos"
            className="hover:opacity-60 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setIsInquiryModalOpen(true);
            }}
          >
            Casos de Éxito
          </a>
          <span className="opacity-30">,&nbsp;</span>
          <a
            href="#agencia"
            className="hover:opacity-60 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setIsInquiryModalOpen(true);
            }}
          >
            Agencia
          </a>
          <span className="opacity-30">,&nbsp;</span>
          <a
            href="#contacto"
            className="hover:opacity-60 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              setIsInquiryModalOpen(true);
            }}
          >
            Contacto
          </a>
        </nav>

        {/* Desktop CTA (Right) */}
        <div className="hidden md:block">
          <a
            href="#cotizar"
            onClick={(e) => {
              e.preventDefault();
              setIsInquiryModalOpen(true);
            }}
            className="text-[14px] font-medium text-black underline underline-offset-4 hover:opacity-60 transition-opacity"
          >
            Cotizar Proyecto
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          aria-label="Abrir menú"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[4.5px] cursor-pointer z-20"
        >
          <span
            className={`w-5 h-[1.5px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? 'rotate-45 translate-y-[6px]' : ''
            }`}
          />
          <span
            className={`w-5 h-[1.5px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-5 h-[1.5px] bg-black transition-all duration-300 ${
              isMobileMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 z-[9] md:hidden bg-white/95 backdrop-blur-sm transition-opacity duration-300 flex flex-col justify-between px-8 py-24 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6 text-2xl font-light text-neutral-900 tracking-tight">
          <a
            href="#servicios"
            onClick={() => {
              setIsMobileMenuOpen(false);
              const el = document.getElementById('servicios-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:opacity-60 transition-opacity"
          >
            Servicios
          </a>
          <a
            href="#casos"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsInquiryModalOpen(true);
            }}
            className="hover:opacity-60 transition-opacity"
          >
            Casos de Éxito
          </a>
          <a
            href="#agencia"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsInquiryModalOpen(true);
            }}
            className="hover:opacity-60 transition-opacity"
          >
            Agencia
          </a>
          <a
            href="#contacto"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsInquiryModalOpen(true);
            }}
            className="hover:opacity-60 transition-opacity"
          >
            Contacto
          </a>
        </div>

        <div className="pt-8 border-t border-neutral-100 flex flex-col gap-4">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsInquiryModalOpen(true);
            }}
            className="w-full py-3.5 bg-[#1C2E1E] text-white text-sm font-medium rounded-xl text-center shadow-sm"
          >
            Cotizar Proyecto
          </button>
          <p className="text-xs text-[#738273]">
            Austral Digital&reg; ✱ interfaces de alto rendimiento
          </p>
        </div>
      </div>

      {/* 3. Background Video Component (with Native Scrubbing) */}
      <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          src="https://cloudfront.net"
          className="w-full h-full object-cover object-right lg:object-right-bottom"
        />

        {/* Ambient artistic visual backdrop in case cloudfront endpoint is empty or loading */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-neutral-50 via-white to-[#FAFBF9] opacity-80 pointer-events-none">
          <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-radial from-[#EAECE9]/40 via-transparent to-transparent rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4" />
        </div>
      </div>

      {/* 5. Content Layout Container */}
      <div className="relative z-10 flex flex-col order-first lg:order-none w-full bg-white lg:bg-transparent pb-8 lg:pb-0 lg:min-h-screen">
        <main
          id="spade-hero"
          className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center"
        >
          <div className="pt-16 sm:pt-20 lg:pt-0 max-w-3xl">
            {/* 6. Typewriter Hook and Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-[68px] font-normal tracking-tight text-black leading-[1.1] mb-6 select-none w-full whitespace-pre-wrap">
                {displayed}
                {!done && (
                  <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
                )}
              </h1>
            </motion.div>

            {/* 7. Secondary Description Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-base md:text-lg text-[#5A635A] leading-relaxed font-normal mb-10 max-w-xl">
                Desarrollo estratégico de e-commerce y catálogos digitales de alto rendimiento.{' '}
                <br /> Construimos la infraestructura tecnológica exacta para llevar tu negocio al
                siguiente nivel.
              </p>
            </motion.div>

            {/* 8. Interactive Multi-Select Service Pills */}
            <div id="servicios-section" className="mb-4">
              <h2 className="text-xl font-medium tracking-tight mb-2">
                ¿Qué solución tecnológica necesitas?
              </h2>
              <p className="opacity-70 text-xs text-[#738273] mb-6">
                Select all that apply
              </p>

              {/* Service Pills flex wrap container */}
              <div className="flex flex-wrap gap-2.5 mb-6">
                {availableServices.map((service) => {
                  const isSelected = services.includes(service);
                  return (
                    <motion.button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      whileTap={{ scale: 0.97 }}
                      className={`cursor-pointer transition-colors duration-150 inline-flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#1C2E1E] text-white text-xs px-4 py-2 rounded-full shadow-md shadow-emerald-950/5 transform'
                          : 'bg-white text-[#1C2E1E] text-xs px-4 py-2 rounded-full border border-[#F1F3F1] hover:bg-[#F1F3F1]/55'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, y: -4, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          exit={{ scale: 0, y: -4, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          className="inline-flex items-center"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </motion.span>
                      )}
                      <span>{service}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Contingent Feedback Status Banner with AnimatePresence */}
              <div className="min-h-[56px]">
                <AnimatePresence mode="wait">
                  {services.length === 0 ? (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 0.5, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="italic text-xs text-neutral-600"
                    >
                      Please click to select services above.
                    </motion.div>
                  ) : (
                    <motion.div
                      key="active-state"
                      initial={{ opacity: 0, height: 0, y: 6 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -6 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#FAFBF9] border border-[#EAECE9] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-800">
                          <span className="w-2 h-2 rounded-full bg-[#1C2E1E] shrink-0" />
                          <span>
                            Ready to inquire about:{' '}
                            <strong className="font-semibold text-neutral-900">
                              {services.join(', ')}
                            </strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsInquiryModalOpen(true)}
                          className="inline-flex items-center gap-1.5 text-[#4D6D47] uppercase text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer group self-start sm:self-auto"
                        >
                          <span>Let's Go</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Project Inquiry Modal */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInquiryModalOpen(false)}
              className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-100 z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xl font-medium text-neutral-900 tracking-tight">
                    Cotizar Proyecto
                  </h3>
                  <p className="text-xs text-[#738273] mt-0.5">
                    Austral Digital&reg; ✱ Consultoría y Arquitectura Técnica
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInquiryModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {inquirySubmitted ? (
                <div className="py-10 text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#1C2E1E] flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h4 className="text-lg font-medium text-neutral-900 mb-1">
                    ¡Solicitud Recibida!
                  </h4>
                  <p className="text-xs text-[#5A635A] max-w-xs">
                    Nos pondremos en contacto contigo dentro de las próximas 24 horas con una
                    propuesta arquitectónica detallada.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {services.length > 0 && (
                    <div className="bg-[#FAFBF9] border border-[#EAECE9] rounded-xl p-3">
                      <span className="text-[11px] font-medium text-[#738273] uppercase tracking-wider block mb-1.5">
                        Servicios Seleccionados
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {services.map((item) => (
                          <span
                            key={item}
                            className="bg-[#1C2E1E] text-white text-[11px] px-2.5 py-1 rounded-full font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Juan Ignacio"
                        value={inquiryForm.name}
                        onChange={(e) =>
                          setInquiryForm({ ...inquiryForm, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-[#1C2E1E] focus:ring-1 focus:ring-[#1C2E1E] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Email corporativo
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="nombre@empresa.com"
                        value={inquiryForm.email}
                        onChange={(e) =>
                          setInquiryForm({ ...inquiryForm, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-[#1C2E1E] focus:ring-1 focus:ring-[#1C2E1E] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Empresa / Marca
                      </label>
                      <input
                        type="text"
                        placeholder="Mi Empresa SAS"
                        value={inquiryForm.company}
                        onChange={(e) =>
                          setInquiryForm({ ...inquiryForm, company: e.target.value })
                        }
                        className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-[#1C2E1E] focus:ring-1 focus:ring-[#1C2E1E] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Rango de inversión
                      </label>
                      <select
                        value={inquiryForm.budget}
                        onChange={(e) =>
                          setInquiryForm({ ...inquiryForm, budget: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-[#1C2E1E] focus:ring-1 focus:ring-[#1C2E1E] bg-white transition-colors"
                      >
                        <option>$3,000 - $6,000 USD</option>
                        <option>$6,000 - $15,000 USD</option>
                        <option>$15,000 - $35,000 USD</option>
                        <option>+$35,000 USD</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Detalles del proyecto
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Cuéntanos brevemente sobre los objetivos comerciales, integraciones o plazos..."
                      value={inquiryForm.notes}
                      onChange={(e) =>
                        setInquiryForm({ ...inquiryForm, notes: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-[#1C2E1E] focus:ring-1 focus:ring-[#1C2E1E] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1C2E1E] text-white text-xs font-medium uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Enviar Solicitud</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
