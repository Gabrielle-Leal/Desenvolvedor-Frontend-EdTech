document.addEventListener('DOMContentLoaded', () => {
    // --- Audio Stage ---
    const audio = document.getElementById('audio-player');
    const audioPlayBtn = document.getElementById('audio-play');
    const audioProgress = document.getElementById('audio-progress');
    const audioTime = document.getElementById('audio-time');
    const audioVolume = document.getElementById('audio-volume');
    const audioMuteBtn = document.getElementById('audio-mute');

    function formatAudioTime(seconds) {
        if (!Number.isFinite(seconds)) {
            return '00:00';
        }

        const totalSeconds = Math.max(0, Math.floor(seconds));
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function setRangeFill(rangeEl, value, maxValue) {
        const safeMax = Number(maxValue) || 100;
        const percent = Math.min(100, Math.max(0, (Number(value) / safeMax) * 100));
        rangeEl.style.setProperty('--track-fill', `${percent}%`);
    }

    if (audio && audioPlayBtn && audioProgress && audioTime && audioVolume && audioMuteBtn) {
        audio.volume = Number(audioVolume.value) / 100;
        setRangeFill(audioVolume, audioVolume.value, audioVolume.max);

        audioPlayBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                return;
            }

            audio.pause();
        });

        audio.addEventListener('play', () => {
            audioPlayBtn.classList.add('is-playing');
            audioPlayBtn.setAttribute('aria-label', 'Pausar áudio');
        });

        audio.addEventListener('pause', () => {
            audioPlayBtn.classList.remove('is-playing');
            audioPlayBtn.setAttribute('aria-label', 'Reproduzir áudio');
        });

        audio.addEventListener('timeupdate', () => {
            const duration = audio.duration || 0;
            const progress = duration > 0 ? (audio.currentTime / duration) * 100 : 0;
            audioProgress.value = String(progress);
            setRangeFill(audioProgress, audioProgress.value, audioProgress.max);
            audioTime.textContent = formatAudioTime(audio.currentTime);
        });

        audio.addEventListener('loadedmetadata', () => {
            audioTime.textContent = formatAudioTime(0);
        });

        audioProgress.addEventListener('input', () => {
            const duration = audio.duration || 0;
            const nextTime = duration * (Number(audioProgress.value) / 100);
            audio.currentTime = Number.isFinite(nextTime) ? nextTime : 0;
            setRangeFill(audioProgress, audioProgress.value, audioProgress.max);
        });

        audioVolume.addEventListener('input', () => {
            const volumeLevel = Number(audioVolume.value) / 100;
            audio.volume = volumeLevel;
            audio.muted = volumeLevel === 0;
            setRangeFill(audioVolume, audioVolume.value, audioVolume.max);
            audioMuteBtn.setAttribute('aria-label', audio.muted ? 'Ativar áudio' : 'Silenciar áudio');
            audioMuteBtn.querySelector('span').innerHTML = audio.muted ? '&#128263;' : '&#128266;';
        });

        audioMuteBtn.addEventListener('click', () => {
            audio.muted = !audio.muted;
            audioMuteBtn.setAttribute('aria-label', audio.muted ? 'Ativar áudio' : 'Silenciar áudio');
            audioMuteBtn.querySelector('span').innerHTML = audio.muted ? '&#128263;' : '&#128266;';

            if (!audio.muted && Number(audioVolume.value) === 0) {
                audioVolume.value = '70';
                audio.volume = 0.7;
            }

            if (audio.muted) {
                audio.volume = 0;
            }

            setRangeFill(audioVolume, audioVolume.value, audioVolume.max);
        });
    }

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
    const feedbackDiscursiveClose = feedbackDiscursive ? feedbackDiscursive.querySelector('.feedback-close') : null;

    function updateDiscursiveButtonState() {
        if (discursiveTextarea.disabled) {
            return;
        }

        btnRespondDiscursive.disabled = discursiveTextarea.value.trim().length === 0;
    }

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
        updateDiscursiveButtonState();
        btnEditDiscursive.disabled = true;
        feedbackDiscursive.classList.add('hidden');
        sessionStorage.setItem('discursive_status', 'editing');
    }

    btnRespondDiscursive.addEventListener('click', saveDiscursive);
    btnEditDiscursive.addEventListener('click', editDiscursive);
    discursiveTextarea.addEventListener('input', updateDiscursiveButtonState);

    if (feedbackDiscursiveClose) {
        feedbackDiscursiveClose.addEventListener('click', () => {
            feedbackDiscursive.classList.add('hidden');
        });
    }

    // --- Atividade Objetiva ---
    const objectiveCheckboxes = document.querySelectorAll('input[name="objective"]');
    const btnRespondObjective = document.getElementById('btn-respond-objective');
    const btnEditObjective = document.getElementById('btn-edit-objective');
    const feedbackObjective = document.getElementById('feedback-objective');
    const feedbackObjectiveClose = feedbackObjective ? feedbackObjective.querySelector('.feedback-close') : null;

    objectiveCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                objectiveCheckboxes.forEach(cb => {
                    if (cb !== checkbox) {
                        cb.checked = false;
                        cb.parentElement.classList.remove('selected');
                    }
                });
            }

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

    if (feedbackObjectiveClose) {
        feedbackObjectiveClose.addEventListener('click', () => {
            feedbackObjective.classList.add('hidden');
        });
    }

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
        } else {
            updateDiscursiveButtonState();
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
