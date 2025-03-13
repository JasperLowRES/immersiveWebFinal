import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { EquirectangularReflectionMapping } from 'three'
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';


export function createSkybox(scene) {
    const params = {
        height: 15,
        radius: 70,
        enabled: true,
    };
    const exrLoader = new EXRLoader()
    exrLoader.load('rogland_clear_night_2k copy.exr', (envMap) => {
        envMap.mapping = EquirectangularReflectionMapping        
        const skybox = new GroundedSkybox(envMap, params.height, params.radius);
        skybox.position.y = params.height - 0.01;

        skybox.material.opacity = 1;
        skybox.material.depthWrite = true;

        scene.add(skybox);
        //scene.background = envMap;
        scene.environment = envMap;
    });
}

export function HDRI() {
	const exrLoader = new EXRLoader()
	const hdrMap = exrLoader.load('NightSkyHDRI009_2K-HDR.exr', (envMap) => {
		envMap.mapping = EquirectangularReflectionMapping
		return envMap
	})
	return hdrMap
}