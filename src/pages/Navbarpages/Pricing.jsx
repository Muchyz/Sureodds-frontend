import "./Pricing.css";

function Pricing() {
  return (
    <div className="page">
      <section className="hero">
        <h1>Simple Pricing</h1>
        <p>Choose the plan that fits your betting style.</p>
      </section>

      <section className="grid">
        <div className="card">
          <h3>Free</h3>
          <p className="price">KES 0</p>
          <ul>
            <li>Basic odds view</li>
            <li>Limited insights</li>
          </ul>
        </div>

        <div className="card premium">
          <h3>Pro</h3>
          <p className="price">KES 999 / month</p>
          <ul>
            <li>Advanced analytics</li>
            <li>Live odds tracking</li>
            <li>Priority features</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default Pricing;