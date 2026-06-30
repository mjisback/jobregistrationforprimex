// ===============================================
// PRIMEX JOB PORTAL
// script.js
// PART 1
// Initialization, Validation & Helper Functions
// ===============================================

// ==============================
// GLOBAL VARIABLES
// ==============================

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyByTTviFH-8-ugdOCeggSmu-rR-_f8WYGY18Bee41fIMAR9MZnbpEnNdr_6SUbUYFj/exec";

let form;
let loading;
let submitBtn;
let successModal;

// ==============================
// DOM READY
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    form = document.getElementById("jobForm");
    loading = document.getElementById("loading");
    submitBtn = document.querySelector(".submitBtn");
    successModal = document.getElementById("successModal");

    initializeSlider();
    initializeValidation();
    initializeFileValidation();

    form.addEventListener("submit", submitApplication);

});

// ==============================
// BACKGROUND SLIDER
// ==============================

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

    }, 4000);

}

// ==============================
// VALIDATION
// ==============================

function initializeValidation() {

    lettersOnly("fname");
    lettersOnly("lname");
    lettersOnly("city");
    lettersOnly("state");
    lettersOnly("branch");
    lettersOnly("college");

    numbersOnly("mobile",10);

    numbersOnly("pincode",6);

}

// ==============================
// LETTERS ONLY
// ==============================

function lettersOnly(id){

    const input=document.getElementById(id);

    if(!input) return;

    input.addEventListener("input",function(){

        this.value=this.value.replace(/[^A-Za-z ]/g,'');

    });

}

// ==============================
// NUMBERS ONLY
// ==============================

function numbersOnly(id,max){

    const input=document.getElementById(id);

    if(!input) return;

    input.addEventListener("input",function(){

        this.value=this.value.replace(/\D/g,'');

        if(this.value.length>max){

            this.value=this.value.slice(0,max);

        }

    });

}

// ==============================
// EMAIL VALIDATION
// ==============================

function validEmail(email){

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

// ==============================
// FILE VALIDATION
// ==============================

function initializeFileValidation(){

    validateFile("photo",2);

    validateFile("resume",5);

    validateFile("aadhaar",5);

    validateFile("pan",5);

}

function validateFile(id,maxSize){

    const input=document.getElementById(id);

    if(!input) return;

    input.addEventListener("change",function(){

        if(this.files.length===0) return;

        const file=this.files[0];

        if(file.size>(maxSize*1024*1024)){

            alert(file.name+" exceeds "+maxSize+" MB");

            this.value="";

        }

    });

}

// ==============================
// SHOW LOADING
// ==============================

function showLoading(){

    if(loading){

        loading.style.display="flex";

    }

    if(submitBtn){

        submitBtn.disabled=true;

        submitBtn.innerHTML='<i class="fa fa-spinner fa-spin"></i> Submitting...';

    }

}

// ==============================
// HIDE LOADING
// ==============================

function hideLoading(){

    if(loading){

        loading.style.display="none";

    }

    if(submitBtn){

        submitBtn.disabled=false;

        submitBtn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Submit Application';

    }

}

// ==============================
// FORM VALIDATION
// ==============================

function validateForm(){

    if(!form.checkValidity()){

        form.reportValidity();

        return false;

    }

    const email=document.getElementById("email").value.trim();

    if(!validEmail(email)){

        alert("Invalid Email Address");

        return false;

    }

    if(document.getElementById("mobile").value.length!==10){

        alert("Enter valid Mobile Number");

        return false;

    }

    if(document.getElementById("pincode").value.length!==6){

        alert("Enter valid Pincode");

        return false;

    }

    return true;

}

// ==============================
// SUBMIT BUTTON
// ==============================

async function submitApplication(e){

    e.preventDefault();

    if(!validateForm()){

        return;

    }

    showLoading();

    try{

        await sendToGoogle();

    }

    catch(err){

    hideLoading();

    console.error("FULL ERROR:", err);

    alert(
        "Error Name: " + err.name +
        "\n\nMessage: " + err.message +
        "\n\nSee Console (F12) for details."
    );

}

}

// ===============================================
// PART 2
// Google Apps Script Integration
// ===============================================

// ===============================================
// Convert File To Base64
// ===============================================

function fileToBase64(file){

    return new Promise((resolve,reject)=>{

        if(!file){

            resolve("");

            return;

        }

        const reader=new FileReader();

        reader.onload=function(){

            resolve(reader.result.split(",")[1]);

        };

        reader.onerror=function(error){

            reject(error);

        };

        reader.readAsDataURL(file);

    });

}


// ===============================================
// Send To Google Apps Script
// ===============================================

async function sendToGoogle() {

    console.log("sendToGoogle() started");

    // Collect form values...

    const payload = {
        // all fields...
    };

    console.log("Payload Ready");
    console.log(payload);

    const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    console.log("Fetch completed");

    // Handle response...
}
    // -------------------------
    // File Inputs
    // -------------------------

    const photoInput=document.getElementById("photo");
    const resumeInput=document.getElementById("resume");
    const aadhaarInput=document.getElementById("aadhaar");
    const panInput=document.getElementById("pan");

    const photo=photoInput.files[0]||null;
    const resume=resumeInput.files[0]||null;
    const aadhaar=aadhaarInput.files[0]||null;
    const pan=panInput.files[0]||null;


    // -------------------------
    // Skills
    // -------------------------

    const skills=[];

    document.querySelectorAll(".skills input[type='checkbox']:checked")
    .forEach(item=>{

        skills.push(item.value);

    });


    // -------------------------
    // Payload
    // -------------------------

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

        certifications:document.getElementById("certifications").value,

        experience:document.getElementById("experience").value,

        company:document.getElementById("company").value.trim(),

        designation:document.getElementById("designation").value.trim(),

        currentCTC:document.getElementById("ctc").value,

        expectedCTC:document.getElementById("expected").value,

        notice:document.getElementById("notice").value,

        location:document.getElementById("location").value,

        joiningDate:document.getElementById("joiningDate").value,

        employment:document.getElementById("employment").value,

        summary:document.getElementById("summary").value,

        department:document.getElementById("department").value,

        shift:document.getElementById("shift").value,

        skills:skills.join(", "),

        photoName:photo?photo.name:"",

        resumeName:resume?resume.name:"",

        aadhaarName:aadhaar?aadhaar.name:"",

        panName:pan?pan.name:"",

        photoData:await fileToBase64(photo),

        resumeData:await fileToBase64(resume),

        aadhaarData:await fileToBase64(aadhaar),

        panData:await fileToBase64(pan)

    };


    console.log("Submitting Payload");

    console.log(payload);


    // -------------------------
    // Send Request
    // -------------------------

    const response=await fetch(SCRIPT_URL,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify(payload)

    });


    if(!response.ok){

        hideLoading();

        throw new Error("HTTP Error : "+response.status);

    }


    const result=await response.json();


    if(result.status==="success"){

        hideLoading();

        form.reset();

        if(successModal){

            successModal.style.display="flex";

        }

        console.log(result);

        return;

    }


    hideLoading();

    alert(result.message);

}

// ===============================================
// PART 3
// Success Modal, Reset, Utilities & Final Setup
// ===============================================

// ===============================================
// PAGE LOAD ANIMATION
// ===============================================

window.addEventListener("load", function () {

    document.body.style.opacity = "0";

    setTimeout(function () {

        document.body.style.transition = "opacity 0.6s ease";

        document.body.style.opacity = "1";

    }, 100);

});

// ===============================================
// SUCCESS MODAL
// ===============================================

document.addEventListener("DOMContentLoaded", function () {

    const closeBtn = document.getElementById("closeModal");

    if (closeBtn) {

        closeBtn.addEventListener("click", function () {

            successModal.style.display = "none";

        });

    }

});

// ===============================================
// CLOSE MODAL ON OUTSIDE CLICK
// ===============================================

window.addEventListener("click", function (e) {

    if (successModal && e.target === successModal) {

        successModal.style.display = "none";

    }

});

// ===============================================
// RESET BUTTON
// ===============================================

document.addEventListener("DOMContentLoaded", function () {

    const resetBtn = document.querySelector(".resetBtn");

    if (!resetBtn) return;

    resetBtn.addEventListener("click", function () {

        hideLoading();

        if (successModal) {

            successModal.style.display = "none";

        }

    });

});

// ===============================================
// FILE NAME PREVIEW
// ===============================================

document.querySelectorAll("input[type='file']").forEach(function (input) {

    input.addEventListener("change", function () {

        if (this.files.length > 0) {

            console.log("Selected :", this.files[0].name);

        }

    });

});

// ===============================================
// SCROLL TO TOP
// ===============================================

function scrollTopSmooth() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

// ===============================================
// SUCCESS
// ===============================================

function applicationSuccess(applicationID) {

    hideLoading();

    scrollTopSmooth();

    if (successModal) {

        successModal.style.display = "flex";

    }

    if (form) {

        form.reset();

    }

    console.log("Application ID :", applicationID);

}

// ===============================================
// ERROR
// ===============================================

function applicationError(message) {

    hideLoading();

    console.error(message);

    alert(message);

}

// ===============================================
// GLOBAL ERROR HANDLER
// ===============================================

window.addEventListener("error", function (e) {

    hideLoading();

    console.error("JavaScript Error");

    console.error(e.message);

});

// ===============================================
// UNHANDLED PROMISE
// ===============================================

window.addEventListener("unhandledrejection", function (e) {

    hideLoading();

    console.error("Unhandled Promise");

    console.error(e.reason);

});

// ===============================================
// DEBUG
// ===============================================

console.log("========================================");
console.log(" PRIMEX JOB PORTAL LOADED SUCCESSFULLY ");
console.log("========================================");
console.log("Google Apps Script URL :", SCRIPT_URL);
