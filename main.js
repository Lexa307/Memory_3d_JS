                  let CardAmout=12;
let AmoutOfTypes=4;

let mouse = new THREE.Vector2();
let NewTexture={
    state:0,
    maxCount:AmoutOfTypes,
    GenerateTexture:function(){
    let can = document.createElement("canvas");
    can.width=1024;
    can.height = 1024;
    let cont=can.getContext("2d");
    
    cont.drawImage(img, 0, 0);
	cont.rect(806, 0, 218, 447);
    cont.fillStyle = "#333333";
    cont.fill();
    
    
    
    if(this.state==0){
        cont.rect(861, 111, 109, 223);
        cont.fillStyle = "#ACFF33";
        cont.fill();
        
    }
     if(this.state==1){
        cont.beginPath();
        let x=915;
        let  y=218;
         
		cont.moveTo(x, y);
		cont.bezierCurveTo(x, y - 40, x - 45, y - 40, x - 48, y);
		cont.bezierCurveTo(x - 45, y + 30, x, y + 40, x, y + 80);
		cont.bezierCurveTo(x, y + 90, x + 45, y + 40, x + 45, y);
		cont.bezierCurveTo(x + 45, y - 30, x, y - 30, x, y);
		cont.fillStyle="red";
		
		cont.closePath();
		
		cont.fill();
        cont.stroke(); 
        
    }
     if(this.state==2){
        cont.rect(861, 111, 109, 223);
        cont.fillStyle = "#B11AED";
        cont.fill();
        
        
    }
     if(this.state==3){
        cont.beginPath();
        cont.arc(915, 218, 50,0, Math.PI*2);
        cont.closePath();
        cont.fillStyle = "green"
        cont.strokeStyle = "red";
        cont.fill();
        cont.stroke(); 
        
        
    }
    this.state++;
    console.log("state: "+ this.state);
    if(this.state>=this.maxCount){
        this.state=0;
    }
    return new THREE.CanvasTexture(can);
    }
    
};
let CheckEquals={
    state:0,
    "0":null,
    "1":null,
    "ass_you_can":true,
    pushObject:function(obj){
        this[this.state]=obj;
        TweenMax.to(this[this.state].rotation,1,{ease: Bounce.easeOut,z:Math.PI});
        this.state++;
        if(this.state>1){
            this.state=0;
            this.ass_you_can=false;
            let tid=setTimeout(function(){
                if(CheckEquals["0"].name==CheckEquals["1"].name){
                TweenMax.to(CheckEquals["0"].material ,1,{ease: Expo.easeInOut,opacity:0,onComplete:()=>{CheckEquals["0"].visible=false; CheckEquals["0"]=null;}});
                TweenMax.to(CheckEquals["1"].material ,1,{ease: Expo.easeInOut,opacity:0,onComplete:()=>{CheckEquals["1"].visible=false; CheckEquals["1"]=null;CheckEquals.ass_you_can=true;}});
               // alert("done");
                }else{
                    TweenMax.to(CheckEquals["0"].rotation,1,{ease: Bounce.easeOut,z:0,onComplete:()=>{CheckEquals["0"]=null;}});
                    TweenMax.to(CheckEquals["1"].rotation,1,{ease: Bounce.easeOut,z:0,onComplete:()=>{CheckEquals["1"]=null;CheckEquals.ass_you_can=true;}});
                    //alert("wrong");
                }
            },2000);
            
        }
        
        
    }
};



let camera, scene, renderer,controls,cardObject,light,container,raycaster;
let group = new THREE.Group();
let ids=[]
let textures=[];
let cards=[];

for(let i=0,j=0;i<CardAmout/2;i++,j++){
    if(j>=AmoutOfTypes){
        j=0;
    }
    ids.push(j);
    ids.push(j);
    
}
for(let i=0;i<CardAmout;i++){
    let ch=Math.floor(Math.random()*(8-1));
    let buf=ids[i];
    ids[i]=ids[ch];
    ids[ch]=buf;
    
}
console.log(ids);



img.onload = function() {

    for(let i=0;i<CardAmout/2;i++){
        textures.push(NewTexture.GenerateTexture());
    }
    init();
    animate();
};


function init(){


renderer = new THREE.WebGLRenderer();
raycaster = new THREE.Raycaster();
raycaster.far=200;

renderer.setPixelRatio( window.devicePixelRatio );
renderer.antialiasing = true;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x131216, 0);
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.z=2;
camera.position.y=2;

container = document.createElement( 'div' );//теперь контейнер - div элемент
document.body.appendChild( container );//  размещение контейнера в body
container.appendChild( renderer.domElement );// помещение рендерера в контейнер

//controls = new THREE.OrbitControls( camera, renderer.domElement  );
//controls.update();


light = new THREE.AmbientLight();
scene.add( light );

let canvas2 = document.createElement("canvas");
	canvas2.width =512;
	canvas2.height = 512;
	let ctx = canvas2.getContext("2d");
	let grd = ctx.createLinearGradient(0, 0, 0, 1024);
	grd.addColorStop(0, '#90C3D4');
	grd.addColorStop(0.5, "#100F15");
	grd.addColorStop(1, "#DFEAED");//100F15


	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

	let BGtexture = new THREE.CanvasTexture(canvas2);
	scene.background= BGtexture;


let loader = new THREE.ObjectLoader();
loader.load("scene (21).json",function(obj){
    cardObject=obj.children[0];
    for(let i=0;i<CardAmout;i++){
        cards.push(cardObject.clone());
        
    }
    let x=0,y=0;
    for(let i=0;i<CardAmout;i++){
       
        if(x==4){
            x=0;
            y--;
        }
        cards[i].position.set(x,0,y);
        cards[i].name=ids[i];
        cards[i].material = new THREE.MeshLambertMaterial({map:textures[ cards[i].name],transparent:true})
        group.add(cards[i]);
         x++;
        console.log(cards[i].position);
    }
    scene.add(group);
    group.position.x=-1.5;
    
    
    
    
},	// onProgress callback
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},

		// onError callback
		function ( err ) {
			console.error( 'An error happened' );
		});
		window.addEventListener( 'mousemove', onMouseMove, false );
        window.addEventListener( 'click', onMouseClick, false );
        window.addEventListener( 'resize', onWindowResize, false );
}


function animate() {
	requestAnimationFrame( animate );
	render();
}
			
function render() {
	// update the picking ray with the camera and mouse position
// 	raycaster.setFromCamera( mouse, camera );

// 	// calculate objects intersecting the picking ray
// 	var intersects = raycaster.intersectObjects( group.children );
//     if(intersects.length>0){
//       // console.log(intersects[0].object.name);
//       // intersects[0].object.material.color.set( 0xff0000 );
//     }
    
    //


camera.lookAt(scene.position);
//console.log(intersects);
	renderer.render( scene, camera );
   // controls.update();

}



function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseClick(event){
    raycaster.setFromCamera( mouse, camera );
    //console.log("PreclickEvent");
	// calculate objects intersecting the picking ray
	let intersects = raycaster.intersectObjects( group.children );
    if(intersects.length>0&&CheckEquals.ass_you_can){
        if(CheckEquals["0"]==null){
            console.log("clickEvent");
            CheckEquals.pushObject(intersects[0].object);
        }else{
            if(CheckEquals["0"].id!=intersects[0].object.id){
                console.log("clickEvent");
                CheckEquals.pushObject(intersects[0].object);
            }
        }
        
    }
}