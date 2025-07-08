import "./recycle.scss";
import one from "./send.png";
import two from "./style.png";
import three from "./smile.png";
import prc from "./prc.jpg";
import { useRef, useEffect } from "react";
function Recycle() {
  const recycle1_1left = useRef(null);
  const recycle1_2right = useRef(null);
  const recycle1_3left = useRef(null);
  const recycleTable = useRef(null);
  const home2left = useRef(null);
  const home2right = useRef(null);
  const collectionUp = useRef(null);
  const partnersUp = useRef(null);

  useEffect(() => {console.log("Effect running");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target;
          // console.log(entry);
          if (entry.isIntersecting) {
            if (
              entry.target === recycle1_1left.current ||
              entry.target === recycle1_3left.current
            ) {
              if (target.classList.contains("rec-new-box")) {
                target.classList.add("active-left");
              }
            }

            if (entry.target === recycle1_2right.current) {
              if (target.classList.contains("rec-new-box")) {
                target.classList.add("active-right");
              }
            }
          } else {
            target.classList.remove("active-left", "active-right");
          }
        });
      },
      { threshold: 0.5 }
    );

    const elements = [
      recycle1_1left.current,
      recycle1_2right.current,
      recycle1_3left.current,
    ];

    elements.forEach((el) => el && observer.observe(el));

    return () => {
      elements.forEach((el) => el && observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    console.log("Effect running");
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

    const recycleBoxes = recycleTable.current?.querySelectorAll(".tRowData");

    if (recycleBoxes) {
      Array.from(recycleBoxes).forEach((el, i) => {
        el.style.animationDelay = `${i * 0.2}s`; // staggered entry
        observer.observe(el);
      });
    }

    return () => {
      if (recycleBoxes) {
        Array.from(recycleBoxes).forEach((el) => {
          if (el.classList.contains("tRowData")) observer.unobserve(el);
        });
      }
    };
  }, []);

  return (
    <div className="RecyclePage">
      <div className="recycle-lower">
        <div className="recycle-content">
          <div>
            <p className="recycle-head">Steps to upcycle</p>
            <br />
            <div className="recycle-intro">
              <p className="rec-text rct">
                We proudly upcycle a variety of items, including blankets, old
                clothing (T-shirts/shirts, Indian wear, denims, sweatshirts,
                socks), towels and more. Join us in giving new life to old
                memories and creating a positive impact on the environment.
              </p>
            </div>

            <div className="rec-imgs">
              <div className="rec-new-box" ref={recycle1_1left}>
                <img className="rec-img" src={one} />
                <div className="rec-process-text ">
                  <p className="rec-head">Step 1 : SEND</p>
                  <p className="rec-text">
                    Customers send us their old materials, pet clothes, or any
                    fabric they wish to upcycle. This could be items that hold
                    sentimental value or simply things no longer in use.
                    <br />
                    Once received, we carefully assess the items to determine
                    the best way to repurpose, redesign, or alter them into
                    something fresh, sustainable, and unique for your pet.
                  </p>
                </div>
              </div>
              <div className="rec-new-box" ref={recycle1_2right}>
                <img className="rec-img scc" src={two} />
                <div className="rec-process-text">
                  <p className="rec-head">Step 2 : STYLE</p>
                  <p className="rec-text">
                    After receiving the materials, we creatively design and
                    style them based on your preferences.
                    <br />
                    Whether it’s repurposing fabrics into customized pet
                    clothing, accessories, or other products, we focus on making
                    each item unique, stylish, and functional while maintaining
                    sustainability.
                  </p>
                </div>
              </div>
              <div className="rec-new-box" ref={recycle1_3left}>
                <img className="rec-img" src={three} />
                <div className="rec-process-text">
                  <p className="rec-head">Step 3 : SMILE</p>
                  <p className="rec-text">
                    Once your upcycled item is ready, we deliver it back to you,
                    bringing joy and satisfaction with a one-of-a-kind,
                    eco-friendly creation that you and your pet will love!
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="recycle-process">
                            <div className="rec-left">

                                <div className="rec-process-text">
                                    <p className="rec-head">
                                        Step 1 : SEND
                                    </p>
                                    <p className="rec-text">
                                        Send us any material that holds sentimental value or is simply lying around unused. We encourage you to send it to us and begin the recycling process.
                                    </p>
                                </div>
                            </div>
                            <div className="rec-left rr">

                                <div className="rec-process-text">
                                    <p className="rec-head">
                                        Step 2 : STYLE
                                    </p>
                                    <p className="rec-text">
                                        We discuss various options, considering factors such as functionality, aesthetics, and the specific requirements of the pet. Whether it's a cozy bed, a durable toy, or a stylish accessory, we work closely with you to ensure that the final design reflects your vision and exceeds expectations.
                                    </p>
                                </div>
                            </div>
                            <div className="rec-left">

                                <div className="rec-process-text">
                                    <p className="rec-head">
                                        Step 3 : SMILE
                                    </p>
                                    <p className="rec-text">
                                        As you unwrap the package, you are greeted with a custom creation, crafted with care and creativity. It's a heartwarming moment that highlights the joy of sustainable pet ownership and the happiness that comes from giving old materials new life.
                                    </p>
                                </div>
                            </div>
                        </div> */}
          </div>

          <div className="rec-details">
            <p className="recycle-head ">The ReTail Process</p>
            <br />

            <div className="recycle-iframe-box"></div>

            <img className="prc" src={prc} />

            <p className="rec-text rct">
              At ReTail Project, we've streamlined the process of transforming
              customers' old fabrics or blankets into new, eco-friendly delights
              for their pets. Here's how it works:
            </p>
            <br />
            <table className="table-details" ref={recycleTable}>
              <tr className="tRowData">
                <td className="tRowNum">1</td>
                <td className="tRowHead">Submission : </td>
                <td className="tRowTxt">
                  Customers send us their old raw materials, such as fabrics or
                  blankets, expressing their desire to recycle and repurpose
                  them.
                </td>
              </tr>
              <tr className="tRowData">
                <td className="tRowNum">2</td>
                <td className="tRowHead">Assessment : </td>
                <td className="tRowTxt">
                  Our team carefully examines the submitted materials to ensure
                  they align with our sustainability standards and can be
                  effectively repurposed.
                </td>
              </tr>
              <tr className="tRowData">
                <td className="tRowNum">3</td>
                <td className="tRowHead">Design Consultation :</td>
                <td className="tRowTxt">
                  We engage with customers to understand their preferences and
                  pet's needs, ensuring the final product is not only
                  sustainable but also tailored to their style and pet's
                  comfort.
                </td>
              </tr>
              <tr className="tRowData">
                <td className="tRowNum">4</td>
                <td className="tRowHead">Crafting :</td>
                <td className="tRowTxt">
                  Skilled artisans transform the recycled materials into stylish
                  and functional pet clothing, toys, or accessories,
                  incorporating the customer's unique touch.
                </td>
              </tr>
              <tr className="tRowData">
                <td className="tRowNum">5</td>
                <td className="tRowHead">Quality Check :</td>
                <td className="tRowTxt">
                  Each item undergoes rigorous quality checks to guarantee
                  durability, safety, and adherence to our environmental values.
                </td>
              </tr>
              <tr className="tRowData">
                <td className="tRowNum">6</td>
                <td className="tRowHead">Delivery :</td>
                <td className="tRowTxt">
                  The customized, sustainable pet products are sent back to the
                  customer, completing the cycle of transforming old materials
                  into new, conscientious creations for their furry companions.
                </td>
              </tr>
            </table>

            <br />
            <p className="rec-text table-details table-details-color">
              Connect with us on{" "}
              <a href="https://wa.me/+919664149148" className="boldTxt">
                WhatsApp
              </a>{" "}
              to discuss the transformation.
              <br /> Our team is ready to make adjustments according to your
              dog's size and any specific preferences you may have.
              <br />
              <br />
              <span className="boldTxt boldAnimation">
                ' Tailor your pet's fashion sustainably with ReTail Project. '
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recycle;
