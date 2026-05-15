const TemplesPage = () => {
  return (
    <div className="page-content">
      <h1 className="page-heading">Temples</h1>
      <p className="page-intro">Explore sacred temples and their rituals from the reference design.</p>

      <section className="section">
        <div className="grid-2">
          <div className="card" style={{ padding: 15}}>
            <div className="section-title">Ram Mandir</div>
            <p className="page-intro">Ayodhya — special Navami ceremony.</p>
            <div className="list-row">
              <span className="list-label">₹850</span>
              <button className="btn-primary">View Details</button>
            </div>
          </div>
          <div className="card" style={{ padding: 15}}>
            <div className="section-title">Kashi Vishwanath</div>
            <p className="page-intro">Varanasi — Rudrabhishek and live puja.</p>
            <div className="list-row">
              <span className="list-label">₹1,200</span>
              <button className="btn-primary">View Details</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TemplesPage
