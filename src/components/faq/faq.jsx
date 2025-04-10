import { useEffect, useState } from "react";
import "./faq.scss";
import faqs from "./faq.json";
import showi from "./showi.png";
import { useRef } from "react";
function FAQQ() {
  const faqBoxes = useRef(null);
  const [openfaqs, setopenfaqs] = useState([]);

  useEffect(() => {
    faqs.map((f) => {
      if (openfaqs.includes(f.id)) {
        document.getElementById(f.id).style.display = "flex";
        document.getElementById(f.checkId).style.rotate = "180deg";
      } else {
        document.getElementById(f.id).style.display = "none";
        document.getElementById(f.checkId).style.rotate = "0deg";
      }
    });
  }, [openfaqs]);

  const handleOpenFaq = (faqId) => {
    setopenfaqs((prev) => {
      // Check if the FAQ is already open
      if (prev.includes(faqId)) {
        // If it's open, remove it from the list (close it)
        return prev.filter((id) => id !== faqId);
      } else {
        // If it's closed, add it to the list (open it)
        return [...prev, faqId];
      }
    });
  };

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

    const faqBox = faqBoxes.current?.querySelectorAll(".faq");

    if (faqBox) {
      Array.from(faqBox).forEach((el, i) => {
        el.style.animationDelay = `${i * 0.2}s`; // staggered entry
        observer.observe(el);
      });
    }

    return () => {
      if (faqBox) {
        Array.from(faqBox).forEach((el) => {
          if (el.classList.contains("faq")) observer.unobserve(el);
        });
      }
    };
  }, []);

  return (
    <div className="FAQ">
      <div className="faq-box">
        <p className="faq-head-n">FAQs</p>
        <div className="faqs" ref={faqBoxes}>
          {faqs.map((f) => (
            <div className="faq">
              <div
                onClick={() => {
                  handleOpenFaq(f.id);
                }}
                className="ques-sec"
              >
                <p className="faq-ques">{f.question}</p>
                <img id={f.checkId} src={showi} alt="" className="showimg" />
              </div>
              <p id={f.id} className="faq-ans">
                {f.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FAQQ;
