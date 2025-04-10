import { useEffect, useState } from "react";
import "./backTop.scss";
import upArrow from "./up-arrow.png";

function BackTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="backTopDiv">
      {isVisible && (
        <div className="backTopBtn" onClick={scrollToTop}>
          <img src={upArrow} className="arrowBtn" alt="Back to Top" />
        </div>
      )}
    </div>
  );
}

export default BackTop;
