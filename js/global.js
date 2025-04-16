let upButton = document.getElementsByClassName("hoverbtn")[0];

    window.onscroll = function () { scrollDisplay() };

    function scrollDisplay() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            upButton.style.display = "block";
        }
        else {
            upButton.style.display = "none";
        }
    }

    function scrollFunction(){
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

//document.addEventListener("DOMContentLoaded", createAd);

function createAd() {
    const adModal = document.getElementById("adModal");
    const closeButton = document.getElementById("closeAd");
    const timerElement = document.getElementById("timer");
    let countdown = 5;
    
    adModal.style.display = "none";

    setTimeout(() => {
        showAd();
    }, 3000); 

    function showAd() {
        if (adModal.style.display === "none") {
            adModal.style.display = "block"; 
            startCountdown();
        }
    }

    function startCountdown() {
        closeButton.disabled = true;
        closeButton.classList.add("welcome-option-button-unactive");

        let countdownInterval = setInterval(() => {
            countdown--;
            timerElement.textContent = countdown;

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                closeButton.disabled = false;
                closeButton.classList.remove("welcome-option-button-unactive");
                closeButton.classList.add("welcome-option-button");
            }
        }, 1000);
    }

    closeButton.addEventListener("click", function () {
        adModal.style.display = "none";
    });
};