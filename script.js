console.log("START");

// =======================
// VARIABLES
// =======================

let logoImage = null;
let qrType = "url";
let scanHistory = [];
let scanner = null;
let cameras = [];
let cameraIndex = 0;

// =======================
// QR SETUP
// =======================

const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "png",
    data: "",
    dotsOptions: {
        color: "#000000",
        type: "rounded"
    },
    backgroundOptions: {
        color: "#ffffff"
    }
});

qrCode.append(document.getElementById("qr-result"));

// =======================
// QR TYPE BUTTONS
// =======================

document.querySelectorAll(".type-btn").forEach(btn => {

    btn.addEventListener("click", function () {

        qrType = this.dataset.type;

        document.getElementById("qrText").placeholder =
            "Enter " + qrType + " data";

    });

});

// =======================
// LOGO UPLOAD
// =======================

document.getElementById("logo").addEventListener("change", function () {

    const file = this.files[0];

    if (file) {
        logoImage = URL.createObjectURL(file);
    }

});

// =======================
// GENERATE QR
// =======================

document.getElementById("generate").addEventListener("click", function () {

    let input = document.getElementById("qrText").value.trim();

    if (!input) {
        alert("Please enter data");
        return;
    }

    let qrData = input;

    switch (qrType) {

        case "email":
            qrData = "mailto:" + input;
            break;

        case "phone":
            qrData = "tel:" + input;
            break;

        case "whatsapp":
            qrData = "https://wa.me/" + input;
            break;

        case "wifi":
            qrData = "WIFI:T:WPA;S:" + input + ";;";
            break;

    }

    qrCode.update({

        data: qrData,

        image: logoImage,

        width: Number(document.getElementById("qrSize").value),

        height: Number(document.getElementById("qrSize").value),

        dotsOptions: {

            color: document.getElementById("qrColor").value,

            type: document.getElementById("qrStyle").value

        },

        backgroundOptions: {

            color: document.getElementById("bgColor").value

        }

    });

});

// =======================
// LIVE SETTINGS
// =======================

document.getElementById("qrColor").addEventListener("input", function () {

    qrCode.update({
        dotsOptions: {
            color: this.value,
            type: document.getElementById("qrStyle").value
        }
    });

});

document.getElementById("bgColor").addEventListener("input", function () {

    qrCode.update({
        backgroundOptions: {
            color: this.value
        }
    });

});

document.getElementById("qrSize").addEventListener("input", function () {

    let size = Number(this.value);

    qrCode.update({
        width: size,
        height: size
    });

});

document.getElementById("qrStyle").addEventListener("change", function () {

    qrCode.update({
        dotsOptions: {
            color: document.getElementById("qrColor").value,
            type: this.value
        }
    });

});

// =======================
// DOWNLOAD
// =======================

document.getElementById("download").addEventListener("click", function () {

    qrCode.download({

        name: "Ahmad-QR-Code",

        extension: "png"

    });

});

// =======================
// DARK MODE
// =======================

document.getElementById("darkMode").addEventListener("click", function () {

    document.body.classList.toggle("dark");

});
// =======================
// COPY RESULT
// =======================

document.getElementById("copyResult").addEventListener("click", function () {

    let result = document.getElementById("scanResult").value;

    if (!result) {
        alert("Nothing to copy");
        return;
    }

    navigator.clipboard.writeText(result);

    alert("Copied Successfully");

});

// =======================
// CLEAR RESULT
// =======================

document.getElementById("clearResult").addEventListener("click", function () {

    document.getElementById("scanResult").value = "";

});

// =======================
// START SCANNER
// =======================

document.getElementById("startScanner").addEventListener("click", function () {

    if (scanner) return;

    scanner = new Html5Qrcode("reader");

    Html5Qrcode.getCameras()

    .then(function (devices) {

        cameras = devices;

        if (devices.length === 0) {

            alert("No camera found");

            return;

        }

        scanner.start(

            devices[cameraIndex].id,

            {
                fps: 10,
                qrbox: 250
            },

            function (decodedText) {

                document.getElementById("scanResult").value = decodedText;

                scanHistory.push(decodedText);

                let li = document.createElement("li");

                li.textContent = decodedText;

                document.getElementById("scanHistory").appendChild(li);

            }

        );

    })

    .catch(function (err) {

        console.log(err);

    });

});

// =======================
// STOP SCANNER
// =======================

document.getElementById("stopScanner").addEventListener("click", function () {

    if (!scanner) return;

    scanner.stop()

    .then(function () {

        scanner.clear();

        scanner = null;

    });

});

// =======================
// SWITCH CAMERA
// =======================

document.getElementById("switchCamera").addEventListener("click", function () {

    if (cameras.length <= 1) {

        alert("Only one camera available");

        return;

    }

    if (!scanner) {

        alert("Start scanner first");

        return;

    }

    scanner.stop()

    .then(function () {

        scanner.clear();

        cameraIndex++;

        if (cameraIndex >= cameras.length) {

            cameraIndex = 0;

        }

        scanner = null;

        document.getElementById("startScanner").click();

    });

});

// =======================
// IMAGE SCANNER
// =======================

document.getElementById("scanImage").addEventListener("click", function () {

    let file = document.getElementById("qrImage").files[0];

    if (!file) {

        alert("Please select an image");

        return;

    }

    const imageScanner = new Html5Qrcode("reader");

imageScanner.scanFile(file, true)

.then(function (decodedText) {

    document.getElementById("scanResult").value = decodedText;

    scanHistory.push(decodedText);

    let li = document.createElement("li");

    li.textContent = decodedText;

    document.getElementById("scanHistory").appendChild(li);

    alert("QR Scanned Successfully");

})

.catch(function (err) {

    console.log(err);

    alert("QR not found");

});

});

console.log("ALL SCRIPT LOADED");