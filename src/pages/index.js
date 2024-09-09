import Head from 'next/head'
import Image from 'next/image'

import Link from 'next/link'

import React from "react";
import { useEffect } from 'react';

import AOS from "aos";
import Typed from 'typed.js';

import ContactForm from "../components/ContactForm.jsx";


function Home() {
  const typedHero = React.useRef(null);

  React.useEffect(() => {
    AOS.init();
    const typed = new Typed(typedHero.current, {
      strings: ["private", "custom", "updatable"],
      typeSpeed: 70,
      backSpeed: 25,
      loop: true,
      backDelay: 1200,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <div>
      <section className="hero-area-2 pb-0 home-hero">
        <div className="bg-shape" style={{ zIndex: "-1" }}>
          <Image src={require("../img/bg-circle-1.png").default} style={{ objectFit: "contain" }} />
          <Image src={require("../img/bg-circle-2.png").default} style={{ objectFit: "contain" }} />
          <Image src={require("../img/hero-bg-round.png").default} style={{ objectFit: "contain" }} />
        </div>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xxl-10 mx-auto">
              <h1>Let's create your <br /><span ref={typedHero}></span> DAO.</h1>
              <p><strong>launchpad</strong> for creating private decentralised organisation, on <strong>Aleo</strong>.<br />
                Full customization of both <strong>smart contract</strong> and <strong>frontend</strong>.
              </p>
              <a
                href="/profile"
                className="theme-btn-2"
              >
                Get Started
              </a>
            </div>

            <div className="col-12 mt-5">
              <Image className="img-fluid" src={require("../img/hero-2-character.png").default} />
            </div>

          </div>
        </div>
      </section >
      <section className="title-wbg">
      </section>

      <section className="feature-area-2">
        <div className="container">
          <div className="row gy-lg-0 gy-4">
            <div className="col-lg-4">
              <Link className="feature-box-2" href="/launchpad" data-aos="fade-up">
                <>
                  <Image src={require("../img/feature-1.svg").default} />
                  <h2>DAO Launchpad</h2>
                  <p>Create your own <strong>DAO</strong> in just a few click.
                    No need for smart contract developement, <strong>it is ready right out of the box</strong>.</p>
                  <span>Get Started</span>
                </>
              </Link>
            </div>
            <div className="col-lg-4">
              <Link className="feature-box-2" href="/bot" data-aos="fade-up">
                <>
                  <Image src={require("../img/feature-2.svg").default} />
                  <h2>Discord Bots</h2>
                  <p>Use discord as an <strong>interface for your DApp.</strong>Leverage token: gated roles and channels, proposal and suggestion management, customized annoucements.</p>
                  <span>Get Started</span>
                </>
              </Link>
            </div>
            <div className="col-lg-4">
              <Link className="feature-box-2" href="#contact_sec" data-aos="fade-up">
                <>
                  <Image src={require("../img/feature-3.svg").default} />
                  <h2>Custom Features</h2>
                  <p>If you can <strong>imagine it</strong> we can <strong>build it</strong>. Ask for your most ambitious <strong>voting systems, user interfaces, or smart contract</strong> features. We can help you build it.</p>
                  <span>Get Started</span>
                </>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="service-ad-area blue-bg">
        <Image className="sec-img animation-zoom" src={require("../img/service-ad-1.png").default} />
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-4" data-aos="fade-up">
              <Image className="mln-60 img-fluid" src={require("../img/service-ad-1-icon-converted.png").default} />
            </div>
            <div className="col-lg-6 col-8" data-aos="fade-up">
              <h1>From <a target="__blank" style={{
                color: "rgb(10, 9, 61)",
                textDecoration: "underline"
              }} href="https://zsolutions.io">zSolutions.io</a> suite</h1>
              <p>We build <strong>ZK applications and tools</strong> on Aleo <strong>to get the best</strong> to their questions <strong>at any time</strong>. We are
                always reachable on <strong>discord</strong> or <strong>twitter</strong> for any issue or question of any kind. </p>
              <a target="__blank" className="theme-btn-2" href="https://github.com/zsolutions-io/zvote">Open Github</a>
            </div>
          </div>
        </div>
      </section>

      <section className="service-ad-area mint-proccess" id="our_vision">
        <div className="container">
          <div className="row align-items-center">

            <div className="col-lg-6 col-8" data-aos="fade-up">
              <h1>Our vision</h1>
              <p>
                Our goal is to bring privacy into DAOs by providing a simple but <strong>powerful framework</strong>.
                The motivation behind zVote design is to <strong>encourage, DAOs and developers to propose their own implementation of its components.</strong>
                Communities can then vote to upgrade their DAO to the most suitable implementations according to their specific use cases.
              </p>
              <a href="#contact_sec" className="theme-btn-2">Meet Us</a>
            </div>
            <div className="col-lg-6 col-4 text-end" data-aos="fade-up">
              <div className="main-img">
                <Image className="star" src={require("../img/star-img.png").default} />
                <Image className="img-fluid" src={require("../img/vision-img-icon-converted.png").default} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactForm />
    </div >
  );
}

export default Home;

