import './style.css'
import * as THREE from 'three'
import { addGroundMesh } from './addDefaultMeshes'
import { addLight } from './addDefaultLights'
import Model from './Model'
import { createSkybox, HDRI } from './environment'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { addTrack } from './addTrack'
import { gsap } from 'gsap'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const params = {
	exposure: 0,
}

const renderer = new THREE.WebGLRenderer({ antialias: true })

const clock = new THREE.Clock()

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)

const mixers = []

const meshes = {}

const lights = {}

const timeline = new gsap.timeline({ paused: true })
// const controls = new OrbitControls(camera, renderer.domElement)

const scrollSpeed = 0.1
let maxScrollProgress = 600
const totalDuration = 1
let scrollProgress = 0
let targetProgress = 0
let scrollVelocity = 0
const friction = 0.3
const acceleration = 0.00007
let maxVelocity = 0.006
const spring = 0.00001
const debug = document.querySelector('.scrollPosition')

const scene = new THREE.Scene()
const cameraTarget = new THREE.Vector3(116, 80, 42)
// const cameraTarget = new THREE.Vector3(0, 0, 0)

scene.fog = new THREE.FogExp2(0xcccccc, 0.003)

let timewarp02
//let loadedFlag = false
// const controls = new OrbitControls(camera, renderer.domElement)

let timelineInitialized = false;

const allModelNames = [
	'bonfire', 
	'drum01', 'drum02', 'drum03', 'drum04', 'drum05', 'drum06', 
	'drum07', 'drum08', 'drum09', 'drum10', 'drum11', 'drum12',
	'timewarp01', 'timewarp02',
	'timewarpInstrument01', 'timewarpInstrument02', 'timewarpInstrument03',
	'timewarpInstrument04', 'timewarpInstrument05', 'timewarpInstrument06', 'timewarpInstrument07',
	'flute', 'bagpipe', 'gong',
	'harpLyre', 'harp', 'hurdyGurdy',
	'sitar', 'bowHarp',
	'violin', 'clarinet', 'jawsHarp', 'harmonica', 'drumKit', 'moogSystem55', 'micStand',
	'lesPaul', 'keytar', 'tapeRecorder', 'amp', 'tr66', 'synthesizer',
	'dx7', 'tb303', 'jv1080',
	'cdj3000',
	'acousticGuitar', 'bassGuitar',
	'piano', 'stereo', 'tr909', 'semiModular', 'stoneAltar', 'hackerDesk', 'pelicanCase',
	'tripodLight01', 'tripodLight02', 'tripodLight03'
];

const drumGroup = new THREE.Group();
const techGroup = new THREE.Group();
scene.add(drumGroup);
scene.add(techGroup);

let pelicanLight;

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
	// const initialLookAtPosition = new THREE.Vector3()
	// camera.lookAt(initialLookAtPosition)

	meshes.ground = addGroundMesh()
	meshes.track = addTrack().track
	meshes.debug = addTrack().debug

	lights.default = addLight()

	scene.add(lights.default)
	scene.add(meshes.ground)
	scene.add(meshes.track)
	scene.add(meshes.debug)


	//meshes.ground.position.set(0, 0, 0)
	//meshes.ground.rotation.x = - Math.PI / 2

	// camera.position.set(40, 12, 6)
	// camera.lookAt(0, 1, 3)

	scene.background = HDRI()
	scene.environment = HDRI()
	createSkybox(scene)
	instances()
	resize()
	handleScroll()
	//initTimeline()

	animate()
}

function initTimeline() {
	if (meshes.bonfire) drumGroup.add(meshes.bonfire)
	if (meshes.drum01) drumGroup.add(meshes.drum01)
	if (meshes.drum02) drumGroup.add(meshes.drum02)
	if (meshes.drum03) drumGroup.add(meshes.drum03)
	if (meshes.drum04) drumGroup.add(meshes.drum04)
	if (meshes.drum05) drumGroup.add(meshes.drum05)
	if (meshes.drum06) drumGroup.add(meshes.drum06)
	if (meshes.drum07) drumGroup.add(meshes.drum07)
	if (meshes.drum08) drumGroup.add(meshes.drum08)
	if (meshes.drum09) drumGroup.add(meshes.drum09)
	if (meshes.drum10) drumGroup.add(meshes.drum10)
	if (meshes.drum11) drumGroup.add(meshes.drum11)
	if (meshes.drum12) drumGroup.add(meshes.drum12)
	if (meshes.timewarp02) drumGroup.add(meshes.timewarp02)

	if(meshes.hackerDesk) techGroup.add(meshes.hackerDesk)
	if(meshes.stoneAltar) techGroup.add(meshes.stoneAltar)
	if(meshes.pelicanCase) techGroup.add(meshes.pelicanCase)
	if(meshes.tripodLight01) techGroup.add(meshes.tripodLight01)
	if(meshes.tripodLight02) techGroup.add(meshes.tripodLight02)
	if(meshes.tripodLight03) techGroup.add(meshes.tripodLight03)

	if (meshes.pelicanCase) {
		pelicanLight = new THREE.PointLight(0x00ffff, 50, 50)
		pelicanLight.position.copy(meshes.pelicanCase.position)
		pelicanLight.position.x += 0.8
		pelicanLight.position.y += 0.8
		pelicanLight.castShadow = true
		scene.add(pelicanLight)	
		techGroup.add(pelicanLight)
		techGroup.add(meshes.pelicanCase)
	}

	const fireLookAtPosition = new THREE.Vector3(7, 0.1, -1.5)
	const wormHoleLookAtPosition = new THREE.Vector3(-3, -17, -13)


	timeline
		.to(
			cameraTarget,
			{
				x: fireLookAtPosition.x,
				y: fireLookAtPosition.y,
				z: fireLookAtPosition.z,
				duration: 0.07,
				ease: 'power2.inOut',
			},
			0
		)
		.to(
			cameraTarget,
			{
				x: wormHoleLookAtPosition.x,
				y: wormHoleLookAtPosition.y,
				z: wormHoleLookAtPosition.z,
				duration: 0.10,
				ease: 'power1.inOut',
			},
			0.35
		)
		.to(
			meshes.timewarpInstrument01.position,
			{
				x: 18,
				z: 8,
				duration: 0.04,
				ease: 'power1.inOut',
			},
			0.43
		)
		.to(
			meshes.timewarpInstrument02.position,
			{
				x: 18,
				z: 2,
				duration: 0.04,
				ease: 'power1.inOut',
			},
			0.435
		)
		.to(
			meshes.timewarpInstrument03.position,
			{
				x: 9.5,
				z: 9.5,
				duration: 0.04,
				ease: 'power1.inOut',
			},
			0.44
		)
		.to(
			meshes.timewarpInstrument04.position,
			{
				x: 9.5,
				z: 8,
				duration: 0.04,
				ease: 'power1.inOut',
			},
			0.445
		)
		.to(
			meshes.timewarpInstrument05.position,
			{
				x: 18,
				z: 10,
				duration: 0.04,
				ease: 'power1.inOut',
			},
			0.45
		)
		.to(
			meshes.timewarpInstrument06.position,
			{
				x: 18,
				z: 8,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.455
		)
		.to(
			meshes.timewarpInstrument07.position,
			{
				x: 16,
				y: -16,
				z: 8,
				duration: 0.04,
				ease: 'power1.inOut',
			},
			0.465
		)
		.to(
			meshes.flute.position,
			{
				x: 6,
				y: -16,
				z: 8,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.47
		)
		.to(
			meshes.bagpipe.position,
			{
				x: 18,
				z: 6,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.475
		)
		.to(
			meshes.gong.position,
			{
				x: 4,
				z: 6,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.478
		)
		.to(
			meshes.harpLyre.position,
			{
				x: 7,
				y: -14,
				z: 4,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.465
		)
		.to(
			meshes.harp.position,
			{
				x: 4,
				z: 6,
				duration: 0.05,
				ease: 'power1.inOut'
			},
			0.485
		)
		.to(
			meshes.hurdyGurdy.position,
			{
				x: 4,
				z: 13,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.49
		)
		.to(
			meshes.sitar.position,
			{
				x: 18,
				y: -17,
				z: 13,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.463
		)
		.to(
			meshes.bowHarp.position,
			{
				x: 14,
				y: -16,
				z: 5,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.465
		)
		.to(
			meshes.clarinet.position,
			{
				x: 1,
				y: -12,
				z: 8,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.47
		)
		.to(
			meshes.piano.position,
			{
				x: 15,
				y: -15,
				z: 6,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.485
		)
		.to(
			meshes.violin.position,
			{
				x: 4,
				y: -18,
				z: 8,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.491
		)
		.to(
			meshes.hourglass.position,
			{
				x: 8,
				z: 12,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.48
		)
		.to(
			meshes.trombone.position,
			{
				x: 25,
				y: -16,
				z: 7,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.49
		)
		.to(
			meshes.pipeOrgan.position,
			{
				x: 4,
				z: 2,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.498
		)
		.to(
			meshes.acousticGuitar.position,
			{
				x: 15,
				z: 7,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.51
		)
		.to(
			meshes.harmonica.position,
			{
				x: 7,
				z: 7,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.515
		)
		.to(
			meshes.drumKit.position,
			{
				x: 16,
				z: 7,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.517
		)
		.to(
			meshes.jawsHarp.position,
			{
				x: 19,
				y: -16,
				z: 3,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.495
		)
		.to(
			meshes.lesPaul.position,
			{
				x: 20,
				z: 4,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.52
		)
		.to(
			meshes.moogSystem55.position,
			{
				x: 7,
				z: 4,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.523
		)
		.to(
			meshes.amp.position,
			{
				x: 12,
				z: 4,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.527
		)
		.to(
			meshes.micStand.position,
			{
				x: 20,
				z: 4,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.528
		)
		.to(
			meshes.keytar.position,
			{
				x: 28,
				z: 6,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.538
		)
		.to(
			meshes.tapeRecorder.position,
			{
				x: 16,
				z: 9,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.528
		)
		.to(
			meshes.tr66.position,
			{
				x: 10,
				z: 4,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.53
		)
		.to(
			meshes.synthesizer.position,
			{
				x: 5,
				z: 4,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.532
		)
		.to(
			meshes.bassGuitar.position,
			{
				x: 10,
				z: 4,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.535
		)
		.to(
			meshes.dx7.position,
			{
				x: 10,
				y: -14,
				z: 11,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.54
		)
		.to(
			meshes.tb303.position,
			{
				x: 15,
				z: 5,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.538
		)
		.to(
			meshes.jv1080.position,
			{
				x: 10,
				z: 2,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.540
		)
		.to(
			meshes.tr909.position,
			{
				x: 20,
				y: -18,
				z: 15,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.542
		)
		.to(
			meshes.stereo.position,
			{
				x: 10,
				y: -15,
				z: 4,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.542
		)
		.to(
			meshes.semiModular.position,
			{
				x: 24,
				z: 6,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.548
		)
		.to(
			meshes.cdj3000.position,
			{
				x: 13,
				y: -12,
				z: 4,
				duration: 0.04,
				ease: 'power1.inOut'
			},
			0.545
		)
		.to(
			cameraTarget,
			{
				x: fireLookAtPosition.x,
				y: fireLookAtPosition.y,
				z: fireLookAtPosition.z,
				duration: 0.1,
				ease: 'power2.inOut',
			},
			0.6
		)
		.to(
			cameraTarget,
			{
				x: 116,
				y: 80,
				z: 42,
				duration: 0.19,
				ease: 'power2.inOut',
			},
			0.81
		)
}

function updateCamera(scrollProgress) {
	if (scrollProgress <= 1 && scrollProgress >= 0) {
		const position =
			meshes.track.geometry.parameters.path.getPointAt(scrollProgress)
		camera.position.copy(position)
	}

	camera.lookAt(cameraTarget)
	if (debug) {
		debug.innerHTML = `Progress: ${scrollProgress.toFixed(
			3
		)} || Velocity: ${scrollVelocity.toFixed(5)}`
	}
}

function handleScroll() {
	window.addEventListener('wheel', (event) => {
		const scrollDelta = event.deltaY || event.wheelDelta
		//console.log(cameraTarget)
		scrollVelocity += scrollDelta * acceleration
		scrollVelocity = Math.max(
			Math.min(scrollVelocity, maxVelocity),
			-maxVelocity
		)
	})
}

function instances() {
	const bonfire = new Model({
		name: 'bonfire',
		scene: scene,
		meshes: meshes,
		url: 'bonfire.glb',
		scale: new THREE.Vector3(3.5, 3.5, 3.5),
		position: new THREE.Vector3(25, 0.1, -3.5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum01 = new Model({
		name: 'drum01',
		scene: scene,
		meshes: meshes,
		url: 'african_drum_1.glb',
		scale: new THREE.Vector3(0.6, 0.6, 0.6),
		position: new THREE.Vector3(0.4, 0.7, 4),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum02 = new Model({
		name: 'drum02',
		scene: scene,
		meshes: meshes,
		url: 'african_drum_2.glb',
		scale: new THREE.Vector3(0.12, 0.12, 0.12),
		position: new THREE.Vector3(4.5, -0.2, 5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum03 = new Model({
		name: 'drum03',
		scene: scene,
		meshes: meshes,
		url: 'african_drum_raw_scan.glb',
		scale: new THREE.Vector3(0.7, 0.7, 0.7),
		position: new THREE.Vector3(8.4, 2.8, 5.5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum04 = new Model({
		name: 'drum04',
		scene: scene,
		meshes: meshes,
		url: 'darbuka_drum.glb',
		scale: new THREE.Vector3(1.5, 1.5, 1.5),
		position: new THREE.Vector3(12, 0, 3.5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum05 = new Model({
		name: 'drum05',
		scene: scene,
		meshes: meshes,
		url: 'djembe_-_african_drum_-_scan.glb',
		scale: new THREE.Vector3(5.5, 5.5, 5.5),
		position: new THREE.Vector3(-2, 0, 0),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum06 = new Model({
		name: 'drum06',
		scene: scene,
		meshes: meshes,
		url: 'drum_roll.glb',
		scale: new THREE.Vector3(1.5, 1.5, 1.5),
		position: new THREE.Vector3(-2, -0.4, -3.7),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum07 = new Model({
		name: 'drum07',
		scene: scene,
		meshes: meshes,
		url: 'drum.glb',
		scale: new THREE.Vector3(5, 5, 5),
		position: new THREE.Vector3(0, -0.3, -7.1),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum08 = new Model({
		name: 'drum08',
		scene: scene,
		meshes: meshes,
		url: 'kcisa-drum.glb',
		scale: new THREE.Vector3(0.5, 0.5, 0.5),
		position: new THREE.Vector3(3.5, 0.7, -9.5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum09 = new Model({
		name: 'drum09',
		scene: scene,
		meshes: meshes,
		url: 'traditional_drum.glb',
		scale: new THREE.Vector3(0.8, 0.8, 0.8),
		position: new THREE.Vector3(7, 1.2, -9.5),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum10 = new Model({
		name: 'drum10',
		scene: scene,
		meshes: meshes,
		url: 'tribal_drum_free.glb',
		scale: new THREE.Vector3(0.03, 0.03, 0.03),
		position: new THREE.Vector3(11, 0.6, -8),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum11 = new Model({
		name: 'drum11',
		scene: scene,
		meshes: meshes,
		url: 'zulu_drum.glb',
		scale: new THREE.Vector3(1.5, 1.5, 1.5),
		position: new THREE.Vector3(14, 1.3, 0),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const drum12 = new Model({
		name: 'drum12',
		scene: scene,
		meshes: meshes,
		url: 'african_drum.glb',
		scale: new THREE.Vector3(0.8, 0.8, 0.8),
		position: new THREE.Vector3(13.5, 0, -4),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	const timewarp01 = new Model({
		name: 'timewarp01',
		scene: scene,
		meshes: meshes,
		url: 'spacevortex.glb',
		scale: new THREE.Vector3(0.8, 0.8, 0.8),
		position: new THREE.Vector3(7, -0.1, -1.2),
		rotation: new THREE.Vector3(Math.PI / 2, 0, 0),
		castShadow: true,
		//animationState: true,
		mixers: mixers,
	})
	timewarp02 = new Model({
		name: 'timewarp02',
		scene: scene,
		meshes: meshes,
		url: 'free_tunnel_wormhole_space_fly_effect_loop.glb',
		scale: new THREE.Vector3(1.2, 1.2, 1.2),
		position: new THREE.Vector3(2, -16, -2),
		//rotation: new THREE.Vector3((-Math.PI / 2), 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument01 = new Model({
		name: 'timewarpInstrument01',
		scene: scene,
		meshes: meshes,
		url: 'flute_en_os.glb',
		scale: new THREE.Vector3(0.05, 0.05, 0.05),
		position: new THREE.Vector3(-80, -16, -46),
		rotation: new THREE.Vector3(-Math.PI / 2, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument02 = new Model({
		name: 'timewarpInstrument02',
		scene: scene,
		meshes: meshes,
		url: 'maori_nguru_nose_flute.glb',
		scale: new THREE.Vector3(1.5, 1.5, 1.5),
		position: new THREE.Vector3(-82, -22, -48),
		rotation: new THREE.Vector3(-Math.PI / 2, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument03 = new Model({
		name: 'timewarpInstrument03',
		scene: scene,
		meshes: meshes,
		url: 'ocarina.glb',
		scale: new THREE.Vector3(0.3, 0.3, 0.3),
		position: new THREE.Vector3(-13, -16, -57),
		rotation: new THREE.Vector3(-Math.PI / 2, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument04 = new Model({
		name: 'timewarpInstrument04',
		scene: scene,
		meshes: meshes,
		url: 'putto.glb',
		scale: new THREE.Vector3(10, 10, 10),
		position: new THREE.Vector3(-86, -18, -51),
		rotation: new THREE.Vector3(0, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument05 = new Model({
		name: 'timewarpInstrument05',
		scene: scene,
		meshes: meshes,
		url: 'sanza_a_musical_instrument.glb',
		scale: new THREE.Vector3(0.15, 0.15, 0.15),
		position: new THREE.Vector3(-80, -18, -50),
		rotation: new THREE.Vector3(0, Math.PI, Math.PI / 2),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument06 = new Model({
		name: 'timewarpInstrument06',
		scene: scene,
		meshes: meshes,
		url: 'viking_horn.glb',
		scale: new THREE.Vector3(20, 20, 20),
		position: new THREE.Vector3(-13, -18, -57),
		rotation: new THREE.Vector3(0, Math.PI, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const timewarpInstrument07 = new Model({
		name: 'timewarpInstrument07',
		scene: scene,
		meshes: meshes,
		url: '1918.362_lute.glb',
		scale: new THREE.Vector3(4, 4, 4),
		position: new THREE.Vector3(-80, -14, -50),
		rotation: new THREE.Vector3(0, Math.PI / 2, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const flute = new Model({
		name: 'flute',
		scene: scene,
		meshes: meshes,
		url: 'basic_flute.glb',
		scale: new THREE.Vector3(0.4, 0.4, 0.4),
		position: new THREE.Vector3(0, -14, -45),
		rotation: new THREE.Vector3(0, Math.PI /2 , 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const bagpipe = new Model({
		name: 'bagpipe',
		scene: scene,
		meshes: meshes,
		url: 'bagpipes_mesh_-_free_to_download.glb',
		scale: new THREE.Vector3(12, 12, 12),
		position: new THREE.Vector3(-80, -18, -50),
		rotation: new THREE.Vector3(0, Math.PI, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const gong = new Model({
		name: 'gong',
		scene: scene,
		meshes: meshes,
		url: 'framed_gong.glb',
		scale: new THREE.Vector3(0.04, 0.04, 0.04),
		position: new THREE.Vector3(-20, -20, -45),
		rotation: new THREE.Vector3(0, Math.PI, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const harpLyre = new Model({
		name: 'harpLyre',
		scene: scene,
		meshes: meshes,
		url: 'harp_lyre.glb',
		scale: new THREE.Vector3(0.03, 0.03, 0.03),
		position: new THREE.Vector3(-77, -18, -45),
		rotation: new THREE.Vector3(0, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const harp = new Model({
		name: 'harp',
		scene: scene,
		meshes: meshes,
		url: 'harp.glb',
		scale: new THREE.Vector3(3.5, 3.5, 3.5),
		position: new THREE.Vector3(-13, -16, -50),
		rotation: new THREE.Vector3(0, Math.PI / 2, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const hurdyGurdy = new Model({
		name: 'hurdyGurdy',
		scene: scene,
		meshes: meshes,
		url: 'hurdy-gurdy.glb',
		scale: new THREE.Vector3(0.02, 0.02, 0.02),
		position: new THREE.Vector3(-20, -14, -45),
		rotation: new THREE.Vector3(0, Math.PI, Math.PI/2),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const sitar = new Model({
		name: 'sitar',
		scene: scene,
		meshes: meshes,
		url: 'sitar.glb',
		scale: new THREE.Vector3(0.5, 0.5, 0.5),
		position: new THREE.Vector3(-24, -20, -30),
		rotation: new THREE.Vector3( - Math.PI /2 , - Math.PI / 2, Math.PI),
		castShadow: true,
		animationState: true,
		mixers: mixers,
		})

	const bowHarp = new Model({
		name: 'bowHarp',
		scene: scene,
		meshes: meshes,
		url: 'bow_harp.glb',
		scale: new THREE.Vector3(0.007, 0.007, 0.007),
		position: new THREE.Vector3(-80, -16, -46),
		rotation: new THREE.Vector3(-Math.PI / 2, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const clarinet = new Model({
		name: 'clarinet',
		scene: scene,
		meshes: meshes,
		url: 'clarinet_model_with_annotations.glb',
		scale: new THREE.Vector3(0.05, 0.05, 0.05),
		position: new THREE.Vector3(-13, -20, -57),
		rotation: new THREE.Vector3(-Math.PI / 2, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const piano = new Model({
		name: 'piano',
		scene: scene,
		meshes: meshes,
		url: 'piano.glb',
		scale: new THREE.Vector3(2, 2, 2),
		position: new THREE.Vector3(-86, -18, -51),
		rotation: new THREE.Vector3(0, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const violin = new Model({
		name: 'violin',
		scene: scene,
		meshes: meshes,
		url: 'violin.glb',
		scale: new THREE.Vector3(6, 6, 6),
		position: new THREE.Vector3(-20, -14, -45),
		rotation: new THREE.Vector3(0, Math.PI, Math.PI / 2),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const hourglass = new Model({
		name: 'hourglass',
		scene: scene,
		meshes: meshes,
		url: 'hourglass.glb',
		scale: new THREE.Vector3(0.05, 0.05, 0.05),
		position: new THREE.Vector3(-13, -18, -57),
		rotation: new THREE.Vector3(0, Math.PI, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const trombone = new Model({
		name: 'trombone',
		scene: scene,
		meshes: meshes,
		url: 'used_trombone.glb',
		scale: new THREE.Vector3(2, 2, 2),
		position: new THREE.Vector3(-80, -24, -50),
		rotation: new THREE.Vector3(0, Math.PI / 2, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const pipeOrgan = new Model({
		name: 'pipeOrgan',
		scene: scene,
		meshes: meshes,
		url: 'pipe_organs.glb',
		scale: new THREE.Vector3(1, 1, 1),
		position: new THREE.Vector3(-20, -16, -50),
		rotation: new THREE.Vector3(0 ,  0 , 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const acousticGuitar = new Model({
		name: 'acousticGuitar',
		scene: scene,
		meshes: meshes,
		url: 'dd_acoustic_guitar.glb',
		scale: new THREE.Vector3(0.006, 0.006, 0.006),
		position: new THREE.Vector3(-50, -18, -50),
		rotation: new THREE.Vector3(0 ,  0 , 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const harmonica = new Model({
		name: 'harmonica',
		scene: scene,
		meshes: meshes,
		url: 'harmonica.glb',
		scale: new THREE.Vector3(7, 7, 7),
		position: new THREE.Vector3(-30, -18, -50),
		rotation: new THREE.Vector3(Math.PI ,  Math.PI , 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const drumKit = new Model({
		name: 'drumKit',
		scene: scene,
		meshes: meshes,
		url: 'drum_kit.glb',
		scale: new THREE.Vector3(0.002, 0.002, 0.002),
		position: new THREE.Vector3(-30, -18, -50),
		rotation: new THREE.Vector3(0 ,  0 , 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const jawsHarp = new Model({
		name: 'jawsHarp',
		scene: scene,
		meshes: meshes,
		url: 'jaws_harp.glb',
		scale: new THREE.Vector3(0.4, 0.4, 0.4),
		position: new THREE.Vector3(0, -14, -45),
		rotation: new THREE.Vector3(0, Math.PI /2 , 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const lesPaul = new Model({
		name: 'lesPaul',
		scene: scene,
		meshes: meshes,
		url: 'epiphone_les_paul_standard.glb',
		scale: new THREE.Vector3(0.005, 0.005, 0.005),
		position: new THREE.Vector3(-80, -18, -50),
		rotation: new THREE.Vector3(0, Math.PI/2, Math.PI /2),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const moogSystem55 = new Model({
		name: 'moogSystem55',
		scene: scene,
		meshes: meshes,
		url: 'moog_system_55.glb',
		scale: new THREE.Vector3(0.5, 0.5, 0.5),
		position: new THREE.Vector3(-40, -18, -50),
		rotation: new THREE.Vector3(0, Math.PI/2, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const micStand = new Model({
		name: 'micStand',
		scene: scene,
		meshes: meshes,
		url: 'classic_microphone.glb',
		scale: new THREE.Vector3(3, 3, 3),
		position: new THREE.Vector3(-70, -14, -50),
		rotation: new THREE.Vector3(0, Math.PI/2, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const keytar = new Model({
		name: 'keytar',
		scene: scene,
		meshes: meshes,
		url: 'keytar_alesis_vortex_2.glb',
		scale: new THREE.Vector3(4, 4, 4),
		position: new THREE.Vector3(-20, -17, -45),
		rotation: new THREE.Vector3(0, Math.PI, -Math.PI / 2),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const tapeRecorder = new Model({
		name: 'tapeRecorder',
		scene: scene,
		meshes: meshes,
		url: 'stereophonic_tape_recorder_electronics_ta1-003.glb',
		scale: new THREE.Vector3(4, 4, 4),
		position: new THREE.Vector3(-20, -16, -45),
		rotation: new THREE.Vector3(0, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const amp = new Model({
		name: 'amp',
		scene: scene,
		meshes: meshes,
		url: 'marshall_amp_combo.glb',
		scale: new THREE.Vector3(5, 5, 5),
		position: new THREE.Vector3(-20, -18, -45),
		rotation: new THREE.Vector3(0, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const tr66 = new Model({
		name: 'tr66',
		scene: scene,
		meshes: meshes,
		url: 'tr-66_rhythm_arranger.glb',
		scale: new THREE.Vector3(1.1, 1.1, 1.1),
		position: new THREE.Vector3(-20, -16, -45),
		rotation: new THREE.Vector3(0, Math.PI / 4, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const synthesizer = new Model({
		name: 'synthesizer',
		scene: scene,
		meshes: meshes,
		url: 'synthesizer.glb',
		scale: new THREE.Vector3(4, 4, 4),
		position: new THREE.Vector3(-13, -15, -50),
		rotation: new THREE.Vector3(0, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const bassGuitar = new Model({
		name: 'bassGuitar',
		scene: scene,
		meshes: meshes,
		url: 'bass_guitar.glb',
		scale: new THREE.Vector3(0.05, 0.05, 0.05),
		position: new THREE.Vector3(-13, -15, -50),
		rotation: new THREE.Vector3(Math.PI / 2, Math.PI / 2, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const dx7 = new Model({
		name: 'dx7',
		scene: scene,
		meshes: meshes,
		url: 'yamaha_dx7.glb',
		scale: new THREE.Vector3(3.5, 3.5, 3.5),
		position: new THREE.Vector3(-13, -16, -50),
		rotation: new THREE.Vector3(Math.PI / 2, 0 , - Math.PI / 2),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const tb303 = new Model({
		name: 'tb303',
		scene: scene,
		meshes: meshes,
		url: 'roland_tb-303_bass_line_synthesizer.glb',
		scale: new THREE.Vector3(3, 3, 3),
		position: new THREE.Vector3(-40, -14.9, -45),
		rotation: new THREE.Vector3(-Math.PI / 2, Math.PI/2, Math.PI/2),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
		const jv1080 = new Model({
		name: 'jv1080',
		scene: scene,
		meshes: meshes,
		url: 'roland_jv-1080_synthesizer_raw_scan.glb',
		scale: new THREE.Vector3(0.08, 0.08, 0.08),
		position: new THREE.Vector3(-40, -13, -45),
		rotation: new THREE.Vector3( -Math.PI / 4, 0, - Math.PI / 5),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const tr909 = new Model({
		name: 'tr909',
		scene: scene,
		meshes: meshes,
		url: 'roland_tr-909.glb',
		scale: new THREE.Vector3(1, 1, 1),
		position: new THREE.Vector3(-40, -16, -50),
		rotation: new THREE.Vector3(0, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const semiModular = new Model({
		name: 'semiModular',
		scene: scene,
		meshes: meshes,
		url: 'moog_dfam__mother-32_synthesizers_bad_scan_3.glb',
		scale: new THREE.Vector3(0.7, 0.7, 0.7),
		position: new THREE.Vector3(-20, -12, -50),
		rotation: new THREE.Vector3(0, Math.PI/2, 0 ),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const stereo = new Model({
		name: 'stereo',
		scene: scene,
		meshes: meshes,
		url: 'sony_mhc-ex600.glb',
		scale: new THREE.Vector3(2, 2, 2),
		position: new THREE.Vector3(-40, -10, -50),
		rotation: new THREE.Vector3(0, Math.PI / 2, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const cdj3000 = new Model({
		name: 'cdj3000',
		scene: scene,
		meshes: meshes,
		url: 'pioneer_cdj_3000.glb',
		scale: new THREE.Vector3(1, 1, 1),
		position: new THREE.Vector3(-40, -15, -50),
		rotation: new THREE.Vector3(-Math.PI / 2, Math.PI, Math.PI / 2),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const hackerDesk = new Model({
		name: 'hackerDesk',
		scene: scene,
		meshes: meshes,
		url: 'hacker_room_-_stylized.glb',
		scale: new THREE.Vector3(0.04, 0.04, 0.04),
		position: new THREE.Vector3(-4, -0.1, -1.37),
		rotation: new THREE.Vector3(0, - Math.PI /2 ,0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const stoneAltar = new Model({
		name: 'stoneAltar',
		scene: scene,
		meshes: meshes,
		url: 'stone_altar.glb',
		scale: new THREE.Vector3(0.02, 0.02, 0.02),
		position: new THREE.Vector3(4, 0, -1.75),
		rotation: new THREE.Vector3(0, Math.PI / 2, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const pelicanCase = new Model({
		name: 'pelicanCase',
		scene: scene,
		meshes: meshes,
		url: 'pelican_case.glb',
		scale: new THREE.Vector3(0.014, 0.014, 0.014),
		position: new THREE.Vector3(5.2, 2.96, -1.5),
		rotation: new THREE.Vector3(0, Math.PI / 2, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const tripodLight01 = new Model({
		name: 'tripodLight01',
		scene: scene,
		meshes: meshes,
		url: 'tripod_worklight.glb',
		scale: new THREE.Vector3(0.027, 0.027, 0.027),
		position: new THREE.Vector3(3.75, 0, -10.84),
		rotation: new THREE.Vector3(0, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const tripodLight02 = new Model({
		name: 'tripodLight02',
		scene: scene,
		meshes: meshes,
		url: 'tripod_worklight.glb',
		scale: new THREE.Vector3(0.027, 0.027, 0.027),
		position: new THREE.Vector3(3.75, 0, 7.57),
		rotation: new THREE.Vector3(0, Math.PI, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})
	const tripodLight03 = new Model({
		name: 'tripodLight03',
		scene: scene,
		meshes: meshes,
		url: 'tripod_omni_directional_lamp.glb',
		scale: new THREE.Vector3(3.5, 3.5, 3.5),
		position: new THREE.Vector3(13.7, 3.875, -1.3),
		rotation: new THREE.Vector3(0, 0, 0),
		castShadow: true,
		animationState: true,
		mixers: mixers,
	})

	bonfire.init()
	drum01.init()
	drum02.init()
	drum03.init()
	drum04.init()
	drum05.init()
	drum06.init()
	drum07.init()
	drum08.init()
	drum09.init()
	drum10.init()
	drum11.init()
	drum12.init()
	timewarp01.init()
	timewarp02.init()
	timewarpInstrument01.init()
	timewarpInstrument02.init()
	timewarpInstrument03.init()
	timewarpInstrument04.init()
	timewarpInstrument05.init()
	timewarpInstrument06.init()
	timewarpInstrument07.init()
	
	flute.init()
	bagpipe.init()
	gong.init()
	harpLyre.init()
	harp.init()
	hourglass.init()
	hurdyGurdy.init()
	sitar.init()
	bowHarp.init()
	violin.init()
	clarinet.init()
	jawsHarp.init()
	lesPaul.init()
	micStand.init()
	keytar.init()
	tapeRecorder.init()
	trombone.init()
	pipeOrgan.init()
	acousticGuitar.init()
	harmonica.init()
	drumKit.init()
	moogSystem55.init()
	amp.init()
	tr66.init()
	piano.init()
	synthesizer.init()
	bassGuitar.init()
	dx7.init()
	tb303.init()
	jv1080.init()
	cdj3000.init()
	stereo.init()
	tr909.init()
	semiModular.init()
	hackerDesk.init()
	stoneAltar.init()
	pelicanCase.init()
	tripodLight01.init()
	tripodLight02.init()
	tripodLight03.init()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	const delta = clock.getDelta()
	requestAnimationFrame(animate)

	if (!timelineInitialized) {
        const loadedModels = allModelNames.filter(name => meshes[name] !== undefined);
        
            if (loadedModels.length == allModelNames.length) {
            timelineInitialized = true;
            initTimeline();
        }
    }
	//controls.update()


	// if (!loadedFlag) {
	// 	if (meshes.bonfire && meshes.timewarpInstrument06) {
	// 		loadedFlag = true
	// 		initTimeline()
	// 	}
	// }
	
	const distance = targetProgress - scrollProgress
	scrollVelocity += distance * spring
	scrollVelocity *= friction
	scrollProgress += scrollVelocity

	targetProgress += scrollVelocity
	scrollVelocity *= friction
	if (Math.abs(scrollVelocity < 0.0001)) {
		scrollVelocity = 0
	}

	targetProgress = Math.max(0, Math.min(targetProgress, 1))

	scrollProgress += (targetProgress - scrollProgress) * 0.1

	if (scrollProgress >= 0.44 && scrollProgress <= 0.58) {
		for (const mixer of mixers) {
			mixer.update(delta)
		}
		maxVelocity = 0.0006
	}
	else {
		maxVelocity = 0.006
	}
	
	meshes.timewarpInstrument01.rotation.x += 0.01
	//meshes.timewarpInstrument01.rotation.y -= 0.013
	//meshes.timewarpInstrument02.rotation.x += 0.007
	//meshes.timewarpInstrument02.rotation.y -= 0.007
	meshes.timewarpInstrument03.rotation.x += 0.003
	//meshes.timewarpInstrument03.rotation.y -= 0.015	
	//meshes.timewarpInstrument04.rotation.z += 0.007
	//meshes.timewarpInstrument04.rotation.y -= 0.013	
	meshes.bagpipe.rotation.x += 0.003
	//meshes.bagpipe.rotation.z -= 0.004
	meshes.gong.rotation.x += 0.011
	//meshes.gong.rotation.y -= 0.011
	meshes.hurdyGurdy.rotation.z += 0.007




	updateCamera(scrollProgress)
	timeline.seek(scrollProgress)

	if (drumGroup) {
		if (scrollProgress >= 0.635) {
			drumGroup.visible = false;
		} else {
			drumGroup.visible = true;
		}
	}
	if(techGroup) {
		if(scrollProgress >= 0.5) {
			techGroup.visible = true;
		} else {
			techGroup.visible = false;
		}
	}


	renderer.render(scene, camera)
}
