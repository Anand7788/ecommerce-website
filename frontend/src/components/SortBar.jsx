export default function SortBar({ products, setProducts }) {
  function handleSort(e) {
    const val = e.target.value;

    if (val === "price_low") {
      setProducts([...products].sort((a,b) => a.price - b.price));
    }
    if (val === "price_high") {
      setProducts([...products].sort((a,b) => b.price - a.price));
    }
  }

  return (
    <select className="sort-select" onChange={handleSort}>
      <option>Sort by: Relevance</option>
      <option value="price_low">Price: Low to High</option>
      <option value="price_high">Price: High to Low</option>
    </select>
  );
}
