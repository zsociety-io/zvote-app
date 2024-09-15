import React from "react";
import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";
import ConnectButton from "./ConnectBtn.jsx"


function Navigation({ loginRefreshRef }) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const stickyMenu = document.querySelector(".sticky-menu");

      if (stickyMenu) {
        if (scrollTop >= 400) {
          stickyMenu.classList.add("sticky");
        } else {
          stickyMenu.classList.remove("sticky");
        }
      }

      const scrollToTopButton = document.getElementById("scrollToTop");

      if (scrollToTopButton) {
        if (scrollTop > 300) {
          scrollToTopButton.style.display = "block";
        } else {
          scrollToTopButton.style.display = "none";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <header className="header-area">
      <nav className="navbar navbar-expand-lg sticky-menu">
        <div className="container">
          <Link className="navbar-brand" href="/#">
            <>
              <Image src={require("../../img/logo.svg").default} alt="logo" height={100} style={{ maxHeight: "50%!important" }} width="auto" />
            </>
          </Link>
          <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
            aria-expanded="false" aria-label="Toggle navigation">
            <span className="menu_toggle">
              <span className="hamburger">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span className="hamburger-cross">
                <span></span>
                <span></span>
              </span>
            </span>
          </button>
          <div className="collapse navbar-collapse d-lg-inline-flex" id="navbarSupportedContent">
            <ul className="navbar-nav menu">
              <li className="nav-item dropdown">
                <a href="" className="nav-link active dropdown-toggle"
                  data-bs-toggle="dropdown">Products</a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" href="/launchpad#">
                      DAO launchpad
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/bot#">
                      Discord Bots
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/custom#">
                  Custom Features
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/#our_vision">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/#contact_sec">
                  Support
                </Link>
              </li>

            </ul>
          </div>
          <ConnectButton loginRefreshRef={loginRefreshRef} />
        </div>
      </nav>
    </header>
  );
}

export default Navigation;
