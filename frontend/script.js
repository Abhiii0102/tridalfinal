document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const msg = document.getElementById("msg");

    try {
        const response = await fetch("https://tridalfinal.onrender.com/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, phone, email, message })
        });

        const data = await response.json();

        if (response.ok) {
            msg.style.color = "green";
            msg.innerText = "Message sent successfully ✅";
            document.getElementById("contactForm").reset();
        } else {
            msg.style.color = "red";
            msg.innerText = data.message || "Failed to send ❌";
        }

    } catch (error) {
        msg.style.color = "red";
        msg.innerText = "Server not reachable ❌";
    }
});
document.addEventListener("DOMContentLoaded", function () {

    let slides = document.querySelectorAll(".slide");
    let index = 0;

    function showSlide() {
        slides.forEach((slide) => {
            slide.classList.remove("active");
        });

        index++;
        if (index >= slides.length) {
            index = 0;
        }

        slides[index].classList.add("active");
    }

    setInterval(showSlide, 3000); // auto change every 3 sec

});