async function ensureCartId() {
  let cartId = localStorage.getItem('cartId');
  if (!cartId) {
    const res = await fetch('/api/carts', { method: 'POST' });
    const data = await res.json();
    cartId = data._id;
    localStorage.setItem('cartId', cartId);
  }
  return cartId;
}

async function addToCart(productId) {
  const cartId = await ensureCartId();
  const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
    method: 'POST',
  });

  if (res.ok) {
    alert('✅ Producto agregado al carrito');
  } else {
    alert('❌ Error al agregar producto');
  }
}
