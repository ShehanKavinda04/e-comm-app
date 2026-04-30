import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCoverflow, Autoplay } from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";


import gsap from "gsap";
import axios from "axios";
import { useState, useEffect } from "react";

// Default fallback slides if no active ads are found
const fallbackSlides = [
  { img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1400&auto=format&fit=crop" },
  { img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop" }
];


const Ads = () => {
  const swiperRef = useRef(null);
  const [slides, setSlides] = useState([]);

  // Replace Firestore listener with Backend API Fetch (MySQL)
  useEffect(() => {
    const fetchActiveAds = async () => {
      try {
        const response = await axios.get("/api/ads/active", {
          timeout: 6000 // Optimized for 6s responsiveness
        });
        const activeAds = Array.isArray(response.data) ? response.data.map(ad => {
          let imagePath = ad.creativeUrl || ad.image;
          // Ensure path starts with / if it's a relative path to public
          // BUT DO NOT prepend / if it's already a full URL or a Base64 data string
          if (imagePath && 
              !imagePath.startsWith('http') && 
              !imagePath.startsWith('/') && 
              !imagePath.startsWith('data:')) {
            imagePath = `/${imagePath}`;
          }
          return {
            id: ad.id,
            img: imagePath,
            title: ad.title
          };
        }) : [];
        
        setSlides(activeAds.length > 0 ? activeAds : fallbackSlides);
      } catch (error) {
        console.error("Error fetching active ads:", error.message);
        setSlides(fallbackSlides);
      }
    };

    fetchActiveAds();

    let eventSource;
    const connectSSE = () => {
      console.log("Connecting to Advertisement SSE: /api/ads/stream");
      eventSource = new EventSource("/api/ads/stream");

      eventSource.addEventListener("AD_UPDATE", () => {
        console.log("Real-time update received: Refreshing active ads...");
        fetchActiveAds();
      });

      eventSource.onopen = () => {
        console.log("SSE Connection to /api/ads/stream established (Home Page).");
      };

      eventSource.onerror = (err) => {
        console.error("SSE Connection failed (Home Page), retrying in 5s...", err);
        eventSource.close();
        setTimeout(connectSSE, 5000); // Robust retry logic
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, []);

  // when swiper initializes, animate the initial active slide
  const onInit = (swiper) => {
    swiperRef.current = swiper;
    // delay to ensure DOM is painted
    setTimeout(() => animateActive(swiper), 50);
  };

  // animate the active slide's .slide-content using GASP
 const animateActive = (swiper) => {
  if (!swiper || !swiper.slides || swiper.slides.length === 0) return;

  const activeSlide = swiper.slides[swiper.activeIndex];
  if (!activeSlide) return;

  const content = activeSlide.querySelector(".slide-content");
  if (!content) return;

  gsap.set(".slide-content", { autoAlpha: 0, y: 30 });
  gsap.timeline().to(content, {
    autoAlpha: 1,
    y: 0,
    duration: 0.6,
    ease: "power3.out",
    stagger: 0.08,
  });
};

  // on every slide change animate the new active slide
  const handleSlideChange = (swiper) => {
    animateActive(swiper);
  };
 
  return (    
    <div className="w-full max-w-7xl mx-auto px-4 md:px-10 pt-5 transition-all">
      <div className="relative">
        <Swiper
          modules={[Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"                       
          coverflowEffect={{ rotate: 10, depth: 50, slideShadows: false }}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1}
          breakpoints={{
            1024: { slidesPerView: 1.2 }
          }}
          spaceBetween={30}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          onSwiper={onInit}
          onSlideChange={handleSlideChange}
          className="rounded-2xl"
        >
          {slides.map((s, i) => (
            <SwiperSlide key={i}>
              <div className="relative overflow-hidden h-[480px] rounded-2xl shadow-xl border border-gray-100 group">            
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src={s.img} 
                  alt={s.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1400&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-10">
                  <div className="slide-content">
                    <h2 className="text-white text-4xl font-bold drop-shadow-2xl mb-2">{s.title}</h2>
                    <p className="text-gray-200 text-lg opacity-90 max-w-lg">Exclusive offers and premium technology only at TechNova.</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
   
   
  )
}

export default Ads



