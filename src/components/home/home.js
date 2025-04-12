// Main Home Page

//Importing Images, Stylesheets and Components
import "./home.scss";
import backOne from "./home-back-one.jpg";
import backTwo from "./home-back-two.jpg";
import csp from "./scissors.png";
import sustainable from "./renewal.png";
import corder from "./review.png";
import handc from "./tailoring.png";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import loadImg from "./pawb.png";
import logo from "../nav/pawb.png";
import like from "../shop/like.png";
import liked from "../shop/liked.png";
import cartH from "../shop/cartHollow.png";
import cartF from "../shop/cartFilled.png";
import satisfiedCustomers from "./satisfiedCustomers.png";
import followersImg from "./followersImg.png";
import Client1 from "./Client1.jpeg";
import Client2 from "./Client2.jpeg";
import Client3 from "./Client3.jpeg";
import { useRef } from "react";
import Productcard from "../product-card/Productcard";

function NextArrow(props) {
  const { onClick } = props;
  return (
    <img
      src={require("./next.png")}
      onClick={onClick}
      alt=""
      className="transformed"
    />
  );
}

function PrevArrow(props) {
  const { onClick } = props;
  return (
    <img
      src={require("./next.png")}
      onClick={onClick}
      alt=""
      className="transformed transformedR"
    />
  );
}

function NextArrowHome(props) {
  const { onClick } = props;
  return (
    <img
      src={require("./next.png")}
      onClick={onClick}
      alt=""
      className="transformed transformedR thh"
    />
  );
}

function PrevArrowHome(props) {
  const { onClick } = props;
  return (
    <img
      src={require("./next.png")}
      onClick={onClick}
      alt=""
      className="transformed  thh thhr"
    />
  );
}

function Home() {
  // reference to components
  const counterRef1 = useRef(null);
  const counterRef2 = useRef(null);
  const home1left = useRef(null);
  const home1right = useRef(null);
  const home2left = useRef(null);
  const home2right = useRef(null);
  const collectionUp = useRef(null);
  const partnersUp = useRef(null);

  const [hasStarted, setHasStarted] = useState(false);

  // counter to show counting animation in review box
  function startCounter(ref, targetValue, speed) {
    let current = 0;

    function updateCounter() {
      if (ref.current) {
        ref.current.innerHTML = current + "+";
      }
      if (current < targetValue) {
        current++;
        setTimeout(updateCounter, speed); // Controls the counting speed
      }
    }

    updateCounter(); // Start the counter
  }

  //animation for home division 2 and 3, also the counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target;

          if (entry.isIntersecting) {
            if (target.classList.contains("home-main-div-left")) {
              target.classList.add("active-left");
            }
            if (target.classList.contains("home-main-div-right")) {
              target.classList.add("active-right");
            }

            if (
              !hasStarted &&
              (target === counterRef1.current || target === counterRef2.current)
            ) {
              startCounter(counterRef1, 100, 25);
              startCounter(counterRef2, 150, 5);
              setHasStarted(true);
            }
          } else {
            target.classList.remove("active-left", "active-right");
          }
        });
      },
      { threshold: 0.5 }
    );

    const elements = [
      counterRef1.current,
      counterRef2.current,
      home1left.current,
      home1right.current,
      home2left.current,
      home2right.current,
    ];

    elements.forEach((el) => el && observer.observe(el));

    return () => {
      elements.forEach((el) => el && observer.unobserve(el));
    };
  }, [hasStarted]);

  //loader animation
  useEffect(() => {
    setTimeout(() => {
      const loader = document.querySelector(".loader-container");
      const hero = document.querySelector(".Hero");

      if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.display = "none";
        }, 1000);
      }

      if (hero) {
        hero.style.opacity = "1";
      }
    }, 500);
  }, []);

  //aniamtion to make division-up
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target;

          if (entry.isIntersecting) {
            el.classList.add("active-collection");
          } else {
            el.classList.remove("active-collection"); // Optional: remove if you want re-animation
          }
        });
      },
      { threshold: 0.4 }
    );

    const colBoxes = collectionUp.current?.querySelectorAll(".collection");
    const partnerBoxes = partnersUp.current?.querySelectorAll(
      ".testimonials-ClientLogo"
    );

    if (colBoxes) {
      Array.from(colBoxes).forEach((el, i) => {
        el.style.animationDelay = `${i * 0.2}s`; // staggered entry
        observer.observe(el);
      });
    }
    if (partnerBoxes) {
      Array.from(partnerBoxes).forEach((el, i) => {
        el.style.animationDelay = `${i * 0.2}s`; // staggered entry
        observer.observe(el);
      });
    }

    return () => {
      if (colBoxes) {
        Array.from(colBoxes).forEach((el) => {
          if (el.classList.contains("testimonials-ClientLogo"))
            observer.unobserve(el);
        });
      }
      if (partnerBoxes) {
        Array.from(partnerBoxes).forEach((el) => {
          if (el.classList.contains("testimonials-ClientLogo"))
            observer.unobserve(el);
        });
      }
    };
  }, []);

  //slides array of objects defined
  const slides = [
    { img: "slide-one-before.jpg", img2: "slide-one-after.jpg" },
    { img: "slide-two-before.jpg", img2: "slide-two-after.jpg" },
    { img: "slide-three-before.jpg", img2: "slide-three-after.jpg" },
    { img: "slide-four-before.jpg", img2: "slide-four-after.jpg" },
    { img: "slide-five-before.jpg", img2: "slide-five-after.jpg" },
    { img: "slide-six-before.jpg", img2: "slide-six-after.jpg" },
  ];

  //settings for slick-slider transformations
  const settingsT = {
    // dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 5000,
  };

  //settings for slick-slider home-slider
  const settingsF = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 2000,
    arrows: true,
  };

  //array of objects for main Slider - holds information
  const mainSlider = [
    {
      img: require("./home-one.jpg"),
      title1: "Custom",
      title2: "Tailoring",
    },
    {
      img: require("./home-two.JPG"),
      title1: "Preserve",
      title2: "Memories",
    },
    {
      img: require("./home-three.jpg"),
      title1: "Sustainable",
      title2: "Pet Fashion",
    },
    {
      img: require("./home-four.jpg"),
      title1: "Made with",
      title2: "Love & Care",
    },
  ];

  const reviewSlider = [
    {
      img: require("./home-one.jpg"),
      review:
        "1- Lorem ipsumjb binrbienr rivnrjineir ejfnswe nruinriune einwuieniuwen enijneriugneui enfjeni nur roignu riugnriu rniru",
    },
    {
      img: require("./home-two.JPG"),
      review:
        "2-  ipsumjb binrbienr rivnrjineir ejfnswe nruinriune einwuieniuwen enijneriugneui enfjeni nur roignu riugnriu rniru",
    },
    {
      img: require("./home-three.jpg"),
      review:
        "3 - Lorem ipsumjb binrbienr rivnrjineir ejfnswe nruinriune einwuieniuwen enijneriugneui enfjeni nur roignu riugnriu rniru",
    },
    {
      img: require("./home-four.jpg"),
      review:
        "4- Lorem ipsumjb binrbienr rivnrjineir ejfnswe nruinriune einwuieniuwen enijneriugneui enfjeni nur roignu riugnriu rniru",
    },
  ];

  return (
    <div className="Home">
      {/* loader container */}
      <div className="loader-container">
        <img src={loadImg} className="heart" />
        <p className="HomeHead1">Welcome to The ReTail Project!!</p>
      </div>
      {/* slider container - home division 1 */}
      <Slider {...settingsF} className="SliderCusHome">
        {mainSlider.map((m, index) => (
          <div
            key={index}
            className="slider-maincus"
            style={{ backgroundImage: `url(${m.img})` }}
          >
            <div
              className="slider-maincus-flex"
              style={{ backgroundImage: `url(${m.img})` }}
            >
              <div className="slider-maincus-flex-col1">
                <p className="main-slider-captioncus1">{m.title1}</p>
                <p className="main-slider-captioncus2">{m.title2}</p>
                <Link to="/shop">
                  <button className="main-slider-buttoncus">Explore Now</button>
                </Link>
              </div>
              <img
                src={m.img}
                alt=""
                className="slider-main-imgcus display-none"
              />
            </div>
          </div>
        ))}
      </Slider>

      {/* rest of the homepage */}
      <div className="Hero">
        <div className="hero-lower">
          <div className="home-main">
            {/* home-division-2 */}
            <div className="home-main-div">
              <div ref={home1left} className="home-main-div-left">
                <img className="main-div-back hbone" src={backOne} />
              </div>
              <div ref={home1right} className="home-main-div-right">
                <p className="home-main-head">Who We Are ?</p>
                <p className="main-text">
                  The ReTail Project is a conscious pet brand that customizes
                  pet clothing, accessories, bedding and toys offering
                  eco-friendly, personalized designs.
                  <br />
                  <br />
                  With our own product range and a focus on upcycling, we bring
                  sustainability and style together for pet parents who care
                  about the planet.
                </p>
                <Link to="/about-us">
                  <button className="read-more">Read more</button>
                </Link>
              </div>
            </div>

            {/* home-division-3 */}
            <div className="htwoow">
              <div className="home-main-div htwoowContent">
                <div ref={home2left} className="home-main-div-right ">
                  <p className="home-main-head whiteContent">What We Do ?</p>
                  <p className="main-text whiteContent">
                    The ReTail Project is all about giving pet parents the
                    opportunity to breathe new life into their pre-owned items
                    by transforming them into customized, eco-friendly products
                    for their pets.
                    <br />
                    <br />
                    We take materials that would otherwise go unused and upcycle
                    them into unique, tailor-made pet products. This way, we not
                    only help reduce waste but also create a stronger connection
                    with our community, as each product is personal
                    and sustainable.
                  </p>
                  <Link to="/how-to-recycle">
                    <button className="read-more yellowBorder ">
                      Read more
                    </button>
                  </Link>
                </div>
                <div ref={home2right} className="home-main-div-left hmltt">
                  <img
                    className="main-div-back hbone htwoImage"
                    src={backTwo}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* <div className="home-features">


                        <div className="home-features-left-box">
                            <p className="home-main-head fhmm">Our Features</p>

                            <div className="home-features-new-ssd">
                                <div className="feature">
                                    <img className="fimg" src={sustainable} />
                                    <p className="fname">
                                        Sustainable
                                    </p>

                                </div>
                                <div className="feature">
                                    <img className="fimg" src={handc} />
                                    <p className="fname">
                                        Handcrafted
                                    </p>

                                </div>
                                <div className="feature">
                                    <img className="fimg" src={csp} />
                                    <p className="fname">
                                        Craftsmenship
                                    </p>

                                </div>
                                <div className="feature">
                                    <img className="fimg" src={corder} />
                                    <p className="fname">
                                        Custom Order
                                    </p>

                                </div>
                            </div>

                        </div>



                    </div> */}
          {/* collection box - home-division-4 */}
          <div className="collection-box">
            <p className="home-main-head">Our Collections</p>
            <div className="collections" ref={collectionUp}>
              <Link to="/shop/wear">
                <div className="collection wear">
                  <p className="coltext">WEAR</p>
                </div>
              </Link>
              <Link to="/shop/walk">
                <div className="collection walk">
                  <p className="coltext ">WALK</p>
                </div>
              </Link>
              <Link to="/shop/play">
                <div className="collection coplay">
                  <p className="coltext ">PLAY</p>
                </div>
              </Link>
              <Link to="/shop/sleep">
                <div className="collection sleep">
                  <p className="coltext ">SLEEP</p>
                </div>
              </Link>
              <Link to="/shop/preserve">
                <div className="collection sleep">
                  <p className="coltext ">PRESERVE</p>
                </div>
              </Link>
            </div>
          </div>

          {/* transformations - home-division-4 */}
          <div className="transformations">
            <p className="home-main-head">Our Transformations</p>

            <Slider {...settingsT} className="slick-slider-custom">
              {slides.map((s) => (
                <div className="slick-slide-custom">
                  <div className="slide-left">
                    <img
                      className="slide-left-img"
                      src={require(`./${s.img}`)}
                    />
                    <p className="before">
                      <img src={logo} className="transformationLogo" />
                      Before
                    </p>
                  </div>

                  <div className="slide-right">
                    <img
                      className="slide-left-img"
                      src={require(`./${s.img2}`)}
                    />
                    <p className="after">
                      <img src={logo} className="transformationLogo" />
                      After
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* featured-products-box - home-division-4 */}
          <div className="featured-products-box">
            <div className="home-main-head">Our Bestsellers</div>
            <div className="featured-products">
              <Productcard />
            </div>
          </div>

          {/* our-testimonials-box - home-division-4 */}
          <div className="our-testimonials-box">
            <div className="our-testimonials-component">
              <div className="testimonials-row1">
                <p className="home-main-head">Our Testimonials</p>
              </div>
              <div className="testimonials-row2">
                <div className="testimonials-row1-col1">
                  <div className="satisfiedCustomersCol">
                    <div className="borderImg">
                      <img
                        src={satisfiedCustomers}
                        className="testimonials-smallLogo"
                      />
                    </div>
                    <>
                      <p
                        className="satisfiedCustomersNumber"
                        id="counter1"
                        ref={counterRef1}
                      >
                        0
                      </p>
                      +
                    </>
                  </div>
                  <div className="satisfiedCustomersCol">
                    <div className="borderImg">
                      <img
                        src={followersImg}
                        className="testimonials-smallLogo"
                      />
                    </div>
                    <>
                      <p
                        className="satisfiedCustomersNumber"
                        id="counter2"
                        ref={counterRef2}
                      >
                        0
                      </p>
                      +
                    </>
                  </div>
                </div>
                <Slider {...settingsF} className="testimonials-row1-col2">
                  {reviewSlider &&
                    reviewSlider.map((review, index) => (
                      <div className="reviewSliderDiv" key={index}>
                        <img
                          src={Client1}
                          className="testimonials-smallLogo"
                          alt="review"
                        />
                        <div className="reviewBox">
                          {" "}
                          <p className="clientReviewText">{review.review}</p>
                        </div>
                      </div>
                    ))}
                </Slider>
              </div>
              <div className="testimonials-row3">
                <p className="testimonials-row3-head ">
                  Our Upcycling Partners
                </p>
                <div className="testimonials-row3-row2" ref={partnersUp}>
                  <img src={Client1} className="testimonials-ClientLogo" />
                  <img src={Client2} className="testimonials-ClientLogo" />
                  <img src={Client3} className="testimonials-ClientLogo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
