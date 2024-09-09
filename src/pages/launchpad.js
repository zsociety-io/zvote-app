import React from "react";
import { useEffect } from 'react';
import Image from 'next/image'

import ContactForm from "../components/ContactForm";
import AOS from "aos";
import Typed from 'typed.js';


function Launchpad() {
    const typedElement = React.useRef(null);

    useEffect(() => {
        AOS.init();
        const typed = new Typed(typedElement.current, {
            strings: ["Customizable", "Updatable"],
            typeSpeed: 70,
            backSpeed: 25,
            loop: true,
            backDelay: 1200,
        });
        return () => {
            typed.destroy();
        };
    }, []);


    return (
        <div>
            <section className="hero-area-3 ">
                <div className="bg-shape" style={{ zIndex: "-1" }}>
                    <Image src={require("../img/bg-circle-3.png").default} alt="" className="animation-top-bottom" style={{ objectFit: "contain" }} />
                    <Image src={require("../img/bg-circle-4.png").default} alt="" className="animation-zoom" style={{ objectFit: "contain" }} />
                    <Image src={require("../img/hero-bg-round-3.png").default} alt="" />
                </div>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xxl-10 mx-auto">
                            <h1><span ref={typedElement}></span><br /> DAO launchpad</h1>
                            <p>Choose the features that suits your needs the best</p>
                            <a href="/profile" className="theme-btn-2">Make your perfect DAO</a>
                        </div>
                    </div>
                </div>
            </section>
            <section className="product-info-area">
                <div className="container">
                    <div className="row">
                        <div className="col-xxl-10 mx-auto">
                            <a className="boxingLink" href="#" target="_blank">
                                <div className="single-widget mt-80" data-aos="fade-up">
                                    <div className="sec-counter">1</div>
                                    <h2
                                        style={{
                                            marginBottom: "40px",
                                            fontSize: "30px"
                                        }}
                                    >Choose ANY "Voting Systems"</h2>
                                    <div className="mint-reveal-system">
                                        <div>
                                            <span
                                                style={{
                                                    marginBottom: "15px"
                                                }}
                                            >
                                                Approved Checkbox</span>
                                            <Image src={require("../img/vote-checkbox.svg").default} alt="" width={150} height="auto" style={{
                                                margin: "auto",
                                                display: "block"
                                            }} />
                                        </div>
                                        <div className="arrow-clock">
                                            <div className="arrow">
                                                <i className="fas fa-chevron-right"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <span
                                                style={{
                                                    marginBottom: "15px"
                                                }}
                                            >Sorted Preferences</span>
                                            <Image src={require("../img/vote-ranked.svg").default} alt="" width={150} height="auto" style={{
                                                margin: "auto",
                                                display: "block"
                                            }} />
                                        </div>
                                    </div>
                                    {/*<<h6><Image src={require("../img/whitepaper.png").default} alt="#" /><br />*/}
                                    <h6><span className="strong_underline">Select voting system:</span><br />Select the voting system adapted to your DAO among unlimited possibilities.</h6>
                                    <div className="collapse widget-info" id="productColOne">
                                        <p>Build your own voting system, and chose who can add new ones.</p>
                                    </div>
                                    <div className="collapse-arrow">
                                        <a className="collapsed" data-bs-toggle="collapse" href="#productColOne" role="button"
                                            aria-expanded="false" aria-controls="productColOne">
                                            <i className="fas fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>
                            </a>
                            <div className="single-widget " data-aos="fade-up">
                                <div className="sec-counter">2</div>
                                <h2
                                    style={{
                                        marginBottom: "40px",
                                        fontSize: "30px"
                                    }}
                                >“Proposal” Management System</h2>

                                <div className="candy-mint">
                                    <div>
                                        <h3
                                            style={{
                                                marginBottom: "20px"
                                            }}
                                        >Anyone can make propsals</h3>
                                        <Image src={require("../img/one-person.svg").default} alt="" width={150} height="auto" style={{
                                            margin: "auto",
                                            display: "block"
                                        }} />
                                    </div>
                                    <div className="arrow-clock">
                                        <div className="arrow">
                                            <i className="fas fa-chevron-right"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <h3
                                            style={{
                                                marginBottom: "20px"
                                            }}
                                        >Allowed Proposers</h3>
                                        <Image src={require("../img/list-people.svg").default} alt="" width={150} height="auto" style={{
                                            margin: "auto",
                                            display: "block"
                                        }} />
                                    </div>
                                </div>
                                <h6><span className="strong_underline">Customizable</span> Chose who is allowed to make new proposals, either a list of mods or anyone. Alternatively, build your own proposal management system.</h6>

                                <div className="collapse-arrow">
                                    <a className="collapsed" data-bs-toggle="collapse" href="#productColTwo" role="button"
                                        aria-expanded="false" aria-controls="productColTwo">
                                        <i className="fas fa-chevron-up"></i>
                                    </a>
                                </div>
                            </div>
                            <a className="boxingLink" href="#" target="_blank">
                                <div className="single-widget" data-aos="fade-up">
                                    <div className="sec-counter">3</div>
                                    <h2
                                        style={{
                                            marginBottom: "40px",
                                            fontSize: "30px"
                                        }}
                                    >DAO "Update" Strategy</h2>

                                    <div className="land-mint">
                                        <div style={{ width: "30%" }}>
                                            <h3
                                                style={{
                                                    marginBottom: "20px"
                                                }}>Vote for: DAO Settings Update</h3>
                                            <Image className="map img-fluid" src={require("../img/update-settings.svg").default} width={150} height="auto" style={{
                                                margin: "auto",
                                                display: "block"
                                            }} />
                                        </div>
                                        <div className="middle-img" style={{ width: "30%" }}>
                                            <h3
                                                style={{
                                                    marginBottom: "20px"
                                                }}>Voting System Update</h3>
                                            <Image className="img-fluid" src={require("../img/vote-checkbox.svg").default} alt="" width={150} height="auto" style={{
                                                margin: "auto",
                                                display: "block"
                                            }} />
                                        </div>
                                        <div style={{ width: "30%" }}>
                                            <h3
                                                style={{
                                                    marginBottom: "20px"
                                                }}>Proposer List Update</h3>
                                            <Image className="img-fluid" src={require("../img/locked-settings.svg").default} alt="" width={150} height="auto" style={{
                                                margin: "auto",
                                                display: "block"
                                            }} />
                                        </div>
                                    </div>
                                    <h6><br /><span className="strong_underline">Chose how the parameters above can be updated:</span> either with a vote, by mods or even non-updatable. </h6>

                                    <div className="collapse widget-info" id="productColThree">
                                        <p>
                                            You can contact use to add more features adapted to your need.
                                        </p>
                                    </div>
                                    <div className="collapse-arrow">
                                        <a className="collapsed" data-bs-toggle="collapse" href="#productColThree" role="button"
                                            aria-expanded="false" aria-controls="productColThree">
                                            <i className="fas fa-chevron-up"></i>
                                        </a>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div >
            </section >
            <section className="service-ad-area mint-proccess">
                <Image className="blue-star" src={require("../img/star-img-4.png").default} alt="" />
                <div className="container">
                    <div className="row align-items-center">

                        <div className="col-lg-6 col-8" data-aos="fade-up">
                            <h1>Help us build</h1>
                            <p>
                                Reach to us now to get the voting system, proposal management system, or update strategy that suits your needs perfectly.
                            </p>
                            <a href="#contact_sec" className="theme-btn-2">Submit</a>
                        </div>
                        <div className="col-lg-6 col-4 text-end" data-aos="fade-up">
                            <div className="main-img">
                                <Image className="star" src={require("../img/star-img.png").default} alt="" />
                                <Image className="img-fluid" src={require("../img/mint-proccess-icon.png").default} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ContactForm />
        </div>
    );
}

export default Launchpad;
