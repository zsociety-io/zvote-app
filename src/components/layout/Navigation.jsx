import React from "react";
import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";
import ConnectButton from "./ConnectBtn.jsx"
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/router';

function Navigation({ }) {
  const router = useRouter();

  const noNavPaths = ['/verify'];
  const hideNav = noNavPaths.some((path) => router.pathname.startsWith(path));

  const noLayoutPaths = ['/dashboard'];
  const hideLayout = noLayoutPaths.some((path) => router.pathname.startsWith(path));

  const noFollowPaths = ['/dashboard', '/profile'];
  const hideFollow = noFollowPaths.some((path) => router.pathname.startsWith(path));

  const pathname = usePathname();
  useEffect(() => {
    const handleScroll = () => {
      if (hideFollow) {
        return;
      }
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
  }, [hideFollow]);


  return (
    !hideNav && (<header className="header-area">
      <nav className="navbar navbar-expand-lg sticky-menu">
        <div className="container">
          <Link className="navbar-brand" href="/#">
            <>
              <Image src={require("../../img/logo.svg").default} alt="logo" height={60} style={{ maxHeight: "50%!important" }} width="auto" />
            </>
          </Link>
          {!hideLayout && <>
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
                      <Link className="dropdown-item" href="/launchpad">
                        <span
                          style={{
                            fontWeight: (pathname === "/launchpad") ? "bold" : null
                          }}
                        >
                          DAO launchpad
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/bot">
                        <span
                          style={{
                            fontWeight: (pathname === "/bot") ? "bold" : null
                          }}
                        >
                          Discord Bots
                        </span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/custom">
                    <span
                      style={{
                        fontWeight: (pathname === "/custom") ? "bold" : null
                      }}
                    >
                      Custom Features
                    </span>
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
          </>}
          <ConnectButton />
        </div>
      </nav>
    </header>)
  );
}

export default Navigation;
