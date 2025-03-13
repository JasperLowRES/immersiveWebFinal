import { Curves } from 'three/examples/jsm/Addons.js'
import {
	TubeGeometry,
	MeshBasicMaterial,
	DoubleSide,
	Mesh,
	Group,
	Vector3,
	CatmullRomCurve3,
	SphereGeometry,
} from 'three'

export const addTrack = () => {
	const group = new Group()

	const points = [
		new Vector3(-18, 18, -13.5),
		new Vector3(-17, 18.3, -10.5),
		new Vector3(-10, 15, -8),
		new Vector3(-7, 12, -2),
		new Vector3(0, 10, 10),
		new Vector3(12, 2, 10),
		new Vector3(20, 8, 2),
		new Vector3(7, 0.1, -1.5),
		new Vector3(7, 0, -1.5),
		new Vector3(7, -15, -1.5),
		new Vector3(2.3, -17, -2),
		new Vector3(2, -17, -2.3),
		new Vector3(2.3, -17, -2),
		new Vector3(2, -17.5, -2),
		new Vector3(2, -17, -1.7),
		new Vector3(2.2, -17.2, -2.3),
		new Vector3(1.9, -17, -2.1),
		new Vector3(2.3, -17, -2),
		new Vector3(2, -17, -2.3),
		new Vector3(2.3, -17, -2),
		new Vector3(2, -17.5, -2),
		new Vector3(2, -17, -1.7),
		new Vector3(2.2, -17.2, -2.3),
		new Vector3(1.9, -17, -2.1),
		new Vector3(2.3, -17, -2),
		new Vector3(2, -17, -2.3),
		new Vector3(2.3, -17, -2),
		new Vector3(2, -17.5, -2),
		new Vector3(2, -17, -1.7),
		new Vector3(2.2, -17.2, -2.3),
		new Vector3(1.9, -17, -2.1),
		new Vector3(7, -15, -1.5),
		new Vector3(7, 0, -1.5),
		new Vector3(7, 0.1, -1.5),
		new Vector3(20, 15, 2),
		new Vector3(12, 15, 10),
		new Vector3(0, 15, 10),
		new Vector3(-7, 15, -2),
		new Vector3(-8, 15, -8),
		new Vector3(-8, 18.3, -8),

		//new Vector3(0, -17, -10),
		//  new Vector3(-3, -21, -13),
		// new Vector3(-3, -17, -15),
	]

	const sphereGeometry = new SphereGeometry(0.5)
	const sphereMaterial = new MeshBasicMaterial({
		color: 'red',
		visible: false,
	})

	points.forEach((point) => {
		const sphere = new Mesh(sphereGeometry, sphereMaterial)
		sphere.position.copy(point)
		group.add(sphere)
	})
	const curve = new CatmullRomCurve3(points)
	const geometry = new TubeGeometry(curve, 100, 2, 8, true)
	const material = new MeshBasicMaterial({
		wireframe: true,
		side: DoubleSide,
		color: 0x00ff00,
		visible: false,
	})
	const tube = new Mesh(geometry, material)
	return { debug: group, track: tube }
}
