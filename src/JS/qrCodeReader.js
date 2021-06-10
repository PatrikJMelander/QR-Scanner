//const qrcode = window.qrcode; already defined

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

var refNumber = {String:"" , Amount:1}
var refNumScanned = [];

let scanning = false;

qrcode.callback = (res) => {
    
    if (res) {
      outputData.innerText = res;
      scanning = false;

      var checkIfDuplicate = false
        
      refNumScanned.forEach(element => {
          if (element.Ref===res){
              console.log("hittar en duplicate")
            element.Amount += 1;
            console.log("nytt amount värde är " + element.Amount)
            checkIfDuplicate = true;
          }

      });
       if (!checkIfDuplicate){
        var refNumber = {Ref:res , Amount:1};
        refNumScanned.push(refNumber)
      } 
      
      localStorage.setItem("RefNumbersScanned", JSON.stringify(refNumScanned))
      
      generateTable()
  
      video.srcObject.getTracks().forEach(track => {
        track.stop();
      });

  
      qrResult.hidden = false;
      btnScanQR.hidden = false;
      canvasElement.hidden = true;
    }
    };

  btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
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

  function generateTable(){ 
    refNumScanned = JSON.parse(localStorage.getItem("RefNumbersScanned"));
    var counter = 1

    $("#table-for-scanned-references").empty();

    refNumScanned.forEach((element) => {
    $("#table-for-scanned-references").append(`
    <tr>
    <th scope="row">${counter}</th>
    <td>${element.Ref}</td>
    <td>
        <div class="col-3 col-md-2 qty-label d-flex justify-content">
            <button id="decrese${element.Ref}" class="btn btn-light decrease-button">
                <img src="./images/dash-circle-fill.svg" />
            </button>
            <span class="border text-center px-lg-2 quantity" id="amount${
              element.Ref
            }"
              >${element.Amount}</span
            >
            <button id="add${element.Ref}" class="btn btn-light increase-button">
                <img src="./images/plus-circle-fill.svg" />
            </button>
        </div>
    </td>
  </tr>

  `);
  counter++;
 /*  $(".decrease-button}").on("click", function (e) {
    removeAmount(+e.target.id);
  });

  $(".increase-button").on("click", function (e) {
    addAmount(+e.target.id);
  });*/
  });
}

/* function addAmount(product) {
    let cartQuantity = JSON.parse(localStorage.getItem("RefNumbersScanned"));
    let cartTemp = JSON.parse(localStorage.getItem("cart"));
    cartTemp.forEach((element) => {
      if (element.sku == product) {
        if (element.inCart < 99) {
          element.inCart += 1;
          addToTotalPrice(element);
          cartQuantity += 1;
          document.getElementById("total-items-in-cart").innerHTML = cartQuantity;
        }
      }
    });
    localStorage.setItem("cart", JSON.stringify(cartTemp));
    updateCartQuantity();
    $("#priceOutput").text(
      JSON.parse(localStorage.getItem("cartTotalPrice")).toLocaleString(
        "sv-SE",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )
    );
    localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
  }
  
  function removeAmount(product) {
    let cartQuantity = JSON.parse(localStorage.getItem("cartQuantity"));
    let cartTemp = JSON.parse(localStorage.getItem("cart"));
    cartTemp.forEach((element) => {
      if (element.sku == product) {
        if (element.inCart !== 1) {
          element.inCart -= 1;
          removeFromTotalPrice(element);
          cartQuantity -= 1;
          document.getElementById("total-items-in-cart").innerHTML = cartQuantity;
        }
      }
    });
    localStorage.setItem("cart", JSON.stringify(cartTemp));
    updateCartQuantity();
    $("#priceOutput").text(
      JSON.parse(localStorage.getItem("cartTotalPrice")).toLocaleString(
        "sv-SE",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )
    );
    localStorage.setItem("cartQuantity", JSON.stringify(cartQuantity));
  } */