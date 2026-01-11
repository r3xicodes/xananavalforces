// Xana National Navy & Royal Xana Navy Website JavaScript

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCollapsiblePanels();
    initializeFilters();
    initializeTimeline();
    initializeMobileMenu();
    initializeAccessibility();
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
            header.addEventListener('click', function() {
                const isOpen = panel.classList.contains('open');
                
                // Close all other panels
                panels.forEach(p => {
                    p.classList.remove('open');
                    const c = p.querySelector('.panel-content');
                    if (c) c.style.display = 'none';
                });
                
                // Toggle current panel
                if (!isOpen) {
                    panel.classList.add('open');
                    content.style.display = 'block';
                }
            });
        }
    });
}

// Filter functionality for Fleets and News pages
function initializeFilters() {
    const filterGroups = document.querySelectorAll('.filter-group');
    
    filterGroups.forEach(group => {
        const filters = group.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.filterable-item');
        
        filters.forEach(filter => {
            filter.addEventListener('click', function() {
                const filterValue = this.dataset.filter;
                
                // Update active filter
                filters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                items.forEach(item => {
                    if (filterValue === 'all' || item.dataset.category === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    });

    // Search functionality
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const searchableItems = document.querySelectorAll('.searchable');
            
            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
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