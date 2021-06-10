var wb = XLSX.utils.table_to_book(document.getElementById('tableToExcel'), {sheet:"Scanned References"});
wb.Props = {
    Title: "Scans",
    Subject: "Scan",
    Author: "Patrik Melander",
    CreatedDate: new Date(2021,06,09)
};




var wbout = XLSX.write(wb, {bookType:'xlsx', type: 'binary'});


function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
  $('#create-excel-btn').click(function(){
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'scans.xlsx');
});



$('#clear-scans').click(function(){
localStorage.clear()


});







