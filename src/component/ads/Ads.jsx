import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCoverflow, Autoplay } from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";


import gsap from "gsap";

 const slides = [
  {img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1" },
  {img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=2" },
  {img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1" },
  {img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=1" }
];


const Ads = () => {
  const swiperRef = useRef(null);

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
    <div className="md:w-[950px] sm:w-[450px] justify-center transition-all px-5 pt-2 ">
      <div className="gap-5">
        <Swiper
          modules={[Pagination, Autoplay, EffectCoverflow]}
          effect="coverflow"                       
          coverflowEffect={{ rotate: 30, depth: 100, slideShadows: false }}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1.15}
          spaceBetween={24}
          pagination={{ clickable: true }}
          
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          onSwiper={onInit}
          onSlideChange={handleSlideChange}
          className=""
        >
          {slides.map((s, i) => (
            <SwiperSlide className="" key={i}>
              <div className="relative overflow-hidden h-[565px] rounded-xl">            
                <img className=" w-full h-full object-cover" src={s.img} alt="" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
   
   
  )
}

export default Ads



