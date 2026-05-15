const VratFestivalsPage = () => {
  return (
    <div className="page-content">
      <h1 className="page-heading">Vrat & Festivals</h1>
      <p className="page-intro">Track upcoming vrat dates and major festival celebrations from the reference design.</p>

      <section className="section">
        <div className="section-title-row">
          <h2 className="section-title">Upcoming Vrats</h2>
          <span className="section-link">See all Vrats</span>
        </div>
        <div className="section-list">
          <div className="list-row">
            <div>
              <div className="list-label">Papmochani Ekadashi</div>
              <div className="list-meta">Chaitra Krishna Ekadashi</div>
            </div>
            <span className="status-chip">Vishnu</span>
          </div>
          <div className="list-row">
            <div>
              <div className="list-label">Masik Shivaratri</div>
              <div className="list-meta">Chaitra Krishna Chaturdashi</div>
            </div>
            <span className="status-chip">Shiva</span>
          </div>
          <div className="list-row">
            <div>
              <div className="list-label">Amavasya</div>
              <div className="list-meta">Chaitra Amavasya</div>
            </div>
            <span className="status-chip">Pitru</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VratFestivalsPage
