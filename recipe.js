var index;
//initail left group index when loading the


var cuisine = [];
var diff = [];
var keywords = [];
var c_resList = [];
var d_resList = [];


function addEvent() {
    var box =document.getElementsByClassName("cuisine");
    if (box.length==0){
        setTimeout('addEvent()',100);
        console.log("not ready");
    }
    $(".cuisine").on("change", function(){
      var v = $(this).val();
      if ($(this).prop("checked")){ 
        cuisine.push(v);  
        console.log(cuisine);
        removeAllChild("parent");
        //show_res(cuisine,diff);
      }
      else {
        var index_temp = jQuery.inArray(v,cuisine);
        cuisine.splice(index_temp,1);
        removeAllChild("parent");
        //show_res(cuisine,diff);
      }
      
    });
    var box2 =document.getElementsByClassName("diff");

    console.log(box2.length);
      $(".diff").on("change", function(){
      var v = $(this).val();
      if ($(this).prop("checked")){ 
        diff.push(v); 
        console.log(diff);
        removeAllChild("parent");
        //show_res(cuisine,diff);
      }
      else {
        var index_temp = jQuery.inArray(v,diff);
        diff.splice(index_temp,1);
        //console.log(diff);
        removeAllChild("parent");
        //show_res(cuisine,diff);
      }
      
    });

}



function quick_search(){
  console.log(cuisine);
  cuisine.forEach(function(k){
  var Ref = firebase.database().ref("metadata/category_index"+"/"+k);
  Ref.on("value", function(snapshot){snapshot.forEach(function(child){
        if(keywords.length == 0 || keywords.indexOf(child.val()) != -1){
            c_resList.push(child.val());
        }
        
  });});   
  });

  diff.forEach(function(k){
  var Ref = firebase.database().ref("metadata/difficulty_index"+"/"+k);
  Ref.on("value", function(snapshot){snapshot.forEach(function(child){
        if(keywords.length == 0 || keywords.indexOf(child.val()) != -1){
            d_resList.push(child.val());
        }
        
  });});   
  });

  var intersection = []
  for (var i = c_resList.length - 1; i >= 0; i--) {
    for (var j = d_resList.length - 1; j >= 0; j--) {
        if(c_resList[i] == d_resList[j]){
         intersection.push(c_resList[i]);
        }
    }

  }
 // console.log(c_resList);
  //console.log(d_resList);
  // c_resList.forEach(function(c){
  //     d_resList.forEach(function(d){
  //         console.log(c);
  //         console.log(d);
  //         if(c === d)
  //           intersection.push(c);
  //     });

  // });
  // if(c_resList.length < d_resList.length){
  //     c_resList.filter(v => d_resList.includes(v));
  //     intersection = c_resList;

  // }else{
  //   d_resList.filter(v => c_resList.includes(v));
  //     intersection = d_resList;
  // }


  console.log(intersection);


  if(intersection.length == 0 && (c_resList.length != 0 && d_resList.length !=0)){
      console.log("1");
       document.getElementById("slider1").remove();

  }else if(intersection.length == 0 && (c_resList.length != 0 || d_resList.length != 0)){
        console.log("2");
         cuisine.forEach(function(k){
         filter('category_index',k);
     });
          diff.forEach(function(k){
          filter('difficulty_index',k);
      });
  }
  else if(intersection.length != 0 ){
     console.log("3");
    var set_temp = new Set(intersection);
    filter2(Array.from(set_temp));
  }

   cuisine = [];
   diff = [];

}


window.onload=function(){
    diff_map3 = new Map([['easy', 0], ['medium', 0], ['hard', 0]]);
    c_map3 = new Map([['chinese',0], ['french', 0], ['italian', 0],['japanese',0], ['mexican', 0], ['thai', 0]]);
    var iRef1=firebase.database().ref("metadata/category_index")
    //nav_c = document.getElementById("cuisine");
    iRef1.on("value", function(snapshot){snapshot.forEach(function(child){
      let k = child.key;
      var num = "("+child.val().length+")";
      c_map3.set(child.key,child.val().length);

          //console.log(child.key);
      //$("#cuisine").append("<input type='checkbox' class='cuisine' value="+child.key+">  "+child.key+num+"<br>");

    });});

    var iRef2=firebase.database().ref("metadata/difficulty_index")
    //nav_c = document.getElementById("cuisine");
    iRef2.on("value", function(snapshot){snapshot.forEach(function(child){
          //console.log(child.key);
          let k = child.key;
          var num = "("+child.val().length+")";
          diff_map3.set(child.key,child.val().length);

          //$("#diff").append(child.key+"<a href=\'javascript:void(0)\' onclick=\"filter(\'difficulty_index\',\'"+child.key+"\')\">"+num+"</a>"+"</br>");
      //$("#diff").append("<input type='checkbox' class='diff' value="+child.key+">  "+child.key+num+"<br>");

    });});
    setTimeout(function(){
  
  //version2===============
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'french'+">  "+'french'+"("+c_map3.get('french')+")"+"<br>");
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'chinese'+">  "+'chinese'+"("+c_map3.get('chinese')+")"+"<br>");
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'thai'+">  "+'thai'+"("+c_map3.get('thai')+")"+"<br>");
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'japanese'+">  "+'japanese'+"("+c_map3.get('japanese')+")"+"<br>");
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'italian'+">  "+'italian'+"("+c_map3.get('italian')+")"+"<br>");
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'mexican'+">  "+'mexican'+"("+c_map3.get('mexican')+")"+"<br>");
      $("#diff").append("<input type='checkbox' class='diff' value="+'hard'+">  "+'hard'+"("+diff_map3.get('hard')+")"+"<br>");
    $("#diff").append("<input type='checkbox' class='diff' value="+'easy'+">  "+'easy'+"("+diff_map3.get('easy')+")"+"<br>");
      $("#diff").append("<input type='checkbox' class='diff' value="+'medium'+">  "+'medium'+"("+diff_map3.get('medium')+")"+"<br>");
      
//===================
  }, 500);
  addEvent();

    }



function search(){ 
  keywords.splice(0,keywords.length);
  removeAllChild("parent");

  var obj = document.getElementById('select_d'); //定位id
  var index2 = obj.selectedIndex;
  var difficulty_value = obj.options[index2].value; // 选中值
 
  var obj2 = document.getElementById('select_c'); //定位id
  var index3 = obj2.selectedIndex;
  var cuisine_value = obj2.options[index3].value; // 选中值
  let arr2 = [];
  let foo = [];
 

  if(document.getElementById("input1").value==""||document.getElementById("input1").value== null){
      //input1 = document.getElementById("input1");
      //input1.text.focus();  
       for (var i = 1; i <= 50; i++) {
       arr2.push(i);
       }
      
      updateLeft([],difficulty_value,cuisine_value);
      console.log(difficulty_value); 

  }

  index =  document.getElementById("input1").value.toLowerCase();



  var dbRef = firebase.database().ref("metadata/keywords_index/"+index);
      //dbRef.on('value',snap => result.innerText = snap.val());

  dbRef.on('value',function(snapshot){
        //result.innerText = snapshot.val();
  s = new String(snapshot.val());
  console.log("connect to firebase");
  if(arr2.length == 0){
    arr2 = s.split(",");
    updateLeft(arr2,difficulty_value,cuisine_value);
  }
      
  keywords = s.split(",");
  console.log(keywords);

  var parent = document.getElementById("parent");
  var b = document.createElement("br");
  parent.appendChild(b);

var d1 = document.createElement("div");
  for (var i = arr2.length - 1; i >= 0; i--) {
      let id = arr2[i];
      let title;
      let category;
      let difficulty;
      let keyword;

      var iRef=firebase.database().ref("metadata/img/"+arr2[i]);
      iRef.on('value',function(snapshot){
      title= new String(snapshot.val().title);
      category = new String(snapshot.val().category);
      difficulty = new String(snapshot.val().difficulty);
      keyword = new String(snapshot.val().keyword);

      });
    
      var imageRef = firebase.storage().ref("img/"+arr2[i]+'.jpg');
      imageRef.getDownloadURL().then(function(url) {
            var test = url;
            if(cuisine_value == "0" && difficulty_value =="0")
               createDIV(test,title,category,difficulty,keyword,id); 
            else if(cuisine_value != "0" && difficulty_value =="0"){
              if(cuisine_value == category)
                createDIV(test,title,category,difficulty,keyword,id); 
            }
            else if(cuisine_value == "0" && difficulty_value !="0"){
              if(difficulty_value == difficulty)
                createDIV(test,title,category,difficulty,keyword,id); 
            }
            else{
              if(difficulty_value == difficulty && cuisine_value == category)
                createDIV(test,title,category,difficulty,keyword,id); 
            }

        }).catch(function(error) { });
  } 
  });

}   
//UPDATE LEFT NAV BAR AFTER KEYWORD SEARCHING        
function updateLeft(arr,difficulty_value,cuisine_value){
  removeAllChild("cuisine");
  removeAllChild("diff");
  let diff_map = new Map([['easy',[]], ['medium', []], ['hard', []]]);
  let c_map = new Map([['chinese',[]], ['french', []], ['italian', []],['japanese',[]], ['mexican', []], ['thai', []]]);
  let diff_map2 = new Map([['easy', 0], ['medium', 0], ['hard', 0]]);
  let c_map2 = new Map([['chinese',0], ['french', 0], ['italian', 0],['japanese',0], ['mexican', 0], ['thai', 0]]);
  var foo = [];
  for (var i = 1; i <= 50; i++) {
     foo.push(i);
}
  if(arr.length == 0){
     arr = foo;
  }

  
  for (let j=arr.length - 1; j >= 0; j--) {
    let category;
    let difficulty;
    var id = arr[j];
    var iRef=firebase.database().ref("metadata/img/"+arr[j]);
    iRef.on('value',function(snapshot){
    category = snapshot.val().category;
    difficulty= snapshot.val().difficulty;
    //console.log(j);
    //console.log(res_map.get(difficulty));
    //if difficulty is "easy", a is a list of key with easy [1,32,45...]
    if(difficulty_value != "0" && cuisine_value != "0"){
      if(difficulty_value == difficulty && category == cuisine_value){
         var a = diff_map.get(difficulty);
          a.push(id);
          diff_map.set(difficulty,a);
          diff_map2.set(difficulty,a.length);


          var b = c_map.get(category);
          b.push(id);
          c_map.set(category,b);
          c_map2.set(category,b.length);
          console.log(c_map);
      }

    }
    else if(difficulty_value == "0" && cuisine_value != "0"){
      if(category == cuisine_value){

          var b = c_map.get(category);
          b.push(id);
          c_map.set(category,b);
          c_map2.set(category,b.length);

          var a = diff_map.get(difficulty);
          a.push(id);
          diff_map.set(difficulty,a);
          diff_map2.set(difficulty,a.length);
      }
    }
    else if(difficulty_value != "0" && cuisine_value == "0"){
      if(difficulty == difficulty_value){

          var b = c_map.get(category);
          b.push(id);
          c_map.set(category,b);
          c_map2.set(category,b.length);

          var a = diff_map.get(difficulty);
          a.push(id);
          diff_map.set(difficulty,a);
          diff_map2.set(difficulty,a.length);
      }
    }

   else{

    var a = diff_map.get(difficulty);
    //add key
    a.push(id);
    // update
    diff_map.set(difficulty,a);
    diff_map2.set(difficulty,a.length);
   
    
    var b = c_map.get(category);
    b.push(id);
    c_map.set(category,b);
    c_map2.set(category,b.length);
   }




    //res_map.set("easy",10);
    
    
      });
      }

  setTimeout(function(){
   //  c_map.forEach(function(value, key, map) {
   //     $("#cuisine").append("<input type='checkbox' class='cuisine' value="+key+">  "+key+"("+value.length+")"+"<br>");
   // });
   //  diff_map.forEach(function(value, key, map) {
   //     $("#diff").append("<input type='checkbox' class='diff' value="+key+">  "+key+"("+value.length+")"+"<br>");
   // });  
  
  //version2===============
var array2=Array.from(c_map2.values());
  array2=array2.sort(); 
  var bo1=0; var bo2=0; var bo3=0;var bo4=0; var bo5=0; var bo6=0;
  for (let j = array2.length - 1; j >= 0; j--) {
    if(array2[j]==c_map2.get('chinese') && bo1==0){
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'chinese'+">  "+'chinese'+"("+c_map2.get('chinese')+")"+"<br>");
      bo1=1;
    }
    if(array2[j]==c_map2.get('french') && bo2==0){
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'french'+">  "+'french'+"("+c_map2.get('french')+")"+"<br>");
      bo2=1;
    }
    if(array2[j]==c_map2.get('italian') && bo3==0){
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'italian'+">  "+'italian'+"("+c_map2.get('italian')+")"+"<br>");
      bo3=1;
    }
    if(array2[j]==c_map2.get('japanese') && bo4==0){
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'japanese'+">  "+'japanese'+"("+c_map2.get('japanese')+")"+"<br>");
      bo4=1;
    }
    if(array2[j]==c_map2.get('mexican') && bo5==0){
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'mexican'+">  "+'mexican'+"("+c_map2.get('mexican')+")"+"<br>");
      bo5=1;
    }
    if(array2[j]==c_map2.get('thai') && bo6==0){
      $("#cuisine").append("<input type='checkbox' class='cuisine' value="+'thai'+">  "+'thai'+"("+c_map2.get('thai')+")"+"<br>");
      bo6=1;
    }
  } 
    
  var array1=Array.from(diff_map2.values());
  array1=array1.sort(); 
  var bool1=0; var bool2=0; var bool3=0;
  for (let j = array1.length - 1; j >= 0; j--) {
    if(array1[j]==diff_map2.get('easy') && bool1==0){
      $("#diff").append("<input type='checkbox' class='diff' value="+'easy'+">  "+'easy'+"("+diff_map2.get('easy')+")"+"<br>");
      bool1=1;
    }
    if(array1[j]==diff_map2.get('medium') && bool2==0){
      $("#diff").append("<input type='checkbox' class='diff' value="+'medium'+">  "+'medium'+"("+diff_map2.get('medium')+")"+"<br>");
      bool2=1;
    }
    if(array1[j]==diff_map2.get('hard') && bool3==0){
      $("#diff").append("<input type='checkbox' class='diff' value="+'hard'+">  "+'hard'+"("+diff_map2.get('hard')+")"+"<br>");
      bool3=1;
    }
  } 

  }, 500);

  addEvent();

}
var remove=0;

function createDIV(src,title,category,difficulty,keyword,id_k) 
{ 
//console.log(title);
if(remove==0){
  document.getElementById("slider1").remove();
  remove=1;
} 

var parent = document.getElementById("parent");
 

//-----------------------------------
// var r = document.createElement("div");
// r.className = "row";
setTimeout(function(){
var d1 = document.createElement("div");
d1.className = "col-md-4";

var d = document.createElement("div");
d.className = "thumbnail res"; 

var cap = document.createElement("div");  
cap.className = "caption";
var p = document.createElement("p");
p.innerHTML = "<p class=\"title\">"+title+"</p>"+"<p class=\"otherinfo\">"+"category:"+category+"<br>"+"difficulty:"+difficulty+"<br>"+"main ingredients:"+keyword+"<br>"+"</p>";

var a_img = document.createElement("a");
a_img.href = "info.html?id="+id_k;
a_img.target='_BLANK';

var img = document.createElement("img");  
img.className = "result_img";
img.src=src;
img.width =200;
img.height = 160;

cap.appendChild(p);
d.appendChild(a_img);
a_img.appendChild(img);
d.appendChild(cap);
d1.appendChild(d);
//r.appendChild(d1);
// d.appendChild(cap);
parent.appendChild(d1); 
},500);
//=====================================

// var subdiv = document.createElement("div");
// subdiv.className = "res";
// parent.appendChild(subdiv);
// var a_img = document.createElement("a");
// a_img.href = "info.html?id="+id_k;
// a_img.target='_BLANK';
// var img = document.createElement("img");
// img.className = "result_img";
// img.src=src;
// img.width =200;
// img.height = 160;
// var intro = document.createElement("div");
// intro.className = "intro";
// intro.innerHTML = "<p class=\"title\">"+title+"</p>"+"<p class=\"otherinfo\">"+"category:"+category+"<br>"+"difficulty:"+difficulty+"<br>"+"main ingredients:"+keyword+"<br>"+"</p>";
// subdiv.appendChild(a_img);
// a_img.appendChild(img);
// subdiv.appendChild(intro);

//subdiv.innerHTML=category+"<br>"+difficulty+"<br>"+keyword+"<br>"+title;
}

function removeAllChild(id)
{

  var div = document.getElementById(id);
  while(div.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        div.removeChild(div.firstChild);
    }
}




function filter(filter,keyName){
  //console.log(filter);
  //removeAllChild("parent")
  resList = [];
  var Ref = firebase.database().ref("metadata/"+filter+"/"+keyName);
  Ref.on("value", function(snapshot){snapshot.forEach(function(child){
        if(keywords.length == 0 || keywords.indexOf(child.val()) != -1){
            resList.push(child.val());
        }
        
  });});

  

  for (var i = resList.length - 1; i >= 0; i--) {
      //console.log(i);
      let title;
      let category;
      let difficulty;
      let keyword;
      let id = resList[i];
      var iRef=firebase.database().ref("metadata/img/"+resList[i])
      iRef.on('value',function(snapshot){
      title= new String(snapshot.val().title);
      category = new String(snapshot.val().category);
      difficulty = new String(snapshot.val().difficulty);
      keyword = new String(snapshot.val().keyword);

      });
    
      var imageRef = firebase.storage().ref("img/"+resList[i]+'.jpg');
      imageRef.getDownloadURL().then(function(url) {
            var test = url;
            createDIV(test,title,category,difficulty,keyword,id); 

        }).catch(function(error) { });
  } 
}


function filter2(resList){
  //removeAllChild("parent");
  //var arr = resList.split(",")
  console.log(resList);
  var arr = resList;
  console.log(arr.length);
  for (var i = arr.length - 1; i >= 0; i--) {
     // console.log(arr[i]);
      let title;
      let category;
      let difficulty;
      let keyword;
      let id = arr[i];
      var iRef=firebase.database().ref("metadata/img/"+arr[i])
      iRef.on('value',function(snapshot){
      title= new String(snapshot.val().title);
      category = new String(snapshot.val().category);
      difficulty = new String(snapshot.val().difficulty);
      keyword = new String(snapshot.val().keyword);

      });
    
      var imageRef = firebase.storage().ref("img/"+arr[i]+'.jpg');
      imageRef.getDownloadURL().then(function(url) {
            var test = url;
            //console.log(id);
            createDIV(test,title,category,difficulty,keyword,id); 

        }).catch(function(error) { });
  }   

}

function reset(){
  history.go(0);
}




