//import some meshes and materials, for now we don't really know what these all are but that's okay
import {
	BoxGeometry,
	MeshBasicMaterial,
	MeshStandardMaterial,
	Mesh,
	TextureLoader,
	MeshPhysicalMaterial,
	SphereGeometry,
	PlaneGeometry,
} from 'three'
import { EXRLoader } from 'three/examples/jsm/Addons.js'

//define my texture loader
const loader = new TextureLoader()
const exrLoader = new EXRLoader()

//example function using textures and mesh physical material
export const addGroundMesh = () => {
	const color = loader.load('grass_path_2_diff_2k.jpg')
	// const normal = exrLoader.load('grass_path_2_nor_gl_2k.exr')
	const displace = loader.load('grass_path_2_disp_2k.png')
	// const roughness = exrLoader.load('grass_path_2_rough_2k.exr')

	const ground = new PlaneGeometry(200, 200)
	const groundMaterial = new MeshStandardMaterial({
		map: color,
		// normalMap: normal,
		displacementMap: displace,
		displacementScale: 0.5,
		//roughnessMap: roughness,
		//roughness: 1,
		//transmission: 0,
		//ior: 2.33,
		visible: false,
	})
	const groundMesh = new Mesh(ground, groundMaterial)
	//groundMesh.receiveShadow = true;
	//groundMesh.castShadow = false;
	return groundMesh
}
