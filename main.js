"use strict";

var canvas;
var gl;

var program;

var numVertices  = 250;

var positionsArray = [];
var normalsArray = [];
var colorsArray = [];

var modelViewMatrix, projectionMatrix;
var nMatrix;

// VIEW POSITION 
var radius = 4.0; // current distance of the camera from the origin

// angles used to move the camera
var theta_view = 0.0;
var phi = 0.0;

// position of the camera
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// PERSPECTIVE PROJECTION 
var fovy = 45.0;  
var aspect = 1.0; 

var near = 2.0;
var far = 5.0;
 
// SPOTLIGHT
var spotLightPosition = vec4(0.05, 0.1, 1.0, 1.0);
var spotLightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var spotLightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var spotLightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var spotLightState = true;

// MATERIAL
var materialAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 100.0;

// ROTATION
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var theta = vec3(45.0, 45.0, 45.0);

var flag = true;
var direction = true; 
var speed = 100;
var axis = xAxis;

// COLOR
var vertexColors = [
		vec4(0.0, 0.0, 0.0, 1.0),  // black
		vec4(1.0, 0.0, 0.0, 1.0),  // red
		vec4(1.0, 1.0, 0.0, 1.0),  // yellow
		vec4(0.0, 1.0, 0.0, 1.0),  // green
		vec4(0.0, 0.0, 1.0, 1.0),  // blue
		vec4(1.0, 0.0, 1.0, 1.0),  // magenta
		vec4(0.0, 1.0, 1.0, 1.0),  // cyan
		vec4(1.0, 1.0, 1.0, 1.0),   // white
	];

var vertexColor = vertexColors[5];

var vertices = [
		// BACK-LEFT LEG
		vec4(-0.5, -1.0, -0.4, 1.0),
		vec4(-0.5, 0.0, -0.4, 1.0),
		vec4(-0.4, 0.0, -0.4, 1.0),
		vec4(-0.4, -1.0, -0.4, 1.0),

		vec4(-0.5, -1.0, -0.5, 1.0),
		vec4(-0.5, 0.0, -0.5, 1.0),
		vec4(-0.4, 0.0, -0.5, 1.0),
		vec4(-0.4, -1.0, -0.5, 1.0),

		// FRONT-LEFT LEG
		vec4(-0.5, -1.0, 0.5, 1.0),
		vec4(-0.5, 0.0, 0.5, 1.0),
		vec4(-0.4, 0.0, 0.5, 1.0),
		vec4(-0.4, -1.0, 0.5, 1.0),

		vec4(-0.5, -1.0, 0.4, 1.0),
		vec4(-0.5, 0.0, 0.4, 1.0),
		vec4(-0.4, 0.0, 0.4, 1.0),
		vec4(-0.4, -1.0, 0.4, 1.0),

		// FRONT-RIGHT LEG
		vec4(0.4, -1.0, 0.5, 1.0),
		vec4(0.4, 0.0, 0.5, 1.0),
		vec4(0.5, 0.0, 0.5, 1.0),
		vec4(0.5, -1.0, 0.5, 1.0),

		vec4(0.4, -1.0, 0.4, 1.0),
		vec4(0.4, 0.0, 0.4, 1.0),
		vec4(0.5, 0.0, 0.4, 1.0),
		vec4(0.5, -1.0, 0.4, 1.0),

		// BACK-RIGHT LEG
		vec4(0.4, -1.0, -0.4, 1.0),
		vec4(0.4, 0.0, -0.4, 1.0),
		vec4(0.5, 0.0, -0.4, 1.0),
		vec4(0.5, -1.0, -0.4, 1.0),

		vec4(0.4, -1.0, -0.5, 1.0),
		vec4(0.4, 0.0, -0.5, 1.0),
		vec4(0.5, 0.0, -0.5, 1.0),
		vec4(0.5, -1.0, -0.5, 1.0),

		// SEAT
		vec4(-0.5, 0.1, 0.5, 1.0),
		vec4(-0.5, 0.1, -0.4, 1.0),
		vec4(0.5, 0.1, -0.4, 1.0),
		vec4(0.5, 0.1, 0.5, 1.0),

		// BACK
		vec4(-0.5, 0.5, -0.4, 1.0),
		vec4(-0.5, 0.5, -0.5, 1.0),
		vec4(0.5, 0.5, -0.5, 1.0),
		vec4(0.5, 0.5, -0.4, 1.0),
	];

function quad(a, b, c, d) {

	var t1 = subtract(vertices[b], vertices[a]);
	var t2 = subtract(vertices[c], vertices[b]);
	var normal = cross(t1, t2);
	var normal = vec3(normal);
	normal = normalize(normal);


	positionsArray.push(vertices[a]);
	normalsArray.push(normal);
	colorsArray.push(vertexColor);

	positionsArray.push(vertices[b]);
	normalsArray.push(normal);
	colorsArray.push(vertexColor);

	positionsArray.push(vertices[c]);
	normalsArray.push(normal);
	colorsArray.push(vertexColor);

	positionsArray.push(vertices[a]);
	normalsArray.push(normal);
	colorsArray.push(vertexColor);

	positionsArray.push(vertices[c]);
	normalsArray.push(normal);
	colorsArray.push(vertexColor);

	positionsArray.push(vertices[d]);
	normalsArray.push(normal);
	colorsArray.push(vertexColor);
}

function chair() {

	// BACK-LEFT LEG
	quad(1, 0, 3, 2);
	quad(2, 3, 7, 6);
	quad(6, 7, 4, 5);
	quad(5, 4, 0, 1);
	quad(5, 1, 2, 6);
	quad(4, 7, 3, 0);

	// FRONT-LEFT LEG
	quad(9, 8, 11, 10);
	quad(10, 11, 15, 14);
	quad(14, 15, 12, 13);
	quad(13, 12, 8, 9);
	quad(13, 9, 10, 14);
	quad(12, 15, 11, 8);

	// FRONT-RIGHT LEG
	quad(17, 16, 19, 18);
	quad(18, 19, 23, 22);
	quad(22, 23, 20, 21);
	quad(21, 20, 16, 17);
	quad(21, 17, 18, 22);
	quad(20, 23, 19, 16);

	// BACK-RIGHT LEG
	quad(25, 24, 27, 26);
	quad(26, 27, 31, 30);
	quad(30, 31, 28, 29);
	quad(29, 28, 24, 25);
	quad(29, 25, 26, 30);
	quad(28, 31, 27, 24);

	// SEAT
	quad(32, 9, 18, 35);
	quad(35, 18, 26, 34);
	quad(34, 26, 1, 33);
	quad(33, 1, 9, 32);
	quad(33, 32, 35, 34);
	quad(1, 26, 18, 9);

	// BACK
	quad(36, 1, 26, 39);
	quad(39, 26, 30, 38);
	quad(38, 30, 5, 37);
	quad(37, 5, 1, 36);
	quad(37, 36, 39, 38);
	quad(5, 30, 26, 1);
}

window.onload = function init() {
	canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webgl2');
	if (!gl) alert("WebGL 2.0 isn't available");

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.5, 0.5, 0.5, 1.0);

    gl.enable(gl.DEPTH_TEST);

	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	chair();

	// POSITIONS
	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);
	var positionLoc = gl.getAttribLocation(program, "aPosition");
	gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(positionLoc);

	// NORMALS
	var nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
	var normalLoc = gl.getAttribLocation( program, "aNormal");
	gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(normalLoc);

	// COLORS
	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
	var colorLoc = gl.getAttribLocation( program, "aColor");
	gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(colorLoc);

	gl.uniform4fv(gl.getUniformLocation(program, "uSpotLightPosition"), spotLightPosition);

	var spotAmbientProduct = mult(spotLightAmbient, materialAmbient);
	var spotDiffuseProduct = mult(spotLightDiffuse, materialDiffuse);
	var spotSpecularProduct = mult(spotLightSpecular, materialSpecular);
	gl.uniform4fv(gl.getUniformLocation(program, "uSpotAmbientProduct"), spotAmbientProduct);
	gl.uniform4fv(gl.getUniformLocation(program, "uSpotDiffuseProduct"), spotDiffuseProduct);
	gl.uniform4fv(gl.getUniformLocation(program, "uSpotSpecularProduct"), spotSpecularProduct);

	gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);

	document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
	document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
	document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};

	document.getElementById("ButtonT").onclick = function(){flag = !flag}; 
	document.getElementById("ButtonD").onclick = function(){direction = !direction;}

	document.getElementById("ButtonL").onclick = function(){
		spotLightState = !spotLightState;
	}

	document.getElementById("slider").onchange = function(event) {
		speed = 100 - event.target.value;
	};

	document.getElementById("zFarSlider").onchange = function(event) {
		far = event.target.value;
	};
	document.getElementById("zNearSlider").onchange = function(event) {
		near = event.target.value;
	};
	document.getElementById("radiusSlider").onchange = function(event) {
		radius = event.target.value;
	};
	document.getElementById("thetaSlider").onchange = function(event) {
		theta_view = event.target.value* Math.PI/180.0;
	};
	document.getElementById("phiSlider").onchange = function(event) {
		phi = event.target.value* Math.PI/180.0;
	};
	document.getElementById("aspectSlider").onchange = function(event) {
		aspect = event.target.value;
	};
	document.getElementById("fovSlider").onchange = function(event) {
		fovy = event.target.value;
	};

	render();
}

var render = function(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	eye = vec3(radius*Math.sin(theta_view)*Math.cos(phi), 
               radius*Math.sin(theta_view)*Math.sin(phi), 
               radius*Math.cos(theta_view));

	modelViewMatrix = lookAt(eye, at, up);

	if(flag) theta[axis] += 2.0 * (direction ? 1 : -1);
	modelViewMatrix = mult(modelViewMatrix, rotate(theta[xAxis], vec3(1, 0, 0)));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta[yAxis], vec3(0, 1, 0)));
	modelViewMatrix = mult(modelViewMatrix, rotate(theta[zAxis], vec3(0, 0, 1)));
	modelViewMatrix = mult(modelViewMatrix, translate(0.5, 0.5, 0.5));

	projectionMatrix = perspective(fovy, aspect, near, far);

    nMatrix = normalMatrix(modelViewMatrix, true);

	gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModelViewMatrix"), false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjectionMatrix"), false, flatten(projectionMatrix)); 
	
	gl.uniformMatrix3fv(gl.getUniformLocation(program, "uNormalMatrix"), false, flatten(nMatrix));

	gl.uniform1f(gl.getUniformLocation(program, "uSpotLightState"), spotLightState);

	gl.drawArrays( gl.TRIANGLES, 0, numVertices);

	setTimeout(
		function () {
			requestAnimationFrame(render);
		},

		speed
	);
}
