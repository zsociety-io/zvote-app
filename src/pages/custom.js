import React from "react";
import { useEffect } from 'react';

import ContactForm from "../components/ContactForm";
import AOS from "aos";
import Image from "next/image";
import DefaultImage from "../components/Image";

function Custom() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div>
      <section class="hero-area-2 shape-style-3">
        <div class="bg-shape" style={{ zIndex: "-1" }}>
          <Image src={require("../img/bg-circle-6.png").default} alt="" class="animation-zoom" style={{ objectFit: "contain" }} />
          <Image src={require("../img/bg-circle-5.png").default} alt="" class="animation-top-bottom" style={{ objectFit: "contain" }} />
          <Image src={require("../img/hero-bg-round-2.png").default} alt="" />
        </div>
        <div class="container">
          <div class="row align-items-center">
            <div class="col-xxl-10 mx-auto">
              <h1>Let’s build <br /> together </h1>
              <p><strong>Collaborative work</strong> is the essence of <strong>blockchain</strong>. Working hand in hand to <br /> come up with a
                unique solution to your needs.</p>
              <a href="#contact_sec" class="theme-btn-2">Get In Touch</a>
            </div>
          </div>
        </div>
      </section>
      <section class="service-ad-area mint-proccess">
        <div class="container">
          <div class="row align-items-center">

            <div class="col-lg-6 col-8" data-aos="fade-up">
              <h1>If you can imagine it, we can help build it.</h1>
              <p>Our team is capable of <strong>helping you delivering any product</strong> you might need fir DAOs.
                Whether for a <strong>dApp interface</strong> for your DAO, <strong>custom smart contract features</strong>, a specific <strong>discord bot</strong> and more...
              </p>
              <a href="#contact_sec" class="theme-btn-2">Contact Us</a>
            </div>
            <div class="col-lg-6 col-4  text-end" data-aos="fade-up">
              <div class="main-img">
                <Image class="star" src={require("../img/star-img.png").default} alt="" />
                <Image class="img-fluid" src={require("../img/mint-proccess-icon.png").default} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </div>
  );
}

export default Custom;
