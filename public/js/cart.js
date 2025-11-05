document.addEventListener('DOMContentLoaded', () => {
  const cartBtn = document.getElementById('cartBtn');
  const cartPanel = document.getElementById('cartPanel');
  const closeCart = document.getElementById('closeCart');
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const emptyBtn = document.getElementById('emptyCart');

  let currentCartId = localStorage.getItem('cartId') || null;

  async function updateCartUI() {
    try {
      if (!cartCount) return; 
      if (!currentCartId) {
        cartCount.textContent = '0';
        if (cartItems) cartItems.innerHTML = '<p class="text-muted">Tu carrito está vacío</p>';
        if (cartTotal) cartTotal.textContent = '$0';
        return;
      }

      const res = await fetch(`/api/carts/${currentCartId}`);
      if (!res.ok) {
        cartCount.textContent = '0';
        if (cartItems) cartItems.innerHTML = '<p class="text-muted">Tu carrito está vacío</p>';
        if (cartTotal) cartTotal.textContent = '$0';
        return;
      }
      const data = await res.json();
      const cart = data.payload ?? data; 

      if (!cart || !cart.products || cart.products.length === 0) {
        cartCount.textContent = '0';
        if (cartItems) cartItems.innerHTML = '<p class="text-muted">Tu carrito está vacío</p>';
        if (cartTotal) cartTotal.textContent = '$0';
        return;
      }

      
      const totalQty = cart.products.reduce((sum, it) => sum + (it.quantity || 0), 0);
      cartCount.textContent = String(totalQty);

      if (cartItems) {
        
        cartItems.innerHTML = '';
        let totalPrice = 0;
        cart.products.forEach(it => {
          const title = it.product?.title || 'Sin nombre';
          const price = Number(it.product?.price || 0);
          const qty = Number(it.quantity || 0);
          totalPrice += price * qty;
          const div = document.createElement('div');
          div.className = 'd-flex justify-content-between align-items-center mb-2';
          div.innerHTML = `<div><strong>${title}</strong><div class="small">x ${qty}</div></div><div><span>$ ${price * qty}</span><button class="btn btn-sm btn-link text-danger ms-2 remove-item" data-pid="${it.product?._id}">Eliminar</button></div>`;
          cartItems.appendChild(div);
        });
        if (cartTotal) cartTotal.textContent = '$' + totalPrice.toLocaleString('es-CL');
        
        cartItems.querySelectorAll('.remove-item').forEach(btn => btn.addEventListener('click', async (e) => {
          const pid = e.currentTarget.dataset.pid;
          if (!pid) return;
          await fetch(`/api/carts/${currentCartId}/products/${pid}`, { method: 'DELETE' });
          await updateCartUI();
        }));
      }

    } catch (err) {
      console.error('Error updateCartUI', err);
      if (cartCount) cartCount.textContent = '0';
    }
  }

   async function ensureCartIdCreateIfNeeded() {
    if (currentCartId) return currentCartId;
    const res = await fetch('/api/carts', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) throw new Error('No se pudo crear carrito');
    const data = await res.json();
    
    currentCartId = data._id || data.id || (data.payload && data.payload._id) || data.payload || null;
    if (typeof currentCartId === 'object' && currentCartId._id) currentCartId = currentCartId._id;
    if (currentCartId) localStorage.setItem('cartId', currentCartId);
    return currentCartId;
  }

  
  async function addToCartById(pid) {
    try {
      const cid = await ensureCartIdCreateIfNeeded();
      await fetch(`/api/carts/${cid}/products/${pid}`, { method: 'POST' });
      showToast('✅ Producto agregado al carrito');
      await updateCartUI();
    } catch (err) {
      console.error('Error addToCartById', err);
      showToast('❌ Error al agregar');
    }
  }

  
  document.body.addEventListener('click', async (e) => {
    const target = e.target;
    if (target.classList.contains('add-to-cart')) {
      const pid = target.dataset.id;
      if (!pid) return;
      await addToCartById(pid);
    }
  });

  
  if (emptyBtn) {
    emptyBtn.addEventListener('click', async () => {
      if (!currentCartId) return;
      await fetch(`/api/carts/${currentCartId}`, { method: 'DELETE' });
      
      localStorage.removeItem('cartId');
      currentCartId = null;
      await updateCartUI();
    });
  }

  
  if (cartBtn && cartPanel) {
    cartBtn.addEventListener('click', async () => {
      cartPanel.classList.toggle('open');
      await updateCartUI(); 
    });
  }
  if (closeCart && cartPanel) {
    closeCart.addEventListener('click', () => cartPanel.classList.remove('open'));
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast align-items-center show';
    t.style.position = 'fixed'; t.style.right = '20px'; t.style.bottom = '20px'; t.style.zIndex = 2000;
    t.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
  }

  updateCartUI();
  window.addEventListener('focus', updateCartUI);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') updateCartUI();
  });
});
