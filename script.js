//======================================================
// PRIMEX JOB PORTAL
// script.js
// PART 1
//======================================================

//------------------------------------------------------
// GOOGLE APPS SCRIPT URL
//------------------------------------------------------

const SCRIPT_URL = "YOUR_WEB_APP_URL_HERE";

//------------------------------------------------------
// GLOBAL VARIABLES
//------------------------------------------------------

let form;
let loading;
let submitBtn;
let successModal;

//------------------------------------------------------
// PAGE LOAD
//------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    form = document.getElementById("jobForm");
    loading = document.getElementById("loading");
    submitBtn = document.querySelector(".submitBtn");
    successModal = document.getElementById("successModal");

    startSlider();

    initializeValidation();

    initializeForm();

});

//======================================================
// BACKGROUND IMAGE SLIDER
//======================================================

function startSlider() {

    const slides = document.querySelectorAll(".slide");

    if (slides.length === 0) return;

    let current = 0;

    slides[current].classList.add("active");

    setInterval(() => {

        slides[current].classList.remove("active");

        current++;

        if (current >= slides.length)
            current = 0;

        slides[current].classList.add("active");

    }, 3000);

}

//======================================================
// INPUT VALIDATION
//======================================================

function initializeValidation() {

    lettersOnly("fname");
    lettersOnly("lname");
    lettersOnly("city");
    lettersOnly("state");

    numbersOnly("mobile",10);

    numbersOnly("pincode",6);

}

//------------------------------------------------------
// LETTERS ONLY
//------------------------------------------------------

function lettersOnly(id){

    const input=document.getElementById(id);

    if(!input) return;

    input.addEventListener("input",function(){

        this.value=this.value.replace(/[^A-Za-z ]/g,"");

    });

}

//------------------------------------------------------
// NUMBERS ONLY
//------------------------------------------------------

function numbersOnly(id,max){

    const input=document.getElementById(id);

    if(!input) return;

    input.addEventListener("input",function(){

        this.value=this.value.replace(/\D/g,"");

        if(this.value.length>max){

            this.value=this.value.substring(0,max);

        }

    });

}

//======================================================
// EMAIL VALIDATION
//======================================================

function validEmail(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

//======================================================
// FILE VALIDATION
//======================================================

function validateFile(input,maxMB){

    if(!input || input.files.length===0)
        return true;

    const file=input.files[0];

    const max=maxMB*1024*1024;

    if(file.size>max){

        alert(file.name+" exceeds "+maxMB+" MB");

        input.value="";

        return false;

    }

    return true;

}

//======================================================
// LOADING
//======================================================

function showLoading(){

    if(loading){

        loading.style.display="flex";

    }

    if(submitBtn){

        submitBtn.disabled=true;

        submitBtn.innerHTML='<i class="fa fa-spinner fa-spin"></i> Submitting...';

    }

}

function hideLoading(){

    if(loading){

        loading.style.display="none";

    }

    if(submitBtn){

        submitBtn.disabled=false;

        submitBtn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Submit Application';

    }

}

//======================================================
// INITIALIZE FORM
//======================================================

function initializeForm(){

    if(!form) return;

    form.addEventListener("submit",submitApplication);

}

//======================================================
// SUBMIT
//======================================================

async function submitApplication(e){

    e.preventDefault();

    if(!form.checkValidity()){

        form.reportValidity();

        return;

    }

    const email=document.getElementById("email").value.trim();

    const mobile=document.getElementById("mobile").value.trim();

    if(!validEmail(email)){

        alert("Invalid Email");

        return;

    }

    if(mobile.length!==10){

        alert("Invalid Mobile Number");

        return;

    }

    if(!validateFile(document.getElementById("photo"),2)) return;
    if(!validateFile(document.getElementById("resume"),5)) return;
    if(!validateFile(document.getElementById("aadhaar"),5)) return;
    if(!validateFile(document.getElementById("pan"),5)) return;

    showLoading();

    try{

        await sendToGoogle();

    }
    catch(error){

        console.error(error);

        hideLoading();

        alert("Unable to submit application.");

    }

}

//======================================================
// PART 2
// Google Apps Script Integration
//======================================================

//------------------------------------------------------
// Convert File To Base64
//------------------------------------------------------

function fileToBase64(file) {

    return new Promise((resolve, reject) => {

        if (!file) {
            resolve("");
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {

            resolve(e.target.result.split(",")[1]);

        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}

//======================================================
// SEND TO GOOGLE APPS SCRIPT
//======================================================

async function sendToGoogle() {

    //--------------------------------------------------
    // FILE INPUTS
    //--------------------------------------------------

    const photoInput = document.getElementById("photo");
    const resumeInput = document.getElementById("resume");
    const aadhaarInput = document.getElementById("aadhaar");
    const panInput = document.getElementById("pan");

    const photo = photoInput.files.length ? photoInput.files[0] : null;
    const resume = resumeInput.files.length ? resumeInput.files[0] : null;
    const aadhaar = aadhaarInput.files.length ? aadhaarInput.files[0] : null;
    const pan = panInput.files.length ? panInput.files[0] : null;

    //--------------------------------------------------
    // SKILLS
    //--------------------------------------------------

    const skills = [];

    document.querySelectorAll(".skills input[type='checkbox']:checked")
        .forEach(item => {

            skills.push(item.value);

        });

    //--------------------------------------------------
    // PAYLOAD
    //--------------------------------------------------

    const payload = {

        firstName: document.getElementById("fname").value.trim(),
        lastName: document.getElementById("lname").value.trim(),
        email: document.getElementById("email").value.trim(),
        mobile: document.getElementById("mobile").value.trim(),
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        marital: document.getElementById("marital").value,
        nationality: document.getElementById("nationality").value,
        address: document.getElementById("address").value.trim(),
        city: document.getElementById("city").value.trim(),
        state: document.getElementById("state").value.trim(),
        pincode: document.getElementById("pincode").value,
        country: document.getElementById("country").value,
        linkedin: document.getElementById("linkedin").value.trim(),
        portfolio: document.getElementById("portfolio").value.trim(),

        qualification: document.getElementById("qualification").value,
        branch: document.getElementById("branch").value.trim(),
        college: document.getElementById("college").value.trim(),
        passingYear: document.getElementById("passingYear").value,
        percentage: document.getElementById("percentage").value,
        backlogs: document.getElementById("backlogs").value,

        experience: document.getElementById("experience").value,
        company: document.getElementById("company").value.trim(),
        designation: document.getElementById("designation").value.trim(),
        currentCTC: document.getElementById("ctc").value,
        expectedCTC: document.getElementById("expected").value,
        notice: document.getElementById("notice").value,
        summary: document.getElementById("summary").value.trim(),

        department: document.getElementById("department").value,
        shift: document.getElementById("shift").value,

        skills: skills.join(", "),

        photoName: photo ? photo.name : "",
        resumeName: resume ? resume.name : "",
        aadhaarName: aadhaar ? aadhaar.name : "",
        panName: pan ? pan.name : "",

        photoData: await fileToBase64(photo),
        resumeData: await fileToBase64(resume),
        aadhaarData: await fileToBase64(aadhaar),
        panData: await fileToBase64(pan)

    };

    console.log("Submitting Payload...");
    console.log(payload);

    //--------------------------------------------------
    // SEND REQUEST
    //--------------------------------------------------

    try {

        const response = await fetch(SCRIPT_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(payload)

        });

        const text = await response.text();

        console.log("Server Response:");
        console.log(text);

        let result;

        try {

            result = JSON.parse(text);

        } catch {

            hideLoading();

            alert("Invalid response from server.");

            return;

        }

        //--------------------------------------------------
        // SUCCESS
        //--------------------------------------------------

        if (result.status === "success") {

            hideLoading();

            form.reset();

            if (successModal) {

                successModal.style.display = "flex";

            }

            console.log(result.applicationID);

            return;

        }

        //--------------------------------------------------
        // SERVER ERROR
        //--------------------------------------------------

        hideLoading();

        alert(result.message || "Application could not be submitted.");

    }

    catch (error) {

        console.error(error);

        hideLoading();

        alert("Unable to connect to Google Apps Script.");

    }

}

//======================================================
// PART 3
// Success Modal, Reset, Utilities
//======================================================

//------------------------------------------------------
// PAGE LOADED
//------------------------------------------------------

window.addEventListener("load", () => {

    document.body.style.opacity = "0";

    setTimeout(() => {

        document.body.style.transition = "opacity 0.6s";

        document.body.style.opacity = "1";

    }, 100);

});

//------------------------------------------------------
// SUCCESS MODAL
//------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    const closeBtn = document.getElementById("closeModal");

    if (closeBtn) {

        closeBtn.addEventListener("click", () => {

            successModal.style.display = "none";

        });

    }

    window.addEventListener("click", function (e) {

        if (e.target === successModal) {

            successModal.style.display = "none";

        }

    });

});

//------------------------------------------------------
// RESET BUTTON
//------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    const resetBtn = document.querySelector(".resetBtn");

    if (resetBtn) {

        resetBtn.addEventListener("click", () => {

            hideLoading();

        });

    }

});

//------------------------------------------------------
// FILE NAME PREVIEW
//------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("input[type='file']").forEach(input => {

        input.addEventListener("change", function () {

            if (this.files.length > 0) {

                console.log("Selected:", this.files[0].name);

            }

        });

    });

});

//------------------------------------------------------
// SCROLL TO TOP
//------------------------------------------------------

function scrollTopSmooth() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

//------------------------------------------------------
// SUCCESS
//------------------------------------------------------

function applicationSuccess(applicationID) {

    hideLoading();

    scrollTopSmooth();

    if (successModal) {

        successModal.style.display = "flex";

    }

    if (form) {

        form.reset();

    }

    console.log("Application Submitted");

    console.log("Application ID:", applicationID);

}

//------------------------------------------------------
// ERROR
//------------------------------------------------------

function applicationError(message) {

    hideLoading();

    alert(message);

}

//------------------------------------------------------
// CONSOLE MESSAGE
//------------------------------------------------------

console.log("=======================================");
console.log(" PRIMEX JOB PORTAL LOADED SUCCESSFULLY ");
console.log("=======================================");
