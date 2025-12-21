export default function Filters({ products, setFiltered }) {
  function filterByPrice(max) {
    setFiltered(products.filter(p => p.price <= max));
  }

  return (
    <aside className="filters">
      <h4>FILTERS</h4>

      <div className="filter-group">
        <label>Price</label>
        <button onClick={() => filterByPrice(500)}>Below ₹500</button>
        <button onClick={() => filterByPrice(1000)}>Below ₹1000</button>
      </div>

      <div className="filter-group">
        <label>Delivery</label>
        <label><input type="checkbox" /> Free Delivery</label>
      </div>

      <div className="filter-group">
        <label>Category</label>
        {[...new Set(products.map(p => p.category).filter(Boolean))].map(cat => (
            <button key={cat} onClick={() => setFiltered(products.filter(p => p.category === cat))}>{cat}</button>
        ))}
        <button onClick={() => setFiltered(products)} style={{marginTop:8, fontSize:12, color:'var(--primary)'}}>Reset</button>
      </div>

      <div className="filter-group">
        <label>Rating</label>
        <label><input type="checkbox" /> 4★ & above</label>
      </div>
    </aside>
  );
}
