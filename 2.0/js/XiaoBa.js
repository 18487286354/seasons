let clickCount = 0;
        const div4 = document.getElementById('div4');

        function openPage(url) {
            window.open(url, '_blank');
            clickCount++;
            if (clickCount === 3) {
                div4.style.display = 'block';
            }
        }
var hl;
			var mflag=false;
			function ondown(){
				hl=document.getElementById("hl")
				mflag=true;
			}
			function onmove(e){
				if(mflag){
					hl.style.left=e.clientX-60+"px"
					hl.style.top=e.clientY-60+"px"
				}
			}
			function onup(){
				mflag=false;
			}
