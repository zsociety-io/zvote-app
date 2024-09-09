import React from "react";

import Image from "next/image";

function Footer() {
    return (
        <footer>
            <div class="container">
                <div class="footer-top">
                    <a href="/" ><Image className="img-fluid" src={require("../../img/footer-logo.svg").default} alt="footer_logo" /></a>
                    <div class="footer-content">
                        <div class="page-links">
                            <a href="/terms_and_conditions.pdf">Terms</a>
                            <a href="/#contact_sec">Contact</a>
                            <a thref="/#our_vision">About</a>
                        </div>
                        <div class="copyright">Copyright © 2022 <a style={{ color: "black", fontWeight: "bold" }} href="https://zsolutions.io">zSolutions.io</a></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
