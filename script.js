// =======================================
// PRIMEX JOB PORTAL
// script.js (Part 1)
// =======================================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("jobForm");
    const loading = document.getElementById("loading");
    const submitBtn = document.querySelector(".submitBtn");

    // =======================================
    // Background Image Slider
    // =======================================

    const slides = document.querySelectorAll(".slide");

    let current = 0;

    function backgroundSlider() {

        slides[current].classList.remove("active");

        current++;

        if (current >= slides.length) {
            current = 0;
        }

        slides[current].classList.add("active");

    }

    setInterval(backgroundSlider,3000);

    // =======================================
    // Input Restrictions
    // =======================================

    function lettersOnly(input){

        input.addEventListener("input",function(){

            this.value=this.value.replace(/[^A-Za-z ]/g,'');

        });

    }

    lettersOnly(document.getElementById("fname"));
    lettersOnly(document.getElementById("lname"));
    lettersOnly(document.getElementById("city"));
    lettersOnly(document.getElementById("state"));
    lettersOnly(document.getElementById("country"));

    // =======================================
    // Mobile Number
    // =======================================

    const mobile=document.getElementById("mobile");

    mobile.addEventListener("input",function(){

        this.value=this.value.replace(/\D/g,'');

        if(this.value.length>10){

            this.value=this.value.slice(0,10);

        }

    });

    // =======================================
    // Pincode
    // =======================================

    const pincode=document.getElementById("pincode");

    pincode.addEventListener("input",function(){

        this.value=this.value.replace(/\D/g,'');

        if(this.value.length>6){

            this.value=this.value.slice(0,6);

        }

    });

    // =======================================
    // Email Validation
    // =======================================

    function validEmail(email){

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    }

    // =======================================
    // File Validation
    // =======================================

    function validateFile(fileInput,maxSizeMB){

        if(fileInput.files.length===0){

            return true;

        }

        const file=fileInput.files[0];

        const max=maxSizeMB*1024*1024;

        if(file.size>max){

            alert(file.name+" exceeds "+maxSizeMB+" MB");

            fileInput.value="";

            return false;

        }

        return true;

    }

    // =======================================
    // Submit Validation
    // =======================================

    form.addEventListener("submit",function(e){

        e.preventDefault();

        const fname=document.getElementById("fname").value.trim();
        const lname=document.getElementById("lname").value.trim();
        const email=document.getElementById("email").value.trim();
        const mobile=document.getElementById("mobile").value.trim();
        const address=document.getElementById("address").value.trim();

        if(fname===""){

            alert("Enter First Name");

            return;

        }

        if(lname===""){

            alert("Enter Last Name");

            return;

        }

        if(!validEmail(email)){

            alert("Enter Valid Email");

            return;

        }

        if(mobile.length!==10){

            alert("Enter Valid Mobile Number");

            return;

        }

        if(address===""){

            alert("Enter Address");

            return;

        }

        // File Checks

        if(!validateFile(document.getElementById("photo"),2)) return;

        if(!validateFile(document.getElementById("resume"),5)) return;

        if(!validateFile(document.getElementById("aadhaar"),5)) return;

        if(!validateFile(document.getElementById("pan"),5)) return;

        // Show Loader

        loading.style.display="flex";

        submitBtn.disabled=true;

        submitBtn.innerHTML="<i class='fa fa-spinner fa-spin'></i> Submitting...";

        // Next Part will upload to Google Apps Script

        sendToGoogle();

    });

});
// =======================================
// PART 2
// Google Sheets + Drive Upload
// =======================================

// Replace with your deployed Apps Script Web App URL
const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwPsZdwqPx2L-OCjnpK9HPZMwP8FHZsVBwpWzU4AeZbiIpkfeXqFDo03RbZnVbx2I0/exec";


// Convert File to Base64
async function fileToBase64(file){

    return new Promise((resolve,reject)=>{

        if(!file){
            resolve("");
            return;
        }

        const reader=new FileReader();

        reader.onload=()=>{

            resolve(reader.result.split(",")[1]);

        };

        reader.onerror=error=>reject(error);

        reader.readAsDataURL(file);

    });

}



// =======================================
// Send Data to Google Apps Script
// =======================================

async function sendToGoogle(){

try{

// Files

const photo=document.getElementById("photo").files[0];

const resume=document.getElementById("resume").files[0];

const aadhaar=document.getElementById("aadhaar").files[0];

const pan=document.getElementById("pan").files[0];


// Skills

let skills=[];

document.querySelectorAll(".skills input:checked").forEach(skill=>{

skills.push(skill.value);

});


// Create Payload

const payload={

firstName:document.getElementById("fname").value,

lastName:document.getElementById("lname").value,

email:document.getElementById("email").value,

mobile:document.getElementById("mobile").value,

dob:document.getElementById("dob").value,

gender:document.getElementById("gender").value,

marital:document.getElementById("marital").value,

nationality:document.getElementById("nationality").value,

address:document.getElementById("address").value,

city:document.getElementById("city").value,

state:document.getElementById("state").value,

pincode:document.getElementById("pincode").value,

country:document.getElementById("country").value,

linkedin:document.getElementById("linkedin").value,

portfolio:document.getElementById("portfolio").value,

qualification:document.getElementById("qualification").value,

branch:document.getElementById("branch").value,

college:document.getElementById("college").value,

passingYear:document.getElementById("passingYear").value,

percentage:document.getElementById("percentage").value,

backlogs:document.getElementById("backlogs").value,

experience:document.getElementById("experience").value,

company:document.getElementById("company").value,

designation:document.getElementById("designation").value,

currentCTC:document.getElementById("ctc").value,

expectedCTC:document.getElementById("expected").value,

notice:document.getElementById("notice").value,

summary:document.getElementById("summary").value,

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


// Send

const response=await fetch(SCRIPT_URL,{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(payload)

});


const result=await response.json();


// Success

if(result.status==="success"){

loading.style.display="none";

submitBtn.disabled=false;

submitBtn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Submit Application';

document.getElementById("successModal").style.display="flex";

form.reset();

}


// Error

else{

loading.style.display="none";

submitBtn.disabled=false;

submitBtn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Submit Application';

alert(result.message);

}


}catch(error){

console.error(error);

loading.style.display="none";

submitBtn.disabled=false;

submitBtn.innerHTML='<i class="fa-solid fa-paper-plane"></i> Submit Application';

alert("Unable to connect to server.");

}

}
// =======================================
// PART 3
// Success Modal, Reset, Utilities
// =======================================

// Hide Loading
function hideLoading() {

    loading.style.display = "none";

    submitBtn.disabled = false;

    submitBtn.innerHTML =
    '<i class="fa-solid fa-paper-plane"></i> Submit Application';

}

// Show Loading
function showLoading() {

    loading.style.display = "flex";

    submitBtn.disabled = true;

    submitBtn.innerHTML =
    '<i class="fa fa-spinner fa-spin"></i> Uploading...';

}


// =======================================
// Success Modal
// =======================================

const successModal = document.getElementById("successModal");

const closeModal = document.getElementById("closeModal");


closeModal.addEventListener("click", function () {

    successModal.style.display = "none";

});


window.addEventListener("click", function (e) {

    if (e.target == successModal) {

        successModal.style.display = "none";

    }

});


// =======================================
// Reset Button
// =======================================

document.querySelector(".resetBtn")
.addEventListener("click", function () {

setTimeout(() => {

loading.style.display = "none";

submitBtn.disabled = false;

submitBtn.innerHTML =
'<i class="fa-solid fa-paper-plane"></i> Submit Application';

}, 200);

});


// =======================================
// File Preview
// =======================================

document.querySelectorAll("input[type=file]")

.forEach(file => {

file.addEventListener("change", function () {

if (this.files.length > 0) {

console.log("Selected :", this.files[0].name);

}

});

});


// =======================================
// Fade Animation
// =======================================

window.onload = function () {

document.body.style.opacity = "0";

setTimeout(() => {

document.body.style.transition = "opacity .8s";

document.body.style.opacity = "1";

},100);

};


// =======================================
// Auto Scroll
// =======================================

function scrollTopSmooth(){

window.scrollTo({

top:0,

behavior:"smooth"

});

}


// =======================================
// Form Submitted
// =======================================

function applicationSuccess(){

hideLoading();

scrollTopSmooth();

successModal.style.display="flex";

form.reset();

}


// =======================================
// Network Error
// =======================================

function applicationError(msg){

hideLoading();

alert(msg);

}


// =======================================
// Console
// =======================================

console.log("PRIMEX Job Portal Loaded Successfully");