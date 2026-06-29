// =======================================
// PRIMEX JOB PORTAL
// script.js - PART 1 (FIXED)
// Initialization, Validation & Submit
// =======================================

// Global Variables
let form;
let loading;
let submitBtn;
let successModal;

// =======================================
// DOM Ready
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    form = document.getElementById("jobForm");
    loading = document.getElementById("loading");
    submitBtn = document.querySelector(".submitBtn");
    successModal = document.getElementById("successModal");

    // =======================================
    // Background Slider
    // =======================================

    const slides = document.querySelectorAll(".slide");

    if (slides.length > 0) {

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

    // =======================================
    // LETTERS ONLY
    // =======================================

    function lettersOnly(id) {

        const input = document.getElementById(id);

        if (!input) return;

        input.addEventListener("input", function () {

            this.value = this.value.replace(/[^A-Za-z ]/g, "");

        });

    }

    lettersOnly("fname");
    lettersOnly("lname");
    lettersOnly("city");
    lettersOnly("state");
    lettersOnly("country");

    // =======================================
    // MOBILE
    // =======================================

    const mobile = document.getElementById("mobile");

    if (mobile) {

        mobile.addEventListener("input", function () {

            this.value = this.value.replace(/\D/g, "");

            if (this.value.length > 10) {

                this.value = this.value.slice(0, 10);

            }

        });

    }

    // =======================================
    // PINCODE
    // =======================================

    const pincode = document.getElementById("pincode");

    if (pincode) {

        pincode.addEventListener("input", function () {

            this.value = this.value.replace(/\D/g, "");

            if (this.value.length > 6) {

                this.value = this.value.slice(0, 6);

            }

        });

    }

    // =======================================
    // EMAIL VALIDATION
    // =======================================

    function validEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }

    // =======================================
    // FILE VALIDATION
    // =======================================

    function validateFile(fileInput, maxSizeMB) {

        if (!fileInput || fileInput.files.length === 0) {

            return true;

        }

        const file = fileInput.files[0];

        const max = maxSizeMB * 1024 * 1024;

        if (file.size > max) {

            alert(file.name + " exceeds " + maxSizeMB + " MB");

            fileInput.value = "";

            return false;

        }

        return true;

    }

    // =======================================
    // SUBMIT FORM
    // =======================================

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const fname = document.getElementById("fname").value.trim();
        const lname = document.getElementById("lname").value.trim();
        const email = document.getElementById("email").value.trim();
        const mobileNo = document.getElementById("mobile").value.trim();
        const address = document.getElementById("address").value.trim();

        if (fname === "") {

            alert("Please enter First Name");

            return;

        }

        if (lname === "") {

            alert("Please enter Last Name");

            return;

        }

        if (!validEmail(email)) {

            alert("Please enter a valid Email Address");

            return;

        }

        if (mobileNo.length !== 10) {

            alert("Please enter a valid 10 digit Mobile Number");

            return;

        }

        if (address === "") {

            alert("Please enter Address");

            return;

        }

        if (!validateFile(document.getElementById("photo"), 2)) return;
        if (!validateFile(document.getElementById("resume"), 5)) return;
        if (!validateFile(document.getElementById("aadhaar"), 5)) return;
        if (!validateFile(document.getElementById("pan"), 5)) return;

        showLoading();

        try {

            await sendToGoogle();

        } catch (err) {

            hideLoading();

            console.error(err);

            alert("Unable to submit application.");

        }

    });

});

// =======================================
// Loading Helpers
// =======================================

function showLoading() {

    if (loading) {

        loading.style.display = "flex";

    }

    if (submitBtn) {

        submitBtn.disabled = true;

        submitBtn.innerHTML =
            '<i class="fa fa-spinner fa-spin"></i> Submitting...';

    }

}

function hideLoading() {

    if (loading) {

        loading.style.display = "none";

    }

    if (submitBtn) {

        submitBtn.disabled = false;

        submitBtn.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Submit Application';

    }

}
// =======================================
// PART 2A (FIXED)
// Google Apps Script Integration
// =======================================

// Your Google Apps Script Web App URL
const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwPsZdwqPx2L-OCjnpK9HPZMwP8FHZsVBwpWzU4AeZbiIpkfeXqFDo03RbZnVbx2I0/exec";


// =======================================
// Convert File To Base64
// =======================================

async function fileToBase64(file){

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


// =======================================
// Send To Google Apps Script
// =======================================

async function sendToGoogle(){

try{

showLoading();


// -----------------------------
// Files
// -----------------------------

const photo=document.getElementById("photo").files[0]||null;

const resume=document.getElementById("resume").files[0]||null;

const aadhaar=document.getElementById("aadhaar").files[0]||null;

const pan=document.getElementById("pan").files[0]||null;


// -----------------------------
// Skills
// -----------------------------

const skills=[];

document
.querySelectorAll(".skills input:checked")
.forEach(skill=>{

skills.push(skill.value);

});


// -----------------------------
// Payload
// -----------------------------

const payload={

firstName:document.getElementById("fname").value.trim(),

lastName:document.getElementById("lname").value.trim(),

email:document.getElementById("email").value.trim(),

mobile:document.getElementById("mobile").value.trim(),

dob:document.getElementById("dob").value,

gender:document.getElementById("gender").value,

marital:document.getElementById("marital").value,

nationality:document.getElementById("nationality").value.trim(),

address:document.getElementById("address").value.trim(),

city:document.getElementById("city").value.trim(),

state:document.getElementById("state").value.trim(),

pincode:document.getElementById("pincode").value.trim(),

country:document.getElementById("country").value.trim(),

linkedin:document.getElementById("linkedin").value.trim(),

portfolio:document.getElementById("portfolio").value.trim(),

qualification:document.getElementById("qualification").value,

branch:document.getElementById("branch").value.trim(),

college:document.getElementById("college").value.trim(),

passingYear:document.getElementById("passingYear").value.trim(),

percentage:document.getElementById("percentage").value.trim(),

backlogs:document.getElementById("backlogs").value,

experience:document.getElementById("experience").value,

company:document.getElementById("company").value.trim(),

designation:document.getElementById("designation").value.trim(),

currentCTC:document.getElementById("ctc").value.trim(),

expectedCTC:document.getElementById("expected").value.trim(),

notice:document.getElementById("notice").value,

summary:document.getElementById("summary").value.trim(),

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


// Debug (remove later if you wish)
console.log(payload);

// =======================================
// Continue in Part 2B
// =======================================
    // =======================================
// PART 2B (FIXED)
// Send Request & Handle Response
// =======================================

// Send to Google Apps Script
const response = await fetch(SCRIPT_URL, {

    method: "POST",

    headers: {

        "Accept": "application/json",

        "Content-Type": "application/json"

    },

    body: JSON.stringify(payload)

});


// Check HTTP Status
if (!response.ok) {

    hideLoading();

    alert("Server Error : " + response.status);

    return;

}


// Read Response
const text = await response.text();

console.log("Server Response :", text);


// Convert to JSON
let result;

try {

    result = JSON.parse(text);

}
catch (err) {

    hideLoading();

    alert("Invalid response received from Google Apps Script.\n\n" + text);

    console.error(err);

    return;

}


// Success
if (result.status === "success") {

    hideLoading();

    if (successModal) {

        successModal.style.display = "flex";

    }

    if (form) {

        form.reset();

    }

    console.log("Application ID :", result.applicationID);

    return;

}


// Server Returned Error
hideLoading();

alert(result.message || "Application could not be submitted.");

}
catch (error) {

    console.error(error);

    hideLoading();

    alert("Unable to connect to Google Apps Script.\n\n" + error.message);

}

}
// =======================================
// PART 3 (FINAL FIXED)
// Success Modal, Reset, Utilities
// =======================================

// Wait until page is fully loaded
window.addEventListener("load", function () {

    // Fade Animation
    document.body.style.opacity = "0";

    setTimeout(() => {

        document.body.style.transition = "opacity 0.8s";

        document.body.style.opacity = "1";

    }, 100);

});


// =======================================
// Success Modal
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    const closeModal = document.getElementById("closeModal");

    if (closeModal) {

        closeModal.addEventListener("click", function () {

            if (successModal) {

                successModal.style.display = "none";

            }

        });

    }

    window.addEventListener("click", function (e) {

        if (successModal && e.target === successModal) {

            successModal.style.display = "none";

        }

    });

});


// =======================================
// Reset Button
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    const resetBtn = document.querySelector(".resetBtn");

    if (resetBtn) {

        resetBtn.addEventListener("click", function () {

            setTimeout(() => {

                hideLoading();

            }, 200);

        });

    }

});


// =======================================
// File Preview
// =======================================

document.querySelectorAll("input[type='file']").forEach(input => {

    input.addEventListener("change", function () {

        if (this.files.length > 0) {

            console.log("Selected File :", this.files[0].name);

        }

    });

});


// =======================================
// Scroll To Top
// =======================================

function scrollTopSmooth() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =======================================
// Application Success
// =======================================

function applicationSuccess() {

    hideLoading();

    scrollTopSmooth();

    if (successModal) {

        successModal.style.display = "flex";

    }

    if (form) {

        form.reset();

    }

}


// =======================================
// Application Error
// =======================================

function applicationError(message) {

    hideLoading();

    alert(message);

}


// =======================================
// Console Message
// =======================================

console.log("======================================");
console.log(" PRIMEX JOB PORTAL LOADED SUCCESSFULLY ");
console.log("======================================");
