import React from "react";

import Image from "next/image";

async function submitFormLink(event) {
  event.preventDefault();
  document.getElementById('contactForm').submit();
}

async function contactFormSubmit(event) {
  event.preventDefault();
  if (window.submitContactInProcess) {
    return
  }
  window.submitContactInProcess = true;
  try {
    window.eventC = event;
    const contact_name_input = document.getElementById("contact_name")
    const contact_email_input = document.getElementById("contact_email")
    const contact_message_input = document.getElementById("contact_message")
    $('#submit_contact_form').html('<img src="loader-loading.gif" alt="wallet" id="contact_form_load_img"/>')

    const reqBody = JSON.stringify({
      name: contact_name_input.value,
      email: contact_email_input.value,
      message: contact_message_input.value,
    });

    const rawresponse = await fetch('#', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: reqBody
    }).then((response) => response.json())

    if (rawresponse.status == "success") {
      // Si succes
      contact_name_input.value = "";
      contact_email_input.value = "";
      contact_message_input.value = "";
      $('#submit_contact_form').html('Submit')
      swal("Success", "Your message was submitted. We will answer you as soon as possible.", "success");
    } else {
      swal("Error", "Could not submit your message. Use: contact@zvote.io instead.", "error");
    }
  } catch (e) {
    console.log(e)
  }
  window.submitContactInProcess = false;
  $('#submit_contact_form').html('Submit')
}

function ContactForm() {
  return (
    <section class="contact-area" id="contact_sec">
      <div class="bg-shapes">
        <Image src={require("../img/contact-shape-1.png").default} />
        <Image src={require("../img/contact-shape-2.png").default} />
        <Image src={require("../img/star-img.png").default} />
        <Image src={require("../img/star-img-2.png").default} />
      </div>
      <div class="container">
        <div class="mb-5">
          <h1>Let's schedule a call within an hour!</h1>
          <p>Describe quickly your project and needs.</p>
        </div>
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <form action="https://www.formbackend.com/f/4b938d244719dde8" id="contactForm" method="POST">
              <div class="row gy-4">
                <div class="col-md-6">
                  <input class="form-control" type="text" id="contact_name" name="name" placeholder="Name" required="true" />
                </div>
                <div class="col-md-6">
                  <input class="form-control" type="email" id="contact_email" name="email" placeholder="Email Address" required="true" />
                </div>
                <div class="col-md-12">
                  <textarea class="form-control" name="message" id="contact_message" cols="30" rows="7"
                    placeholder="Message" required="true"></textarea>
                </div>
                <div class="col-12 text-md-end text-center">
                  <button type="submit" id="submit_contact_form" class="theme-btn-2">Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
