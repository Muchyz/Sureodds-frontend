import "./Contact.css";

function Contact() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Contact Us</h1>
        <p>Questions, feedback, or partnerships — reach out.</p>
      </section>

      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows="4" required />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default Contact;