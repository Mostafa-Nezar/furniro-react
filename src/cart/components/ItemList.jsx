import Item from './Item';

const ItemList = () => {
  // هنا بنعمل Array من العناصر
  const items = [
    { id: 1, name: 'Product 1', description: 'Description of Product 1' },
    { id: 2, name: 'Product 2', description: 'Description of Product 2' },
    { id: 3, name: 'Product 3', description: 'Description of Product 3' },
    { id: 4, name: 'Product 4', description: 'Description of Product 4' },
  ];

  return (
    <div>
      <h2>Product List</h2>
      <div className="item-list">
        {items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ItemList;
