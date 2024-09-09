import React from "react";
import { useEffect, useState } from 'react';
import ContactForm from "../components/ContactForm";
import AOS from "aos";
import Image from "next/image";

import DefaultImage from "../components/Image.jsx";

function Bot() {
  React.useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div>
      <section class="hero-area">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-xxl-6 col-lg-7 order-lg-1 order-2 text-lg-start text-center">
              <h1>Turn your <span class="underline">Discord</span><br />into a <span class="underline">DAO DApp</span></h1>
              <p>With <strong>zBot</strong> you can manage your <strong>DAO</strong> and organize votes direclty on your discord. zBot is <strong>100% automated, autonomous and easily configurable</strong>.
              </p>
              <div class="row align-items-center">
                <div class="col-xl-6">
                  <div class="info">
                    <Image src={require("../img/clock-icon.svg").default} alt="" /> Instant access
                  </div>
                  <div class="info">
                    <Image src={require("../img/atom.svg").default} alt="" /> Free
                  </div>
                  <div class="info">
                    <Image src={require("../img/chat.svg").default} alt="" /> Discord 24/7
                  </div>
                </div>
                <div class="col-xl-6">
                  <a class="theme-btn-2" href="#"> Get it now </a>
                </div>
              </div>
            </div>
            <div class="col-xxl-6 col-lg-4 text-center order-lg-2 order-1 offset-lg-1 offset-xxl-0">
              <div class="hero-img">
                <div class="feature-info">
                  <Image src={require("../img/hero-info-1.png").default} alt="" />
                  <Image src={require("../img/hero-info-2.png").default} alt="" />
                  <Image src={require("../img/hero-info-3.png").default} alt="" />
                  <Image src={require("../img/hero-info-4.png").default} alt="" />
                </div>
                <svg class="img-fluid" width="240" height="300" viewBox="0 0 298 376" fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <rect width="21.949" height="157.16" rx="10.9745"
                    transform="matrix(-1 0 0 1 61.6261 171.524)" fill="#172863" />
                  <rect width="65.0028" height="69.2854" rx="24"
                    transform="matrix(-1 0 0 1 71.7564 130.121)" fill="#62C0F4" />
                  <path class="upDown anm-delay1"
                    d="M71.7564 303.642C71.7564 293.206 63.2963 284.746 52.8604 284.746H25.6496C15.2136 284.746 6.75354 293.206 6.75354 303.642V321.53C6.75354 339.48 21.3049 354.031 39.255 354.031C57.205 354.031 71.7564 339.48 71.7564 321.53V303.642Z"
                    fill="#62C0F4" />
                  <rect width="65.0028" height="69.2854" rx="24"
                    transform="matrix(-1 0 0 1 93.7054 130.121)" fill="#1E90D0" />
                  <path class="upDown anm-delay1"
                    d="M93.7054 301.242C93.7054 292.132 86.3196 284.746 77.2089 284.746H45.1991C36.0883 284.746 28.7025 292.132 28.7025 301.242V321.53C28.7025 339.48 43.2539 354.031 61.204 354.031C79.154 354.031 93.7054 339.48 93.7054 321.53V301.242Z"
                    fill="#1E90D0" />
                  <circle class="fireBall4 anm-delay1" r="16" cx="180" cy="270" fill="#E83B5A" />
                  <circle class="fireBall4 " r="20" cx="154" cy="290" fill="#E83B5A" />
                  <circle class="fireBall4 anm-delay2" r="20" cx="158" cy="290" fill="#EBD044" />
                  <circle class="fireBall4 anm-delay1" r="26" cx="154" cy="260" fill="#EBD044" />
                  <circle class="fireBall1" r="26" transform="matrix(-1 0 0 1 139.397 316.863)"
                    fill="#EBD044" />
                  <circle r="15" transform="matrix(-1 0 0 1 144.552 263.413)" fill="#EBD044" />
                  <circle class="fireBall3" r="12.2414" transform="matrix(-1 0 0 1 132.116 265.725)"
                    fill="#E83B5A" />
                  <circle class="fireBall2" cx="175.397" cy="270.173" r="15" fill="#EBD044" />
                  <circle cx="175.127" cy="255.542" r="12.1978" fill="#E83B5A" />
                  <rect class="vibrateAnm2" width="98.7705" height="28.7281" rx="14.364"
                    transform="matrix(-1 0 0 1 201.762 242.499)" fill="#172863" />
                  <path class="vibrateAnm"
                    d="M287.87 138.975C287.87 101.42 257.425 70.9753 219.87 70.9753H68C30.4446 70.9753 0 101.42 0 138.975V220.863C0 240.745 16.1178 256.863 36 256.863H251.87C271.752 256.863 287.87 240.745 287.87 220.863V138.975Z"
                    fill="#62C0F4" />
                  <path class="vibrateAnm"
                    d="M287.87 138.571C287.87 101.239 257.606 70.9753 220.274 70.9753H67.5955C30.2635 70.9753 0 101.239 0 138.571H287.87Z"
                    fill="#C0EAF3" />
                  <path class="vibrateAnm"
                    d="M287.87 125.004C287.87 95.1646 263.68 70.9753 233.841 70.9753C204.002 70.9753 179.813 95.1647 179.813 125.004V220.863C179.813 240.745 195.931 256.863 215.813 256.863H251.87C271.752 256.863 287.87 240.745 287.87 220.863V125.004Z"
                    fill="#1E90D0" />
                  <path class="vibrateAnm"
                    d="M149.422 31.2584C149.422 28.461 147.154 26.1932 144.357 26.1932C141.56 26.1932 139.292 28.461 139.292 31.2584V77.9595C139.292 80.1687 141.083 81.9595 143.292 81.9595H145.422C147.631 81.9595 149.422 80.1687 149.422 77.9595V31.2584Z"
                    fill="#172863" />

                  <ellipse class="vibrateAnm" rx="16.8839" ry="16.8989" cx="144" cy="20"
                    fill="#E83B5A" />
                  <ellipse class="vibrateAnm" rx="3.37677" ry="3.37978" cx="153.6" cy="14"
                    fill="#EBD044" />
                  <path
                    d="M172.861 131.757C172.861 122.921 165.698 115.757 156.861 115.757H28.8612C20.0247 115.757 12.8612 122.921 12.8612 131.757V147.074C12.8612 155.911 20.0246 163.074 28.8612 163.074H156.861C165.698 163.074 172.861 155.911 172.861 147.074V131.757Z"
                    fill="#172863" />
                  <rect class="blink1" width="21" height="32" rx="8"
                    transform="matrix(-1 0 0 1 148.861 127.757)" fill="#C0EAF3" />
                  <rect class="blink2" width="21" height="32" rx="8"
                    transform="matrix(-1 0 0 1 57.8612 127.757)" fill="#C0EAF3" />
                  <rect width="21.949" height="157.16" rx="10.9745"
                    transform="matrix(-1 0 0 1 265.921 171.524)" fill="#172863" />
                  <rect class="vibrateAnm3" width="65.0028" height="69.2854" rx="24" x="211" y="129"
                    fill="#62C0F4" />
                  <path class="upDown"
                    d="M276.051 323.921C276.051 313.485 267.591 305.025 257.155 305.025H229.944C219.508 305.025 211.048 313.485 211.048 323.921V341.809C211.048 359.759 225.6 374.31 243.55 374.31C261.5 374.31 276.051 359.759 276.051 341.809V323.921Z"
                    fill="#62C0F4" />
                  <rect class="vibrateAnm3" width="65.0028" height="69.2854" rx="24" x="233" y="129"
                    fill="#1E90D0" />
                  <path class="upDown"
                    d="M298 321.521C298 312.41 290.614 305.025 281.503 305.025H249.494C240.383 305.025 232.997 312.41 232.997 321.521V341.809C232.997 359.759 247.549 374.31 265.499 374.31C283.449 374.31 298 359.759 298 341.809V321.521Z"
                    fill="#1E90D0" />
                  <g clip-path="url(#clip0_34_606)">
                    <path
                      d="M160.397 190.112C160.397 186.379 157.37 183.353 153.637 183.353H32.0853C28.3521 183.353 25.3258 186.379 25.3258 190.112C25.3258 193.846 28.3521 196.872 32.0853 196.872H153.637C157.37 196.872 160.397 193.846 160.397 190.112Z"
                      fill="#172863" />
                    <path class="mouthAnm" d="M25.3966 183.353H10.3966V197.353H25.3966V183.353Z"
                      fill="#E83B5A" />
                  </g>
                  <defs>
                    <clipPath id="clip0_34_606">
                      <path
                        d="M160.397 190.112C160.397 186.379 157.37 183.353 153.637 183.353H32.0853C28.3521 183.353 25.3258 186.379 25.3258 190.112C25.3258 193.846 28.3521 196.872 32.0853 196.872H153.637C157.37 196.872 160.397 193.846 160.397 190.112Z"
                        fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>



      <section class="feature-area">
        <div class="container">
          <div class="section-title">
            <span class="subtitle">Discord</span>
            <h1>Meet zBot.</h1>
            <p>zBot is ready to work, what should he do ? </p>
          </div>

          <div class="row">
            <div class="feature-box">
              <div class="bot">
                <DefaultImage src={require("../img/meet-robot-3.svg").default} alt="" />
              </div>
              <div class="feature-inner">
                <a class="collapsed" data-bs-toggle="collapse" href="#featureOne" role="button"
                  aria-expanded="false" aria-controls="featureOne">
                  <Image src={require("../img/meet-robot-3.svg").default} alt="" />
                  <h3>Suggestions</h3>
                  <i class="fas fa-caret-right"></i>
                </a>
                <div class="collapse" id="featureOne">
                  <div class="row mt-3">
                    <div class="col-md-6">
                      <h4>Collect Suggestions</h4>
                      <p><strong>On a dedicated channel</strong>. Suggestion of proposals desired by the community members. React
                        based voting system (upvote/downvote). Interactions for the admins to turn them
                        into proposals to be voted. (Type Forum)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="feature-box">
              <div class="bot">
                <DefaultImage src={require("../img/meet-robot-5.svg").default} alt="" />
              </div>
              <div class="feature-inner">
                <a class="collapsed" data-bs-toggle="collapse" href="#featureTwo" role="button"
                  aria-expanded="false" aria-controls="featureTwo">
                  <Image src={require("../img/meet-robot-5.svg").default} alt="" />
                  <h3>Proposals</h3>
                  <i class="fas fa-caret-right"></i>
                </a>
                <div class="collapse" id="featureTwo">
                  <div class="row mt-3">
                    <div class="col-md-6">
                      <h4>Wallet Verification</h4>
                      <p>
                        Exploration, discussion and voting interface around proposals.
                        Redirecting to Members DApp using Discord buttons UI. (Type Forum)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="feature-box">
              <div class="bot">
                <DefaultImage src={require("../img/meet-robot-1.svg").default} alt="" />
              </div>
              <div class="feature-inner">
                <a class="collapsed" data-bs-toggle="collapse" href="#featureThree" role="button"
                  aria-expanded="false" aria-controls="featureThree">
                  <Image src={require("../img/meet-robot-1.svg").default} alt="" />
                  <h3>
                    Discussion
                  </h3>
                  <i class="fas fa-caret-right"></i>
                </a>
                <div class="collapse" id="featureThree">
                  <div class="row mt-3">
                    <div class="col-md-6">
                      <h4>Discussion Space</h4>
                      <p>Broader interactions space (Type Text)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="feature-box">
              <div class="bot">
                <DefaultImage src={require("../img/meet-robot-2.svg").default} alt="" />
              </div>
              <div class="feature-inner">
                <a class="collapsed" data-bs-toggle="collapse" href="#featureFour" role="button"
                  aria-expanded="false" aria-controls="featureFour">
                  <Image src={require("../img/meet-robot-2.svg").default} alt="" />
                  <h3>
                    Announcement
                  </h3>
                  <i class="fas fa-caret-right"></i>
                </a>
                <div class="collapse" id="featureFour">
                  <div class="row mt-3">
                    <div class="col-md-6">
                      <h4>Announcment</h4>
                      <p>
                        Automated annoucement when a new proposal is accepted (Type Announcement).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="feature-box">


              <div class="bot">
                <DefaultImage src={require("../img/meet-robot-3.svg").default} alt="" />
              </div>
              <div class="feature-inner">
                <a class="collapsed" data-bs-toggle="collapse" href="#featureOne" role="button"
                  aria-expanded="false" aria-controls="featureOne">
                  <Image src={require("../img/meet-robot-3.svg").default} alt="" />
                  <h3>Role Management</h3>
                  <i class="fas fa-caret-right"></i>
                </a>
                <div class="collapse" id="featureOne">
                  <div class="row mt-3">
                    <div class="col-md-6">
                      <h4>Discord Roles</h4>
                      <p>
                        <strong>Automated role assignments</strong> based on amount of tokens owned:
                        Allowing to create token gated channels.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section >

      <section class="register-area">
        <div class="container">
          <h1 class="step-title">STEPS TO FOLLOW:</h1>

          <div class="register-step-widget" data-aos="fade-up" data-aos-delay="0" data-aos-offset="180">
            <div>
              <h1><span>1.</span>Connect </h1>
            </div>
            <div class="text-center">
              <p><strong class="underline">Connect</strong> your Aleo Wallet (Leo/Puzzle/Avail/ Soter/Fox) in <strong>less
                than a minute</strong></p>
              <a href="#" class="theme-btn">Connect Wallet</a>

              <div class="d-flex justify-content-center align-items-center mt-3 gap_inc">
                <a href=""><DefaultImage src={require("../img/step-wallets.png").default} alt="" width="100%" height="auto" /></a>
              </div>
            </div>
          </div>
          <div class="register-step-widget reverse" data-aos="fade-up" data-aos-delay="600" data-aos-offset="180">
            <div>
              <h1>Pay in ALEO <span>.2</span></h1>
            </div>
            <div>
              <div class="row align-items-center gy-lg-0 gy-3">
                <div class="col-lg-6 text-lg-start text-center" >
                  <Image src={require("../img/pay-ada.png").default} alt="" class="pay-ada-image" width={210} height="auto" />
                </div>
                <div class="col-lg-6 text-lg-start text-center">
                  <p><strong>Pay directly in ALEO</strong> with your wallet (Leo/Puzzle/Avail/Fox/Soter)</p>
                </div>
              </div>
            </div>
          </div>
          <div class="register-step-widget" data-aos="fade-up" data-aos-delay="700" data-aos-offset="180">
            <div>
              <h1><span>3.</span>Discord</h1>
            </div>
            <div class="text-center">
              <p>You will <strong>receive instantly an URL</strong> just click on it and connect to your discord.
                It will <strong>create automatically all the channels</strong> it needs, including admin channels, everything is explained in their descriptions.
                Your bot is ready to work :) </p>
              <div class="discord-link">
                <h2>Here is your link 🎉🎉🎉</h2>
                <div class="link-copy copyInput">
                  <div>https://discord.com/api/oauth2/authorize?cli</div>
                  <button><i class="fas fa-copy"></i></button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ContactForm />
    </div >
  );
}

export default Bot;
