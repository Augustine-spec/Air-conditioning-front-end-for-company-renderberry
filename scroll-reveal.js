/**
 * SCROLL REVEAL ANIMATION SYSTEM
 * 
 * Simple Logic for Viva Explanation:
 * 1. Elements start hidden (opacity: 0, moved down slightly)
 * 2. Intersection Observer watches when elements enter viewport
 * 3. When element is visible, add 'active' class
 * 4. CSS transition smoothly animates the element into view
 * 5. Animation triggers only once per element
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Configuration for Intersection Observer
    const observerOptions = {
        threshold: 0.15,        // Trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px'  // Trigger slightly before element enters viewport
    };

    // Create the Intersection Observer
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            // Check if element is intersecting (visible in viewport)
            if (entry.isIntersecting) {
                // Add 'active' class to trigger CSS animation
                entry.target.classList.add('active');

                // Stop observing this element (animate only once)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements that should animate on scroll
    const revealElements = document.querySelectorAll('.reveal, .reveal-zoom');

    // Start observing each element
    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Console log for debugging
    console.log(`Scroll Reveal: Observing ${revealElements.length} elements`);
});
