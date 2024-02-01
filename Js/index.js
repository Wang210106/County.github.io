var amount = document.querySelector(".amount"),//计数的文字
            button = document.querySelector(".handin"),//提交按钮
            cities = document.querySelector(".cities"),//输入框
            clear = document.querySelector(".again"),//重来按钮
            comes = document.querySelector(".come"),//资料来源
            complete = document.querySelector(".complete"),//完成按钮
            deletement = document.querySelector(".delete"),//删除历史记录
            makers = document.querySelector(".maker"),//制作人员
            maps = document.querySelector(".map"),//地图
            outbtn = document.querySelector(".over"),//结束的div
            wrap = document.querySelector(".wrap"),//输入框的div
            scaleadd = document.querySelector(".addScale"),//地图变大按钮
            scalemis = document.querySelector(".misScale"),//地图变小按钮
            reset = document.querySelector(".retrans"),//地图重置按钮
            Chinamap = document.querySelector(".Chinamap"),//地图框
            themap = document.querySelector(".xianditu")//地图本体(svg)
            //zhuyrm = document.querySelector(".main");//主页面

        var havenamed = [];//已经写出的城市
        var haveremind = 0;//已经写出的人口
        var cityname;//当前输入的名称
        var number = 0;//已命名城市个数
        var havepft = [];//已经写出的地级市

        var scale = 1;//地图比例
        var ismoving = false;//是否正在移动
        var isstartmove = false;//是否已经开始移动
        var mzx = 0,mzy = 0;//原来x,y的值
        var prx = 100,pry = 0;//现在x,y的值

        init();

        function ClearDate(){
            if(confirm("你确定要重来吗？这次记录将被删除！")){
                havenamed = [];
                haveremind = 0;
                cityname = "";
                number = 0;
                amount.innerHTML = "已标注0个县级行政单位，占总人口的0%";
                outbtn.style.display = "none";
                themap.innerHTML = "";
                localStorage.clear();
                location.reload();
            }
        }

        function Choose(){
            var ifacity = citiesname.indexOf(cityname);
            var ifhavedone = havenamed.indexOf(cityname);
            if(ifacity != -1){
                if(ifhavedone != -1){return};
                console.log("对了");
                number = havenamed.length + 1;
                
                var thispft = prefecture[ifacity];
                DrawCircle(ifacity);
                if(havepft.indexOf(thispft) == -1){
                    havepft.push(thispft);
                }

                var baifen = population[ifacity];
                haveremind += baifen;
                baifen = haveremind/sum(population);
                baifen = baifen * 100;
                baifen = baifen.toFixed(2);

                amount.innerHTML = "已标注" + number.toString() + "个县级行政单位，占总人口的" + baifen.toString() + "%";
                havenamed.push(cityname);

                wrap.style.animationName = "";
                cities.focus();

                outbtn.style.display = "flex";
                Save();
            }else{
                console.log("错了");
                wrap.style.animationName = "wrong";
            }
        }

        function DrawCircle(ifacity){
            var thispft = prefecture[ifacity];
            var inorder = allchebail.indexOf(thispft);
            if(havepft.indexOf(thispft) == -1){
                var radius;

                if(population[ifacity] < 100000){
                    radius = 5;
                }else if(population[ifacity] >= 100000 && population[ifacity] < 2000000){
                    radius = population[ifacity] * 0.0000131579;
                    radius+=3.68421;
                }else if(population[ifacity] >= 2000000 && population[ifacity] < 9000000){
                    radius = population[ifacity] * 0.0000057142857;
                    radius+=18.57143;
                }else{
                    radius = population[ifacity] * 0.00000142857;
                    radius+=57.142857;
                }

                radius = radius.toFixed(0);
                if(radius > 10){radius = 10}
                addCircle(pftx[inorder]-352,pfty[inorder]-288,radius,thispft);//修正数据：352,288
            }else{
                var pftuni = Unicode(thispft);
                pftuni = "." + pftuni;
                var radiusZero = parseFloat($(pftuni).attr("r"));
                $(pftuni).remove();

                var deltaRadius;
                if(population[ifacity] < 100000){
                    deltaRadius = 5;
                }else if(population[ifacity] >= 100000 && population[ifacity] < 2000000){
                    deltaRadius = population[ifacity] * 0.0000001579;
                    deltaRadius+=3.68421;
                }else if(population[ifacity] >= 2000000 && population[ifacity] < 9000000){
                    deltaRadius = population[ifacity] * 0.0000000142857;
                    deltaRadius+=18.57143;
                }else{
                    deltaRadius = population[ifacity] * 0.00000002857;
                    deltaRadius+=57.142857;
                }

                if(deltaRadius > 3){deltaRadius = 3}
                var radius = radiusZero + deltaRadius;
                radius = radius.toFixed(0);
                addCircle(pftx[inorder]-352,pfty[inorder]-288,radius,thispft);
            }
        }

        function Draw(){
            if(Math.abs(prx) >= 1000){return;}
            if(Math.abs(pry) >= 1000){return;}
            themap.style.transform = "scale(" + scale.toString() + ")";
            themap.style.transform += "translate(" + prx.toString() + "px," + pry.toString() + "px)";
        }

        function init(){
            if(localStorage.getItem("isUsed")){
                outbtn.style.display = "flex";
                havenamed = JSON.parse(localStorage.getItem("NamedCities"));
                haveremind = parseFloat(localStorage.getItem("population"));
                number = localStorage.getItem("CitiesAmount");
                havepft = JSON.parse(localStorage.getItem("Perfectures"));

                if(havepft != null){
                    for(var i = 0;i < havepft.length;i++){
                        var rrr = JSON.parse(localStorage.getItem("CirclesRadius"))[i],
                            xxx = JSON.parse(localStorage.getItem("OriginX"))[i],
                            circleClass = JSON.parse(localStorage.getItem("CircleNames"))[i],
                            yyy = JSON.parse(localStorage.getItem("OriginY"))[i];

                        let obj = document.createElementNS('http://www.w3.org/2000/svg','circle');
                        if(obj){
                            obj.setAttribute('cx',xxx);
                            obj.setAttribute('cy',yyy);
                            obj.setAttribute('r',rrr);
                            obj.setAttribute('fill',"RGBA(235,196,186,0.6)");
                            obj.setAttribute('stroke',"#000");//边框颜色
                            obj.setAttribute('stroke-width',1);//边框宽度
                            obj.setAttribute("class",circleClass);//class名
                            themap.append(obj);//加入到svg中
                        }
                    }
                }

                var baifen = haveremind/sum(population);
                baifen = baifen * 100;
                baifen = baifen.toFixed(2);

                amount.innerHTML = "已标注" + localStorage.getItem("CitiesAmount").toString() + "个县级行政单位，占总人口的" + baifen + "%";
            }
            //console.log(citiesname[population.indexOf(Math.max(...population))]);
            Draw();
        }

        function Save(){
            if(!localStorage.getItem("isUsed")){
                localStorage.setItem("isUsed",true);
            }

            var acs = $("svg>circle");//allCircles
            var crs = [],cxs = [],cys = [],circleClass = [];//圆半径，圆心坐标
            for(var i = 0;i < acs.length;i++){
                crs.push(acs[i].getAttribute("r"));
                cxs.push(acs[i].getAttribute("cx"));
                cys.push(acs[i].getAttribute("cy"));
                circleClass.push(acs[i].getAttribute("class"));
            }
            localStorage.setItem("CirclesRadius",JSON.stringify(crs));
            localStorage.setItem("OriginX",JSON.stringify(cxs));
            localStorage.setItem("OriginY",JSON.stringify(cys));
            localStorage.setItem("CircleNames",JSON.stringify(circleClass));

            localStorage.setItem("population",haveremind);
            localStorage.setItem("NamedCities",JSON.stringify(havenamed));
            localStorage.setItem("CitiesAmount",number);
            localStorage.setItem("Perfectures",JSON.stringify(havepft));
        }

        //事件函数
            reset.onclick = function(){
                scale = 1;
                mzx = 0,mzy = 0;
                prx = 100,pry = 0;
                ismoving = false;
                isstartmove = false;

                Draw();
            }
            Chinamap.addEventListener("mousemove",function(event){
                //wrap.style.animationName = "";
                if(ismoving){
                    var deX = event.offsetX - mzx;
                    var deY = event.offsetY - mzy;
                    //console.log(deY);
                    if(deX*deX + deY*deY >= 40000){return;}
                    pry += deY;
                    prx += deX;
                    Draw();
                }
            })
            Chinamap.addEventListener('mousewheel', function (event) {
                //console.log(event);
                var wY = event.deltaY;

                if(wY < 0){
                    if(scale >= 20){return;}
                    scale+=0.3;
                    Draw();
                }else if(wY > 0){
                    if(scale <= 0.3){return;}
                    scale-=0.2;
                    Draw();
                }
            })
            Chinamap.onmousedown = function(){
                ismoving = true;
                mzx = event.offsetX;
                mzy = event.offsetY;
            }
            Chinamap.onmouseup = function(){
                ismoving = false;
            }
            comes.onclick = function(){
                location.href = "ziliao.html";
            }
            deletement.onclick = function(){
                ClearDate();
            }
            makers.onclick = function(){
                location.href = "makers.html";
            }
            clear.onclick = function(){
                ClearDate();
            }
            scaleadd.onclick = function(){
                if(scale >= 20){return;}
                scale+=0.3;
                Draw();
            }
            scalemis.onclick = function(){
                if(scale <= 0.3){return;}
                scale-=0.2;
                Draw();
            }
            button.onclick = throttle(() => {
                cityname = cities.value;
                cities.value = "";
                Choose();
            },800);
            document.onkeydown = function (e) {
                if (!e) e = window.event;
                if ((e.keyCode || e.which) == 13){
                    throttle(button.focus(),800)
                }
            }
            wrap.addEventListener("animationend",function(){
                wrap.style.animationName = "";
                cities.focus();
            })
            cities.onclick = function(){
                wrap.style.animationName = "";
            }
            complete.onclick = function() {
                if(confirm("你确定要结束吗？")){
                    //console.log("Over!"); 
                    location.href = "Jieguo.html";
                }
            }
            // zhuyrm.onclick = function(){
            //     location.href = "main.html";
            // }


        function sum(arr) {
            var s = 0;
            for (var i=arr.length-1; i>=0; i--) {
                s += arr[i];
            }
            return s;
        }
        function addCircle(x,y,r,name){
            let obj = document.createElementNS('http://www.w3.org/2000/svg','circle');
            if(obj){
                obj.setAttribute('cx',x);//定义圆心坐标x
                obj.setAttribute('cy',y);//定义圆心坐标y
                obj.setAttribute('r',r);
                obj.setAttribute('fill',"RGBA(235,196,186,0.6)");//定义填充颜色
                obj.setAttribute('stroke',"#000");//边框颜色
                obj.setAttribute('stroke-width',1);//边框宽度
                obj.setAttribute("class",Unicode(name));//class名
                themap.append(obj);//加入到svg中
            }
        }

        function Unicode(str){
            var value='';
            for (var i = 0; i < str.length; i++) {
                value += "u" + left_zero_4(parseInt(str.charCodeAt(i)).toString(16));
                /*此处我进行了简化，真正的Unicode转换应该表示为：
                value += '\\u' + left_zero_4(parseInt(str.charCodeAt(i)).toString(16));
                */
            }
            return value;
        }

        function left_zero_4(str) {
            if (str != null && str != '' && str != 'undefined') {
                if (str.length == 2) {
                    return '00' + str;
                }
            }
            return str;
        }
        function throttle(func, limit) {  
            let inThrottle;  
            return function(...args) {  
                const context = this;  
                if (!inThrottle) {  
                func.apply(context, args);  
                inThrottle = true;  
                setTimeout(() => inThrottle = false, limit);  
                }  
            };  
        }