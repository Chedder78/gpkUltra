// Replace your existing initCardGrid() function with:
function initCardGrid() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.backgroundImage = `url('${img.dataset.src}')`;
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  gpkCards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card-container';
    cardElement.innerHTML = `
      <div class="card-face card-front">
        <div class="card-image" 
             data-src="${card.imageUrl}"
             style="background-color: #f0f0f0;"></div>
        <div class="card-info">
          <h3 class="card-title">${card.title}</h3>
          <p>Series ${card.series} • ${card.number} • $${card.value.toFixed(2)}</p>
        </div>
      </div>
      <div class="card-face card-back">
        <div class="card-image" 
             data-src="${card.backImage}"
             style="background-color: #f0f0f0;"></div>
      </div>
    `;

    // Observe all images
    cardElement.querySelectorAll('.card-image').forEach(img => {
      observer.observe(img);
    });

    cardGrid.appendChild(cardElement);
  });
}

// Add this to your WebGL initialization:
function initWebGLViewer(card) {
  // Add these optimizations:
  THREE.Cache.enabled = true;
  const manager = new THREE.LoadingManager();
  manager.itemStart(card.imageUrl);
  
  // Modify your texture loading:
  const texture = new THREE.TextureLoader(manager).load(
    card.imageUrl,
    () => manager.itemEnd(card.imageUrl)
  );
  
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Better quality with less performance cost
}
