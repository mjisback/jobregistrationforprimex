/*==========================================================
 PRIMEX JOB PORTAL
 script.js
 PART 1
 Initialization, Slider, Validation & Helper Functions
==========================================================*/

//==========================================================
// GOOGLE APPS SCRIPT URL
//==========================================================

const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbyByTTviFH-8-ugdOCeggSmu-rR-_f8WYGY18Bee41fIMAR9MZnbpEnNdr_6SUbUYFj/exec";

//==========================================================
// GLOBAL VARIABLES
//==========================================================

let form;
let loading;
let submitBtn;
let successModal;

//==========================================================
// PAGE LOAD
//==========================================================

document.addEventListener("DOMContentLoaded", () => {

    form = document.getElementById("jobForm");
    loading = document.getElementById("loading");
    submitBtn = document.querySelector(".submitBtn");
    successModal = document.getElementById("successModal");

    initializeSlider();
    initializeValidation();
    initializeFileValidation();
    initializeForm();

});

//==========================================================
// BACKGROUND SLIDER
//==========================================================

function initializeSlider() {

    const slides = document.querySelectorAll(".slide");

    if (slides.length === 0) return;

    let current = 0;

    slides[current].classList.add("active");

    setInterval(() => {

        slides[current].classList.remove("active");

        current++;

        if (current >= slides.length) {
            current = 0;
        }

        slides[current].classList.add("active");

    }, 3000);

}

//==========================================================
// LETTERS ONLY
//==========================================================

function lettersOnly(id) {

    const input = document.getElementById(id);

    if (!input) return;

    input.addEventListener("input", function () {

        this.value = this.value.replace(/[^a-zA-Z ]/g, "");

    });

}

//==========================================================
// NUMBERS ONLY
//==========================================================

function numbersOnly(id, maxLength) {

    const input = document.getElementById(id);

    if (!input) return;

    input.addEventListener("input", function () {

        this.value = this.value.replace(/\D/g, "");

        if (this.value.length > maxLength) {

            this.value = this.value.slice(0, maxLength);

        }

    });

}

//==========================================================
// EMAIL VALIDATION
//==========================================================

function validEmail(email) {

    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

}

//==========================================================
// FILE SIZE VALIDATION
//==========================================================

function validateFile(fileInput, maxMB) {

    if (!fileInput) return true;

    if (fileInput.files.length === 0) return true;

    const file = fileInput.files[0];

    const maxSize = maxMB * 1024 * 1024;

    if (file.size > maxSize) {

        alert(file.name + " exceeds " + maxMB + " MB.");

        fileInput.value = "";

        return false;

    }

    return true;

}

//==========================================================
// INITIALIZE FIELD VALIDATION
//==========================================================

function initializeValidation() {

    lettersOnly("fname");
    lettersOnly("lname");
    lettersOnly("city");
    lettersOnly("state");

    numbersOnly("mobile", 10);
    numbersOnly("pincode", 6);

}

//==========================================================
// FILE VALIDATION EVENTS
//==========================================================

function initializeFileValidation() {

    const photo = document.getElementById("photo");
    const resume = document.getElementById("resume");
    const aadhaar = document.getElementById("aadhaar");
    const pan = document.getElementById("pan");

    if (photo)
        photo.addEventListener("change", () => validateFile(photo, 2));

    if (resume)
        resume.addEventListener("change", () => validateFile(resume, 5));

    if (aadhaar)
        aadhaar.addEventListener("change", () => validateFile(aadhaar, 5));

    if (pan)
        pan.addEventListener("change", () => validateFile(pan, 5));

}

//==========================================================
// LOADING
//==========================================================

function showLoading() {

    if (loading)
        loading.style.display = "flex";

    if (submitBtn) {

        submitBtn.disabled = true;

        submitBtn.innerHTML =
            '<i class="fa fa-spinner fa-spin"></i> Submitting...';

    }

}

function hideLoading() {

    if (loading)
        loading.style.display = "none";

    if (submitBtn) {

        submitBtn.disabled = false;

        submitBtn.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Submit Application';

    }

}

//==========================================================
// CONVERT FILE TO BASE64
//==========================================================

function fileToBase64(file) {

    return new Promise((resolve, reject) => {

        if (!file) {

            resolve("");

            return;

        }

        const reader = new FileReader();

        reader.onload = function () {

            resolve(reader.result.split(",")[1]);

        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}

//==========================================================
// INITIALIZE FORM
//==========================================================

function initializeForm() {

    if (!form) return;

    form.addEventListener("submit", submitApplication);

}

/*==========================================================
 PART 2
 Submit Form, Create Payload & Send to Google Apps Script
==========================================================*/

async function submitApplication(e) {

    e.preventDefault();

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const email = document.getElementById("email").value.trim();

    if (!validEmail(email)) {
        alert("Please enter a valid Email Address.");
        return;
    }

    if (!validateFile(document.getElementById("photo"),2)) return;
    if (!validateFile(document.getElementById("resume"),5)) return;
    if (!validateFile(document.getElementById("aadhaar"),5)) return;
    if (!validateFile(document.getElementById("pan"),5)) return;

    showLoading();

    try{

        //--------------------------------------------------
        // FILES
        //--------------------------------------------------

        const photo=document.getElementById("photo").files[0] || null;
        const resume=document.getElementById("resume").files[0] || null;
        const aadhaar=document.getElementById("aadhaar").files[0] || null;
        const pan=document.getElementById("pan").files[0] || null;

        //--------------------------------------------------
        // SKILLS
        //--------------------------------------------------

        const skills=[];

        document.querySelectorAll(".skills input[type='checkbox']:checked")
        .forEach(item=>skills.push(item.value));

        //--------------------------------------------------
        // PAYLOAD
        //--------------------------------------------------

        const payload={

            firstName:document.getElementById("fname").value.trim(),
            lastName:document.getElementById("lname").value.trim(),
            email:document.getElementById("email").value.trim(),
            mobile:document.getElementById("mobile").value.trim(),

            dob:document.getElementById("dob").value,
            gender:document.getElementById("gender").value,
            marital:document.getElementById("marital").value,

            nationality:document.getElementById("nationality").value,
            address:document.getElementById("address").value.trim(),
            city:document.getElementById("city").value.trim(),
            state:document.getElementById("state").value.trim(),
            pincode:document.getElementById("pincode").value.trim(),
            country:document.getElementById("country").value,

            linkedin:document.getElementById("linkedin").value.trim(),
            portfolio:document.getElementById("portfolio").value.trim(),

            qualification:document.getElementById("qualification").value,
            branch:document.getElementById("branch").value.trim(),
            college:document.getElementById("college").value.trim(),
            passingYear:document.getElementById("passingYear").value,
            percentage:document.getElementById("percentage").value,
            backlogs:document.getElementById("backlogs").value,

            experience:document.getElementById("experience").value,
            company:document.getElementById("company").value.trim(),
            designation:document.getElementById("designation").value.trim(),

            currentCTC:document.getElementById("ctc").value,
            expectedCTC:document.getElementById("expected").value,
            notice:document.getElementById("notice").value,

            summary:document.getElementById("summary").value.trim(),

            skills:skills.join(", "),

            photoName:photo ? photo.name : "",
            resumeName:resume ? resume.name : "",
            aadhaarName:aadhaar ? aadhaar.name : "",
            panName:pan ? pan.name : "",

            photoData:await fileToBase64(photo),
            resumeData:await fileToBase64(resume),
            aadhaarData:await fileToBase64(aadhaar),
            panData:await fileToBase64(pan)

        };

        console.log("Sending Payload...");
        console.log(payload);

        //--------------------------------------------------
        // SEND DATA
        //--------------------------------------------------

        const response=await fetch(SCRIPT_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(payload)

        });

        const text=await response.text();

        console.log("Raw Response:",text);

        let result;

        try{

            result=JSON.parse(text);

        }catch(err){

            hideLoading();

            alert("Google Apps Script returned invalid JSON.");

            console.error(text);

            return;

        }

        //--------------------------------------------------
        // SUCCESS
        //--------------------------------------------------

        if(result.status==="success"){

            hideLoading();

            applicationSuccess(result.applicationID);

            return;

        }

        //--------------------------------------------------
        // ERROR FROM SERVER
        //--------------------------------------------------

        hideLoading();

        applicationError(result.message);

    }

    catch(error){

        hideLoading();

        console.error(error);

        applicationError(error.message);

    }

}

/*==========================================================
 PART 3
 Success Modal, Reset, Utilities & Final Initialization
==========================================================*/

//==========================================================
// APPLICATION SUCCESS
//==========================================================

function applicationSuccess(applicationID) {

    hideLoading();

    if (successModal) {
        successModal.style.display = "flex";
    }

    if (form) {
        form.reset();
    }

    scrollTopSmooth();

    console.log("==================================");
    console.log("Application Submitted Successfully");
    console.log("Application ID:", applicationID);
    console.log("==================================");

}

//==========================================================
// APPLICATION ERROR
//==========================================================

function applicationError(message) {

    hideLoading();

    alert(message || "Unable to submit application.");

}

//==========================================================
// SCROLL TO TOP
//==========================================================

function scrollTopSmooth() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

//==========================================================
// WINDOW LOAD ANIMATION
//==========================================================

window.addEventListener("load", () => {

    document.body.style.opacity = "0";

    setTimeout(() => {

        document.body.style.transition = "opacity .5s";

        document.body.style.opacity = "1";

    },100);

});

//==========================================================
// SUCCESS MODAL EVENTS
//==========================================================

document.addEventListener("DOMContentLoaded",()=>{

    const closeBtn=document.getElementById("closeModal");

    if(closeBtn){

        closeBtn.addEventListener("click",()=>{

            successModal.style.display="none";

        });

    }

});

//==========================================================
// CLOSE MODAL OUTSIDE CLICK
//==========================================================

window.addEventListener("click",(e)=>{

    if(successModal && e.target===successModal){

        successModal.style.display="none";

    }

});

//==========================================================
// RESET BUTTON
//==========================================================

document.addEventListener("DOMContentLoaded",()=>{

    const resetBtn=document.querySelector(".resetBtn");

    if(resetBtn){

        resetBtn.addEventListener("click",()=>{

            hideLoading();

        });

    }

});

//==========================================================
// FILE PREVIEW LOG
//==========================================================

document.querySelectorAll("input[type='file']").forEach(input=>{

    input.addEventListener("change",function(){

        if(this.files.length){

            console.log("Selected File:",this.files[0].name);

        }

    });

});

//==========================================================
// CONSOLE
//==========================================================

console.log("======================================");
console.log(" PRIMEX JOB PORTAL READY ");
console.log(" Google Apps Script Connected ");
console.log("======================================");
