document.addEventListener("DOMContentLoaded", function () {
    
    // 1. PRELOADER
    const preloader = document.getElementById("preloader");
    const mainContent = document.getElementById("mainContent");
    
    window.addEventListener("load", () => {
        setTimeout(() => {
            preloader.style.display = "none";
            mainContent.style.display = "block";
        }, 1500); // 1.5 seconds for snappy feel
    });

    // 2. STICKY NAVBAR
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // 3. MOBILE MENU TOGGLE
    const menuToggle = document.getElementById("mobile-menu");
    const navLinks = document.getElementById("nav-links");
    const navItems = navLinks.querySelectorAll("a");

    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            menuToggle.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });


    // 5. CONTACT FORM API SUBMISSION
    const contactForm = document.getElementById("contactForm");
    
    if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const phone = document.getElementById("phone").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;
            const msg = document.getElementById("msg"); // The message box

            // Visual feedback while loading
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            try {
                const response = await fetch("https://tridalfinal.onrender.com/api/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name, phone, email, message })
                });

                const data = await response.json();

                // Reset classes
                msg.className = "form-message";

                if (response.ok) {
                    msg.classList.add("success");
                    msg.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully';
                    contactForm.reset();
                } else {
                    msg.classList.add("error");
                    msg.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${data.message || "Failed to send"}`;
                }

            } catch (error) {
                msg.className = "form-message error";
                msg.innerHTML = '<i class="fas fa-exclamation-circle"></i> Server not reachable';
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    msg.style.display = "none";
                    msg.className = "form-message"; // Reset classes
                }, 5000);
            }
        });
    }
});