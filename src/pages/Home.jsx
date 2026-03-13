import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, FreeMode, Mousewheel } from 'swiper/modules';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { FaMobileAlt, FaLaptop, FaClock, FaCamera, FaHeadphones, FaGamepad } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import './Home.css';
import swiper1 from '../img/swiper1.jpg';
import swiper2 from '../img/swiper2.jpg';
import swiper3 from '../img/swiper3.jpg';
import swiper4 from '../img/swiper4.jpg';
import rectagle17 from '../img/Rectangle 17.svg'
import ProductCard from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../products';
import frame from '../img/Frame 600.png';
import jbl from '../img/jbl1.png'
import ps5 from '../img/ps5.png'
import woman from '../img/woman.png'
import speaker from '../img/speaker.png'
import perfume from '../img/perfume.png'
import service1 from '../icons/Services.png'
import service2 from '../icons/Services1.png'
import service3 from '../icons/Services2.png'
import Footer from '../components/Footer';
import CountdownTimer from '../components/CountdownTimer';
import { useStoreSettings } from '../context/StoreContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home = ({onAddToCart}) => {
  const navigate = useNavigate();
  const { storeSettings } = useStoreSettings();
  
  const targetDate = storeSettings.promo_banner?.countdown_date 
    ? new Date(storeSettings.promo_banner.countdown_date) 
    : (() => {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        return d;
      })();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`*, categories(name)`)
        .order('created_at', { ascending: false })
        .limit(12);
        
      if (error) throw error;
      setProducts(data || []);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Categories mapping for sidebar
  const categories = [
    { name: "Smartphones", query: "Smartphones" },
    { name: "Laptops & Computing", query: "Laptops & Computing" },
    { name: "Audio & Speakers", query: "Audio & Speakers" },
    { name: "Gaming", query: "Gaming" },
    { name: "Smartwatches", query: "Smartwatches" },
    { name: "Cameras & Photography", query: "Cameras & Photography" },
    { name: "Tablets", query: "Tablets" },
    { name: "Computer Accessories", query: "Computer Accessories" },
    { name: "Home Automation", query: "Home Automation" },
    { name: "Monitors & Displays", query: "Monitors & Displays" },
  ];

  const heroRef = useRef(null);

  useGSAP(() => {
    if (!heroRef.current) return;

    // Initial Hero Entrance
    const tl = gsap.timeline();
    tl.from('.desktop-nav', {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }).from('.main-swiper', {
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: 'power3.out'
    }, "-=0.6");

    // Scroll-triggered section animations
    const sections = ['.today', '.category', '.ourproduct', '.newarival', '.service'];
    
    sections.forEach(sec => {
      gsap.from(sec, {
        scrollTrigger: {
          trigger: sec,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

  }, { scope: heroRef });

  return (
    <div ref={heroRef}>
      <div className='top'>
        <div className='navigation desktop-nav'>
          <ul>
            {categories.map((cat, idx) => (
              <li key={idx}>
                <Link to={`/products?category=${encodeURIComponent(cat.query)}`} className="nav-link">
                  {cat.name} <MdKeyboardArrowRight />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className='swiper' id='swip'>
          <Swiper
            className="main-swiper"
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={true}
          >
            {storeSettings.hero_images && storeSettings.hero_images.length > 0 ? (
              storeSettings.hero_images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={img} alt={`Slide ${idx + 1}`} fetchPriority={idx === 0 ? "high" : "auto"} loading={idx === 0 ? "eager" : "lazy"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </SwiperSlide>
              ))
            ) : (
              <>
                <SwiperSlide>
                  <img src={swiper1} alt="Slide 1" fetchPriority="high" loading="eager" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </SwiperSlide>
                <SwiperSlide>
                  <img src={swiper2} alt="Slide 2" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </SwiperSlide>
              </>
            )}
          </Swiper>
        </div>
      </div>
      
      <div className='today'>
        <div className='flash_sale'>
          <div className='flhead'>
            <img src={rectagle17} alt="" aria-hidden="true" />
            <h2>Today's</h2>
          </div>
          <div className='flbody'>
            <h2>Flash Sale</h2>
            <CountdownTimer targetDate={targetDate} />
          </div>
        </div>
        
        <div className='productm'>
          <Swiper
            modules={[FreeMode, Mousewheel]}
            slidesPerView={2}
            breakpoints={{
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4},
            }}
            spaceBetween={0}
            freeMode={true}
            mousewheel={true}
            grabCursor={true}
            resistance={true} 
            resistanceRatio={0.5}
            className="products-swiper"
          >
            {loading ? (
              <p className="p-4 text-gray-500 font-poppins">Loading products...</p>
            ) : products.length > 0 ? (
              products.map((item) => (
                <SwiperSlide key={item.id} className='swiper'>
                  <ProductCard product={item} onAddToCart={onAddToCart}/>
                </SwiperSlide>
              ))
            ) : (
                <p className="p-4 text-gray-500 font-poppins">No products running on flash sale right now.</p>
            )}
          </Swiper>
          <button className='viewall' onClick={() => navigate('/products')}>View All Products</button>
        </div>

        <div className='category'>
          <div className='cathead'>
            <img src={rectagle17} alt="" aria-hidden="true" />
            <h2>Category</h2>
          </div>
          <p>Browse by Category</p>
          <div className='Catbody'>
            <div className='Catmenu'>
              <div className='cat-item' onClick={() => navigate('/products?category=Smartphones')}>
                <FaMobileAlt className='cat-icon' />
                <span>Smartphones</span>
              </div>
              <div className='cat-item' onClick={() => navigate('/products?category=Laptops%20%26%20Computing')}>
                <FaLaptop className='cat-icon' />
                <span>Laptops</span>
              </div>
              <div className='cat-item' onClick={() => navigate('/products?category=Smartwatches')}>
                <FaClock className='cat-icon' />
                <span>Smartwatch</span>
              </div>
              <div className='cat-item' onClick={() => navigate('/products?category=Cameras%20%26%20Photography')}>
                <FaCamera className='cat-icon' />
                <span>Camera</span>
              </div>
              <div className='cat-item' onClick={() => navigate('/products?category=Audio%20%26%20Speakers')}>
                <FaHeadphones className='cat-icon' />
                <span>Audio</span>
              </div>
              <div className='cat-item' onClick={() => navigate('/products?category=Gaming')}>
                <FaGamepad className='cat-icon' />
                <span>Gaming</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className='category'>
          <div className='cathead'>
            <img src={rectagle17} alt="" />
            <h1>This Month</h1>
          </div>
          <div className='catheadd'>
            <p>Best Selling Products</p>
            <button className='viewall' onClick={() => navigate('/products')}>View All Products</button>
          </div>
          
          <div className='productm'>
            <Swiper
              modules={[FreeMode, Mousewheel]}
              slidesPerView={2}
              breakpoints={{
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 }
              }}
              spaceBetween={0}
              freeMode={true}
              mousewheel={true}
              grabCursor={true}
              resistance={true}
              resistanceRatio={0.5}
              className="products-swiper"
            >
              {loading ? (
                <p className="p-4 text-gray-500 font-poppins">Loading products...</p>
              ) : products.length > 0 ? (
                // Only show top 4 products for "This Month"
                products.slice(0,4).map((item) => (
                  <SwiperSlide key={item.id}>
                    <ProductCard product={item} onAddToCart={onAddToCart} />
                  </SwiperSlide>
                ))
              ) : (
                 <p className="p-4 text-gray-500 font-poppins">No best selling products right now.</p>
              )}
            </Swiper>
          </div>

          {/* Dynamic Promo Banner */}
          <div className='Catbestproduct' style={{ 
            backgroundImage: `url(${storeSettings.promo_banner?.background_url || frame})`,
            backgroundColor: '#000' 
          }}>
            <div className='content'>
              <p style={{ color: '#00ff66', fontWeight: 600 }}>{storeSettings.promo_banner?.category || 'category'}</p>
              <h1>{storeSettings.promo_banner?.title || 'Enhance Your Music Experience'}</h1>
              <CountdownTimer targetDate={targetDate} />
              <button onClick={() => navigate('/products')}>
                {storeSettings.promo_banner?.button_text || 'Buy Now'}
              </button>
            </div>
            <div className='image'>
              <img 
                src={storeSettings.promo_banner?.image_url || jbl} 
                alt="Promo" 
                loading="lazy"
                className='jbl'
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800";
                }}
              />
            </div>
          </div>
        </div>

        <div className='ourproduct'>
          <div className='ophead'>
            <img src={rectagle17} alt="" />
            <h1>Our Product</h1>
          </div>
          <div className='opheadd'>
            <p>Explore Our Products</p>
          </div>
          <div className='productm our-products-grid'>
            {loading ? (
               <p className="p-4 text-gray-500 font-poppins">Loading products...</p>
            ) : products.length > 0 ? (
              products.slice(0, 20).map((item, index) => (
                <ProductCard key={index} product={item} onAddToCart={onAddToCart} />
              ))
            ) : (
                <p className="p-4 text-gray-500 font-poppins">Check back later for new products.</p>
            )}
          </div>
          <button className='viewall' onClick={() => navigate('/products')}>View All Products</button>
        </div>

        <div className='featured'>
          <div className='fehead'>
            <img src={rectagle17} alt="" />
            <h1>Fetured</h1>
          </div>
          <div className='feheadd'>
            <p className="new-arival-title">New Arival</p>
          </div>
        </div>
        
        <div className='newarival'>
          <div className='naleft'>
            <img src={ps5} alt="" loading="lazy" className='ps55'/>
            <div className='nacontent'>
              <h2>Playstation 5</h2>
              <p>Balck and Whiteversion of the Ps5 coming out on sale</p>
              <span>Shop Now</span>
            </div>
          </div>
          <div className='naright'>
            <div className='row'>
              <div className='cols'>
                <div className='nrcontent'>
                  <h2>Women's Collection</h2>
                  <p>Featured womancollection that gives you another vibe.</p>
                  <span>Show Now</span>
                </div>
              </div>
              <div className='cols'>
                <img src={woman} alt="" loading="lazy" className='woman' />
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <img src={speaker} alt="" loading="lazy" />
                <div className='nrcontent'>
                  <h2>Speakers</h2>
                  <p>Amazon wireless speakers</p>
                  <span>Show Now</span>
                </div>
              </div>
              <div className='col'>
                <img src={perfume} alt="" loading="lazy" />
                <div className='nrcontent'>
                  <h2>Perfume</h2>
                  <p>GUCCI INTENSE OUD EDP</p>
                  <span>Show Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className='service'>
          <div className='row'>
            <div className='col'>
              <img src={service1} alt="" />
              <h2>MONEY BANK GUARANTEED</h2>
              <p>We return money back within 30days</p>
            </div>
            <div className='col'>
              <img src={service2} alt="" />
              <h2>24/7 CUSTOMER SERVICE</h2>
              <p>Friendly 24/7cutomer support</p>
            </div>
            <div className='col'>
              <img src={service3} alt="" />
              <h2>FAST & FREE DELIVERY</h2>
              <p>Free shipping on all orders over ₦50,000</p>
            </div>
          </div>
        </div>
        
        <div className='footer' style={{marginTop: '4rem'}}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Home;
