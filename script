// GPK ULTRA Collector's Hub - Complete Script
document.addEventListener('DOMContentLoaded', function() {
    // ========== CONSTANTS & CONFIG ==========
    const GPK_COLORS = {
        red: '#ff3e41',
        yellow: '#ffde37',
        blue: '#2e86ab',
        black: '#1a1a1a',
        paper: '#f5f5f0'
    };

    // ========== DATA ==========
    const gpkCards = [
        {
            id: 1,
            title: "ADAM BOMB",
            series: 1,
            number: "1a",
            year: 1985,
            imageUrl: "assets/cards/adam_bomb.jpg",
            backImage: "assets/cards/back_design.png",
            value: 125.00
        },
        // Add all other cards...
    ];

    const gpkSets = [
        {
            id: "series1",
            title: "Original Series 1",
            year: 1985,
            coverImage: "assets/sets/series1_cover.jpg",
            pages: [
                "assets/sets/series1/page1.jpg",
                "assets/sets/series1/page2.jpg"
                // Add all pages
            ]
        },
        // Add all other sets...
    ];

    // ========== STATE ==========
    let currentState = {
        cartItems: 0,
        currentSet: null,
        currentPage: 0,
        threeJS: {
            card: {
                scene: null,
                camera: null,
                renderer: null,
                mesh: null,
                controls: null
            },
            book: {
                scene: null,
                camera: null,
                renderer: null,
                meshes: [],
                controls: null
            }
        }
    };

    // ========== DOM ELEMENTS ==========
    const elements = {
        cardGrid: document.getElementById('cardGrid'),
        setsGrid: document.getElementById('setsGrid'),
        cardViewer: document.getElementById('webgl-container'),
        bookViewer: document.getElementById('book-container'),
        cardCanvas: document.getElementById('webgl-canvas'),
        bookCanvas: document.getElementById('book-canvas'),
        cardClose: document.querySelector('#webgl-container .viewer-close'),
        bookClose: document.querySelector('#book-container .viewer-close'),
        cartCount: document.querySelector('.cart-count'),
        navTabs: document.querySelectorAll('.nav-tab'),
        tabContents: document.querySelectorAll('.tab-content')
    };

    // ========== INITIALIZATION ==========
    function init() {
        setupTabs();
        initCardGrid();
        initSetsGrid();
        setupCart();
        setupViewerCloseButtons();
    }

    // ========== CARD GRID ==========
    function initCardGrid() {
        gpkCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card-container';
            cardElement.innerHTML = `
                <div class="card-face front">
                    <img data-src="${card.imageUrl}" alt="${card.title}" class="card-image">
                    <div class="card-info">
                        <h3 class="card-title">${card.title}</h3>
                        <p>Series ${card.series} • ${card.number} • $${card.value.toFixed(2)}</p>
                    </div>
                </div>
                <div class="card-face back">
                    <img src="${card.backImage}" alt="Card back" class="card-image">
                </div>
            `;
            
            cardElement.addEventListener('click', () => handleCardClick(cardElement, card));
            elements.cardGrid.appendChild(cardElement);
        });
        
        initLazyLoading();
    }

    function handleCardClick(cardElement, card) {
        cardElement.classList.toggle('flipped');
        if (cardElement.classList.contains('flipped')) {
            setTimeout(() => showCardViewer(card), 400);
        }
    }

    // ========== SETS GRID ==========
    function initSetsGrid() {
        gpkSets.forEach(set => {
            const setElement = document.createElement('div');
            setElement.className = 'set-container';
            setElement.innerHTML = `
                <img src="${set.coverImage}" alt="${set.title}" class="set-cover">
                <h3>${set.title} (${set.year})</h3>
            `;
            setElement.addEventListener('click', () => showBookViewer(set));
            elements.setsGrid.appendChild(setElement);
        });
    }

    // ========== 3D CARD VIEWER ==========
    function showCardViewer(card) {
        showLoader(elements.cardViewer);
        elements.cardViewer.style.display = 'flex';
        
        // Cleanup previous scene if exists
        if (currentState.threeJS.card.renderer) {
            cleanupThreeJS('card');
        }
        
        // Setup Three.js
        const { scene, camera, renderer } = initThreeJS('card', elements.cardCanvas);
        currentState.threeJS.card = { scene, camera, renderer };
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Load card texture
        new THREE.TextureLoader().load(
            card.imageUrl,
            texture => {
                const geometry = new THREE.PlaneGeometry(3, 4);
                const material = new THREE.MeshStandardMaterial({
                    map: texture,
                    roughness: 0.3,
                    metalness: 0.1
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
                currentState.threeJS.card.mesh = mesh;
                
                // Controls
                const controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableZoom = true;
                controls.enablePan = false;
                currentState.threeJS.card.controls = controls;
                
                // Position camera
                camera.position.z = 5;
                
                // Start animation
                animate('card');
                hideLoader(elements.cardViewer);
            },
            undefined,
            error => handleViewerError(error, elements.cardViewer)
        );
    }

    // ========== 3D BOOK VIEWER ==========
    function showBookViewer(set) {
        currentState.currentSet = set;
        currentState.currentPage = 0;
        
        showLoader(elements.bookViewer);
        elements.bookViewer.style.display = 'flex';
        
        // Cleanup previous scene if exists
        if (currentState.threeJS.book.renderer) {
            cleanupThreeJS('book');
        }
        
        // Setup Three.js
        const { scene, camera, renderer } = initThreeJS('book', elements.bookCanvas);
        currentState.threeJS.book = { scene, camera, renderer };
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Load initial pages
        loadBookSpread(0);
        
        // Controls
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = false;
        controls.minDistance = 5;
        controls.maxDistance = 15;
        currentState.threeJS.book.controls = controls;
        
        // Position camera
        camera.position.z = 8;
        
        // Start animation
        animate('book');
        setupBookNavigation();
    }

    function loadBookSpread(pageIndex) {
        // Clear previous pages
        currentState.threeJS.book.meshes.forEach(mesh => {
            currentState.threeJS.book.scene.remove(mesh);
        });
        currentState.threeJS.book.meshes = [];
        
        // Load left page (if exists)
        if (pageIndex > 0) {
            loadBookPage(currentState.currentSet.pages[pageIndex - 1], true);
        }
        
        // Load right page
        if (pageIndex < currentState.currentSet.pages.length) {
            loadBookPage(currentState.currentSet.pages[pageIndex], false);
        }
        
        hideLoader(elements.bookViewer);
    }

    function loadBookPage(pageUrl, isLeftPage) {
        new THREE.TextureLoader().load(
            pageUrl,
            texture => {
                const geometry = new THREE.PlaneGeometry(6, 8);
                const material = new THREE.MeshStandardMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    roughness: 0.4
                });
                
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.x = isLeftPage ? -3.2 : 3.2;
                mesh.rotation.y = isLeftPage ? Math.PI/2 : -Math.PI/2;
                
                currentState.threeJS.book.scene.add(mesh);
                currentState.threeJS.book.meshes.push(mesh);
            },
            undefined,
            error => handleViewerError(error, elements.bookViewer)
        );
    }

    // ========== UTILITY FUNCTIONS ==========
    function initThreeJS(type, canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas,
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        return { scene, camera, renderer };
    }

    function animate(type) {
        const { scene, camera, renderer, controls } = currentState.threeJS[type];
        
        function render() {
            requestAnimationFrame(render);
            if (controls) controls.update();
            renderer.render(scene, camera);
        }
        render();
    }

    function cleanupThreeJS(type) {
        const { scene, renderer, controls, mesh, meshes } = currentState.threeJS[type];
        
        if (controls) controls.dispose();
        if (renderer) {
            renderer.dispose();
            renderer.forceContextLoss();
        }
        
        // Cleanup meshes
        if (mesh) {
            if (mesh.material) mesh.material.dispose();
            if (mesh.geometry) mesh.geometry.dispose();
        }
        
        if (meshes) {
            meshes.forEach(m => {
                if (m.material) m.material.dispose();
                if (m.geometry) m.geometry.dispose();
            });
        }
        
        // Remove all objects from scene
        while(scene.children.length > 0) {
            scene.remove(scene.children[0]);
        }
    }

    function setupBookNavigation() {
        // Keyboard navigation
        function handleKeyDown(e) {
            if (e.key === 'ArrowRight' && currentState.currentPage < currentState.currentSet.pages.length - 1) {
                currentState.currentPage++;
                loadBookSpread(currentState.currentPage);
            } 
            else if (e.key === 'ArrowLeft' && currentState.currentPage > 0) {
                currentState.currentPage--;
                loadBookSpread(currentState.currentPage);
            }
        }
        
        // Touch/swipe support
        let touchStartX = 0;
        
        function handleTouchStart(e) {
            touchStartX = e.touches[0].clientX;
        }
        
        function handleTouchEnd(e) {
            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchStartX - touchEndX;
            
            if (Math.abs(diffX) > 50) {
                if (diffX > 0 && currentState.currentPage < currentState.currentSet.pages.length - 1) {
                    currentState.currentPage++;
                } 
                else if (diffX < 0 && currentState.currentPage > 0) {
                    currentState.currentPage--;
                }
                loadBookSpread(currentState.currentPage);
            }
        }
        
        elements.bookCanvas.addEventListener('keydown', handleKeyDown);
        elements.bookCanvas.addEventListener('touchstart', handleTouchStart, { passive: true });
        elements.bookCanvas.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        // Return cleanup function
        return () => {
            elements.bookCanvas.removeEventListener('keydown', handleKeyDown);
            elements.bookCanvas.removeEventListener('touchstart', handleTouchStart);
            elements.bookCanvas.removeEventListener('touchend', handleTouchEnd);
        };
    }

    function showLoader(container) {
        let loader = container.querySelector('.viewer-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'viewer-loader';
            loader.innerHTML = `
                <div class="loader-spinner"></div>
                <p>LOADING GROSSNESS...</p>
            `;
            container.appendChild(loader);
        }
        loader.style.display = 'block';
    }

    function hideLoader(container) {
        const loader = container.querySelector('.viewer-loader');
        if (loader) loader.style.display = 'none';
    }

    function handleViewerError(error, container) {
        console.error('Viewer error:', error);
        hideLoader(container);
        
        let errorElement = container.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            container.appendChild(errorElement);
        }
        
        errorElement.textContent = 'Failed to load content. Please try again.';
        errorElement.style.display = 'block';
        
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    }

    function initLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            });
        }, { threshold: 0.1, rootMargin: '200px' });

        document.querySelectorAll('[data-src]').forEach(img => {
            observer.observe(img);
        });
    }

    function setupTabs() {
        elements.navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                elements.navTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding content
                elements.tabContents.forEach(c => c.classList.remove('active'));
                document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
            });
        });
    }

    function setupCart() {
        // Sample cart functionality
        document.querySelectorAll('.card-container').forEach(card => {
            card.addEventListener('click', () => {
                currentState.cartItems++;
                elements.cartCount.textContent = currentState.cartItems;
            });
        });
    }

    function setupViewerCloseButtons() {
        elements.cardClose.addEventListener('click', () => {
            elements.cardViewer.style.display = 'none';
            cleanupThreeJS('card');
        });
        
        elements.bookClose.addEventListener('click', () => {
            elements.bookViewer.style.display = 'none';
            cleanupThreeJS('book');
        });
    }

    // Start the app
    init();
});
