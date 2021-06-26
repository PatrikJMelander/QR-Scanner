

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");
const btnScanQRbtn = document.getElementById("btn-scan-qr-btn");
const btnStopQRbtn = document.getElementById("btn-stop-qr-btn");

var refNumber = { String: "", Amount: 1 };
var refNumScanned = [];


let scanning = false;

qrcode.callback = (res) => {
  if (res) {
    outputData.innerText = res;
    scanning = false;

    var checkIfDuplicate = false;

    refNumScanned.forEach((element) => {
      if (element.Ref === res) {
        element.Amount += 1;
        checkIfDuplicate = true;
      }
    });
    if (!checkIfDuplicate) {
      var refNumber = { Ref: res, Amount: 1 };
      refNumScanned.push(refNumber);
    }

    localStorage.setItem("RefNumbersScanned", JSON.stringify(refNumScanned));

    generateTable();

    video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });

    qrResult.hidden = false;
    btnScanQR.hidden = false;
    canvasElement.hidden = true;
  }
};

btnScanQRbtn.onclick = () => {
  startScanner()
};

btnScanQR.onclick = () => {
  startScanner()
};

function startScanner(){ 
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
}


btnStopQRbtn.onclick = () => {
  window.location.replace("./")
  //swal("This function is for future updates")
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

// Defining Scan functon
function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
// Generates the result of every scan in a table
function generateTable() {
  refNumScanned = JSON.parse(localStorage.getItem("RefNumbersScanned"));
  var counter = 1;

  $("#table-for-scanned-references").empty();

  refNumScanned.forEach((element) => {
    $("#table-for-scanned-references").append(`
    <tr>
    <th scope="row">${counter}</th>
    <td>${element.Ref}</td>
    <td>
        <div class="col-3 col-md-2 qty-label d-flex justify-content">
            <span class="text-center px-lg-2" id="amount${element.Ref}"
              >${element.Amount}</span>

        </div>
    </td>
    <td>
        <div class="col-3 col-md-2 d-flex">
        <button id="reduce${element.Ref}" class="btn btn-light reduce-button">
        <img src="../../images/dash-circle-fill.svg"/>
        </button>
            <input type="text" maxlength="2" value="1"  class="adjustAmount${element.Ref} text-center" style="width: 30px">
            <button id="add${element.Ref}" class="btn btn-light add-button">
                <img src="../../images/plus-circle-fill.svg"/>
                </button>
            <button id="trash${element.Ref}" class="btn btn-light trash-button">
            <img src="../../images/trash-fill.svg"/>
            </button>
        </div>
    </td>
  </tr>

  `);

    counter++;

    $(".add-button").on("click", function (e) {
      addAmount(e.currentTarget.id);
    });

    $(".trash-button").on("click", function (e) {
        removeReference(e.currentTarget.id);
      });

      $(".reduce-button").on("click", function (e) {
        reduceAmount(e.currentTarget.id);
      });


  });
  
}
//Functions for all buttons in table
function addAmount(refToAdd) {
  refNumScanned = JSON.parse(localStorage.getItem("RefNumbersScanned"));
  refToAdd = refToAdd.slice(3);
  console.log(refToAdd)

  var amountToAdd = $(".adjustAmount"+refToAdd).val()

  refNumScanned.forEach(element => {
      if (element.Ref == refToAdd){
          element.Amount += parseInt(amountToAdd)
      }
  });
  localStorage.setItem("RefNumbersScanned", JSON.stringify(refNumScanned));
  generateTable();
}


function reduceAmount(refToReduce) {
    refNumScanned = JSON.parse(localStorage.getItem("RefNumbersScanned"));
    refToReduce = refToReduce.slice(6);
  
    var amountToAdd = $(".adjustAmount"+refToReduce).val()
  
    refNumScanned.forEach(element => {
        if (element.Ref == refToReduce){
            element.Amount -= parseInt(amountToAdd)
        }
    });
    localStorage.setItem("RefNumbersScanned", JSON.stringify(refNumScanned));
    generateTable();
  }

  function removeReference(refToRemove){
    refNumScanned = JSON.parse(localStorage.getItem("RefNumbersScanned"));
    refToRemove = refToRemove.slice(5)
    console.log(refToRemove)

    refNumScanned.forEach((element, index) => {
        if (element.Ref == refToRemove){
            refNumScanned.splice(index, 1)
        }
    });
    localStorage.setItem("RefNumbersScanned", JSON.stringify(refNumScanned));
    generateTable();
  }
