
getQueryString = function (name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  decodeURI(r[2]); return null;
}



viewPdf = function(url){
	var p = document.getElementById("info_page");
	var a_pdf = document.createElement("a");
	a_pdf.href = url;
	a_pdf.innerText="click to view pdf";
	p.appendChild(a_pdf);


}

test = function(){
	return 1;
}
