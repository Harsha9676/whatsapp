'use strict';  

document.getElementById('upload').addEventListener('change', handleFileSelect, false);
document.getElementById('numberSelect').addEventListener('change', handleColumnSelect, false);
var jobj;
chrome.tabs.query({active: true,currentWindow: true}, (tabs) => {  
    
    var tab = tabs[0];  
    var url = tab.url;
    console.log(url);
    var isWAOpen = url.includes("web.whatsapp.com");
    if(!isWAOpen){
       window.open("https://web.whatsapp.com/");
    }
});

let GetURL = document.getElementById('GetURL');
GetURL.onclick = function(element) {  
  var rcvr = document.getElementById("rcvr").value;
  var msg = document.getElementById("msg").value;
  sendNow(rcvr, msg);
};

function sendNow(rcvr, msg) {
  console.log('here');
  var queryInfo = {  
    active: true,  
    currentWindow: true  
  };    
  chrome.tabs.query(queryInfo, (tabs) => {  
      var tab = tabs[0];  
      var url = tab.url;
      console.log(url);
      var m = {r : rcvr, m : msg};
      //chrome.tabs.sendMessage(tab.id, m);
      if(window.injected == undefined){
        window.injected = true;
        chrome.tabs.executeScript(tab.id,{file: "content_script.js"}, function() {
          chrome.tabs.sendMessage(tab.id, m);
        });
      }else{
        chrome.tabs.sendMessage(tab.id, m);
      }
      
  });
}  


 function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
  }
  
  function handleColumnSelect(evt){
    var yourSelect = document.getElementById("numberSelect");
    var selected = yourSelect.options[ yourSelect.selectedIndex ];
    if(jobj !== undefined && jobj.length > 0){
      var numbers = [];
      for(var i=0;i<jobj.length;i++){
        numbers.push(jobj[i][selected.value]);
      }
      document.getElementById('rcvr').value = numbers;
    }
  }


    var ExcelToJSON = function() {

      this.parseExcel = function(file) {
        var reader = new FileReader();

        reader.onload = function(e) {
          var data = e.target.result;
          var workbook = XLSX.read(data, {
            type: 'binary'
          });
          workbook.SheetNames.forEach(function(sheetName) {
            var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            var json_object = JSON.stringify(XL_row_object);
            jobj = JSON.parse(json_object);
            console.log(jobj);

            if(jobj.length > 0){
              var headers = [];
              var firstELement = jobj[0];
              var select = document.getElementById("numberSelect");
              for(var key in firstELement){
                  if(typeof key === "undefined" || key==="" || key === "undefined") continue;
                  headers.push(key);
                  var option = document.createElement("option");
                  option.value = key;
                  option.text = key;
                  select.appendChild(option);
              }
              select.hidden = false;
              console.log(headers);
              
              

              // for(var i=0;i<jobj.length;i++){
              //   for(var j in headers){
              //     console.log(jobj[i][headers[j]]);
              //   }
              // }


            }
            
          })
        };

        reader.onerror = function(ex) {
          console.log(ex);
        };

        reader.readAsBinaryString(file);
      };
  };



// document.getElementById('getText').onclick = function(element) {  
//   chrome.tabs.executeScript( {  
//   code: "window.getSelection().toString();"  
// }, function(selection) {  
//   document.getElementById("selectedtext").innerHTML = selection[0];  
// });  
// };  
// function modifyDOM() {  
//         //You can play with your DOM here or check URL against your regex  
//         console.log('Tab script:');  
//         console.log(document.body);  
//         document.body.style.background = "blue"  
//         return true;  
//     }  
// document.getElementById('colorChange').onclick = function(element) {  
//   chrome.tabs.executeScript( {  
//   code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code  
// }, function(selection) {  
//   alert(selection);  
// });  
// };  



// function getCurrentTabUrl(rcvr, msg) {
//   console.log('here')  
//   var queryInfo = {  
//     active: true,  
//     currentWindow: true  
//   };    
//   chrome.tabs.query(queryInfo, (tabs) => {  
//     //var tab = tabs[0];  
//     //var url = tab.url;  
//     //document.getElementById('url').innerHTML = url;  
//     setTimeout(function(){
//         chrome.tabs.executeScript(tabs[0].id, {file: "content_script.js"});
//     }, 1000);
    
//   });
// }

