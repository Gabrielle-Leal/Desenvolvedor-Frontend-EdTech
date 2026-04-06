document.addEventListener('DOMContentLoaded', () => {
    // --- Slider ---
    const sliderWrapper = document.getElementById('slider-wrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderDots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    const totalSlides = sliderWrapper ? sliderWrapper.children.length : 0;

    function updateDots() {
        sliderDots.forEach((dot, index) => {
            const isActive = index === currentSlide;
            dot.classList.toggle('is-active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });
    }

    function updateSlider() {
        sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }

    if (sliderWrapper && prevBtn && nextBtn && totalSlides > 0) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });

        sliderDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                currentSlide = Number(dot.dataset.slide);
                updateSlider();
            });
        });

        sliderWrapper.closest('.slider').addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            }

            if (event.key === 'ArrowLeft') {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlider();
            }
        });

        updateSlider();
    }

    // --- Accordion ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('active');
            const icon = header.querySelector('span');
            icon.textContent = item.classList.contains('active') ? '-' : '+';
        });
    });

    // --- Atividade Discursiva ---
    const discursiveTextarea = document.getElementById('discursive-response');
    const btnRespondDiscursive = document.getElementById('btn-respond-discursive');
    const btnEditDiscursive = document.getElementById('btn-edit-discursive');
    const feedbackDiscursive = document.getElementById('feedback-discursive');

    function saveDiscursive() {
        const response = discursiveTextarea.value;
        sessionStorage.setItem('discursive_response', response);
        sessionStorage.setItem('discursive_status', 'responded');
        
        discursiveTextarea.disabled = true;
        btnRespondDiscursive.disabled = true;
        btnEditDiscursive.disabled = false;
        feedbackDiscursive.classList.remove('hidden');
    }

    function editDiscursive() {
        discursiveTextarea.disabled = false;
        btnRespondDiscursive.disabled = false;
        btnEditDiscursive.disabled = true;
        feedbackDiscursive.classList.add('hidden');
        sessionStorage.setItem('discursive_status', 'editing');
    }

    btnRespondDiscursive.addEventListener('click', saveDiscursive);
    btnEditDiscursive.addEventListener('click', editDiscursive);

    // --- Atividade Objetiva ---
    const objectiveCheckboxes = document.querySelectorAll('input[name="objective"]');
    const btnRespondObjective = document.getElementById('btn-respond-objective');
    const btnEditObjective = document.getElementById('btn-edit-objective');
    const feedbackObjective = document.getElementById('feedback-objective');

    objectiveCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const anyChecked = Array.from(objectiveCheckboxes).some(cb => cb.checked);
            btnRespondObjective.disabled = !anyChecked;
            
            // Highlight selected option
            checkbox.parentElement.classList.toggle('selected', checkbox.checked);
        });
    });

    function saveObjective() {
        const selectedValues = Array.from(objectiveCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        sessionStorage.setItem('objective_response', JSON.stringify(selectedValues));
        sessionStorage.setItem('objective_status', 'responded');

        objectiveCheckboxes.forEach(cb => cb.disabled = true);
        btnRespondObjective.disabled = true;
        btnEditObjective.disabled = false;
        feedbackObjective.classList.remove('hidden');
    }

    function editObjective() {
        objectiveCheckboxes.forEach(cb => cb.disabled = false);
        btnRespondObjective.disabled = false;
        btnEditObjective.disabled = true;
        feedbackObjective.classList.add('hidden');
        sessionStorage.setItem('objective_status', 'editing');
    }

    btnRespondObjective.addEventListener('click', saveObjective);
    btnEditObjective.addEventListener('click', editObjective);

    // --- Restore Session Data ---
    function restoreSession() {
        // Discursive
        const savedDiscursive = sessionStorage.getItem('discursive_response');
        const discursiveStatus = sessionStorage.getItem('discursive_status');
        if (savedDiscursive !== null) {
            discursiveTextarea.value = savedDiscursive;
        }
        if (discursiveStatus === 'responded') {
            discursiveTextarea.disabled = true;
            btnRespondDiscursive.disabled = true;
            btnEditDiscursive.disabled = false;
            feedbackDiscursive.classList.remove('hidden');
        }

        // Objective
        const savedObjective = sessionStorage.getItem('objective_response');
        const objectiveStatus = sessionStorage.getItem('objective_status');
        if (savedObjective !== null) {
            const selectedValues = JSON.parse(savedObjective);
            objectiveCheckboxes.forEach(cb => {
                if (selectedValues.includes(cb.value)) {
                    cb.checked = true;
                    cb.parentElement.classList.add('selected');
                }
            });
        }
        if (objectiveStatus === 'responded') {
            objectiveCheckboxes.forEach(cb => cb.disabled = true);
            btnRespondObjective.disabled = true;
            btnEditObjective.disabled = false;
            feedbackObjective.classList.remove('hidden');
        } else if (objectiveStatus === 'editing' || Array.from(objectiveCheckboxes).some(cb => cb.checked)) {
            btnRespondObjective.disabled = false;
        }
    }

    restoreSession();
});
