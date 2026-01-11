// Xana National Navy & Royal Xana Navy Website JavaScript

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCollapsiblePanels();
    initializeFilters();
    initializeTimeline();
    initializeMobileMenu();
    initializeAccessibility();
    initializeNavigationAccessibility();
    initializeSearch();
});

// Navigation functionality
function initializeNavigation() {
    // Fixed header on scroll
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Collapsible panels for About page
function initializeCollapsiblePanels() {
    const panels = document.querySelectorAll('.collapsible-panel');

    panels.forEach(panel => {
        const header = panel.querySelector('.panel-header');
        const content = panel.querySelector('.panel-content');

        if (header && content) {
            // Make header focusable and announceable
            header.setAttribute('tabindex', '0');
            header.setAttribute('role', 'button');
            header.setAttribute('aria-expanded', panel.classList.contains('open') ? 'true' : 'false');

            function togglePanel() {
                const isOpen = panel.classList.toggle('open');
                content.style.display = isOpen ? 'block' : 'none';
                header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            }

            header.addEventListener('click', togglePanel);
            header.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    togglePanel();
                }
            });
        }
    });
}

// Filter functionality for Fleets and News pages
function initializeFilters() {
    // Combined filter support (fleet/type/status) for elements with .filterable-item
    const filterGroups = document.querySelectorAll('.filter-group');
    const items = document.querySelectorAll('.filterable-item');

    // Track active filters by type
    const activeFilters = {};

    function applyFilters() {
        const searchInput = document.querySelector('.search-input');
        const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

        items.forEach(item => {
            let visible = true;

            // Check each active filter type
            for (const type in activeFilters) {
                const value = activeFilters[type];
                if (!value || value === 'all') continue;
                const itemValue = item.dataset[type];
                if (!itemValue) { visible = false; break; }
                if (itemValue.toLowerCase() !== value.toLowerCase()) { visible = false; break; }
            }

            // Search match (name or class)
            if (visible && searchTerm) {
                const nameEl = item.querySelector('.vessel-name');
                const classEl = item.querySelector('.vessel-class');
                const text = ((nameEl ? nameEl.textContent : '') + ' ' + (classEl ? classEl.textContent : '')).toLowerCase();
                if (!text.includes(searchTerm)) visible = false;
            }

            item.style.display = visible ? 'block' : 'none';
        });
    }

    // Initialize filter button groups (buttons with data-filter and data-type)
    filterGroups.forEach(group => {
        const filters = group.querySelectorAll('.filter-btn');
        if (!filters.length) return;
        const type = filters[0].dataset.type || 'category';

        filters.forEach(btn => {
            btn.addEventListener('click', function() {
                // Make this the active button for its group
                filters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');

                activeFilters[type] = this.dataset.filter;
                applyFilters();
            });

            // Seed activeFilters from any button already active
            if (btn.classList.contains('active')) {
                activeFilters[type] = btn.dataset.filter;
            }
        });
    });

    // Wire up search input for vessels
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // News page search box (search articles)
    const articleSearch = document.querySelector('.search-box');
    if (articleSearch) {
        articleSearch.addEventListener('input', function() {
            const term = this.value.trim().toLowerCase();
            document.querySelectorAll('.article-item').forEach(article => {
                const title = article.querySelector('.article-title').textContent.toLowerCase();
                const excerpt = article.querySelector('.article-excerpt').textContent.toLowerCase();
                const meta = article.querySelector('.article-meta').textContent.toLowerCase();
                const visible = title.includes(term) || excerpt.includes(term) || meta.includes(term);
                article.style.display = visible ? 'block' : 'none';
            });
        });
    }
}

// Interactive timeline for History page
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            // Remove active class from all items
            timelineItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item if it wasn't already active
            if (!isActive) {
                this.classList.add('active');
            }
        });
    });

    // Timeline navigation
    const timelineNav = document.querySelectorAll('.timeline-nav a');
    timelineNav.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetItem = document.getElementById(targetId);
            
            if (targetItem) {
                targetItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                targetItem.classList.add('active');
            }
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
}

// Accessibility features
function initializeAccessibility() {
    // High contrast mode toggle
    const contrastToggle = document.querySelector('.contrast-toggle');
    if (contrastToggle) {
        contrastToggle.addEventListener('click', function() {
            document.body.classList.toggle('high-contrast');
            localStorage.setItem('highContrast', document.body.classList.contains('high-contrast'));
        });
        
        // Restore high contrast preference
        if (localStorage.getItem('highContrast') === 'true') {
            document.body.classList.add('high-contrast');
        }
    }
    
    // Font size controls
    const fontSizeControls = document.querySelectorAll('.font-size-control');
    fontSizeControls.forEach(control => {
        control.addEventListener('click', function() {
            const size = this.dataset.size;
            document.body.classList.remove('font-small', 'font-medium', 'font-large');
            document.body.classList.add(`font-${size}`);
            localStorage.setItem('fontSize', size);
        });
    });
    
    // Restore font size preference
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        document.body.classList.add(`font-${savedFontSize}`);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Skip to main content with Tab
        if (e.key === 'Tab' && !e.shiftKey) {
            const focusableElements = document.querySelectorAll(
                'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// Navigation accessibility and flyouts
function initializeNavigationAccessibility() {
    // Flyout toggles: click, keyboard (Enter/Space), hover
    const flyoutToggles = document.querySelectorAll('.flyout-toggle');
    flyoutToggles.forEach(btn => {
        const li = btn.closest('.has-flyout');
        const panel = li.querySelector('.flyout-panel');

        // Ensure initial ARIA states
        btn.setAttribute('aria-expanded', btn.classList.contains('active') ? 'true' : 'false');
        panel.setAttribute('aria-hidden', btn.classList.contains('active') ? 'false' : 'true');
        if (btn.classList.contains('active')) li.classList.add('open');

        btn.addEventListener('click', function(e) {
            const isOpen = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!isOpen));
            panel.setAttribute('aria-hidden', String(isOpen));
            li.classList.toggle('open', !isOpen);
        });

        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
            if (e.key === 'Escape') { this.setAttribute('aria-expanded', 'false'); panel.setAttribute('aria-hidden', 'true'); li.classList.remove('open'); this.focus(); }
        });

        li.addEventListener('mouseenter', () => { btn.setAttribute('aria-expanded','true'); panel.setAttribute('aria-hidden','false'); li.classList.add('open'); });
        li.addEventListener('mouseleave', () => { btn.setAttribute('aria-expanded','false'); panel.setAttribute('aria-hidden','true'); li.classList.remove('open'); });
    });

    // Close any open flyouts when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-flyout')) {
            document.querySelectorAll('.has-flyout.open').forEach(openLi => {
                const toggle = openLi.querySelector('.flyout-toggle');
                const panel = openLi.querySelector('.flyout-panel');
                if (toggle && panel) {
                    toggle.setAttribute('aria-expanded','false');
                    panel.setAttribute('aria-hidden','true');
                    openLi.classList.remove('open');
                }
            });
        }
    });

    // Mobile menu aria-expanded handling
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', mobileToggle.classList.contains('active') ? 'true' : 'false');
        mobileToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', String(!expanded));
            if (navMenu) { navMenu.classList.toggle('active'); navMenu.setAttribute('aria-hidden', String(expanded)); }
        });
    }
}

// Search overlay and site search
function initializeSearch() {
    const searchBtn = document.querySelector('.search-btn');
    const overlay = document.getElementById('search-overlay');
    const searchForm = document.getElementById('site-search');
    const searchInput = document.getElementById('site-search-input');
    const results = document.getElementById('search-results');
    let index = null;

    function openSearch() {
        if (!overlay) return;
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden','false');
        if (searchBtn) searchBtn.setAttribute('aria-expanded','true');
        if (searchInput) searchInput.focus();
    }

    function closeSearch() {
        if (!overlay) return;
        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden','true');
        if (searchBtn) searchBtn.setAttribute('aria-expanded','false');
        if (searchInput) { searchInput.value = ''; }
        if (results) results.innerHTML = '';
        if (searchBtn) searchBtn.focus();
    }

    async function loadIndex() {
        if (index) return index;
        try {
            const res = await fetch('search-data.json');
            index = await res.json();
        } catch (err) {
            console.warn('Search index not available', err);
            index = [];
        }
        return index;
    }

    if (searchBtn && overlay && searchForm && searchInput && results) {
        searchBtn.addEventListener('click', (e) => {
            const expanded = searchBtn.getAttribute('aria-expanded') === 'true';
            if (expanded) closeSearch(); else openSearch();
        });

        overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch(); });

        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const q = searchInput.value.trim().toLowerCase();
            if (!q) { results.innerHTML = '<p>No search query entered.</p>'; return; }
            const idx = await loadIndex();
            const hits = idx.filter(item => ((item.title || '') + ' ' + (item.excerpt||'') + ' ' + (item.tags||'')).toLowerCase().includes(q));
            if (!hits.length) { results.innerHTML = '<p>No results found.</p>'; return; }
            const ul = document.createElement('ul'); ul.className = 'search-results-list';
            hits.forEach(h => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${h.url}"><strong>${h.title}</strong><div class="result-excerpt">${h.excerpt || ''}</div></a>`;
                ul.appendChild(li);
            });
            results.innerHTML = '';
            results.appendChild(ul);
        });

        // Live suggestions (debounced)
        let debounce;
        searchInput.addEventListener('input', async () => {
            clearTimeout(debounce);
            debounce = setTimeout(async () => {
                const q = searchInput.value.trim().toLowerCase();
                if (!q) { results.innerHTML = ''; return; }
                const idx = await loadIndex();
                const hits = idx.filter(item => ((item.title||'') + ' ' + (item.excerpt||'')).toLowerCase().includes(q)).slice(0,6);
                results.innerHTML = hits.map(h => `<a class="suggestion" href="${h.url}"><strong>${h.title}</strong><div class="result-excerpt">${h.excerpt||''}</div></a>`).join('');
            }, 220);
        });
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Form handling
function handleFormSubmit(form, successMessage = 'Form submitted successfully') {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });
        
        if (isValid) {
            showNotification(successMessage, 'success');
            form.reset();
        } else {
            showNotification('Please fill in all required fields', 'error');
        }
    });
}

// Initialize forms
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        handleFormSubmit(form);
    });
});

// Smooth scroll reveal animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Initialize scroll reveal on load
document.addEventListener('DOMContentLoaded', revealOnScroll);