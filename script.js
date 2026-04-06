document.addEventListener("DOMContentLoaded", function () {
    var sliderWrapper = document.getElementById("slider-wrapper");
    var prevBtn = document.getElementById("prevBtn");
    var nextBtn = document.getElementById("nextBtn");

    if (!sliderWrapper || !prevBtn || !nextBtn) {
        return;
    }

    var slides = sliderWrapper.querySelectorAll(".slide");
    var currentIndex = 0;

    function updateSlider() {
        sliderWrapper.style.transform = "translateX(-" + currentIndex * 100 + "%)";
    }

    nextBtn.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider();
    });

    prevBtn.addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider();
    });
});
