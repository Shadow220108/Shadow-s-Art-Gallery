import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/Addons.js';


const images = [
  'socrates.jpg',
  'stars.jpg',
  'wave.jpg',
  'spring.jpg',
  'mountain.jpg',
  'sunday.jpg'
];

const titles = [
    'The Death of Socrates',
    'Starry Night',
    'The Great Wave off Kanagawa',
    'Effect of Spring Giverny',
    'Mount Cocoran',
    'A Sunday on La Grande Jatte'
];

const artists = [
    'Jacques-Louis David',
    'Vincent Van Gogh',
    'Katsushika Hokusai',
    'Claude Monet',
    'Albert Bierstadt',
    'George Seurat'
];
let currentIndex = 0;
let targetRotation = 0;
const factor = 0.02;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const textureLoader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const rootNode = new THREE.Object3D();
scene.add(rootNode);

const leftImage = textureLoader.load('left.png');
const rightImage = textureLoader.load('right.png');
let count = 6;
for (let i = 0; i < count; i++) {
  const texture = textureLoader.load(images[i]);
  texture.colorSpace = THREE.SRGBColorSpace;
  const baseNode = new THREE.Object3D();
  baseNode.rotation.y = i * (2 * Math.PI / count);
  rootNode.add(baseNode);
  const border = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 2.2, 0.09),
      new THREE.MeshStandardMaterial({color: 0x202020})
  );
  border.name = `Border_${i}`;
  border.position.z = -4;
  baseNode.add(border);
  const artwork = new THREE.Mesh(
      new THREE.BoxGeometry(3, 2, 0.1),
      new THREE.MeshStandardMaterial({ map: texture})
  );
  artwork.name = `Art_${i}`;
  artwork.position.z = -4;
  baseNode.add(artwork);

  const left = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.01),
      new THREE.MeshStandardMaterial({ map: leftImage, transparent: true})
  );
  left.name = `Left`;
  left.userData = ( i == count -1) ? 0 : i + 1;
  left.position.set(-1.8, 0, -4);
  baseNode.add(left);

  const right = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.01),
      new THREE.MeshStandardMaterial({ map: rightImage, transparent: true})
  );
  right.name = `Right`;
  right.userData = (i == 0) ? count - 1 : i - 1;
  right.position.set(1.8, 0, -4);
  baseNode.add(right);
}

const spotlight = new THREE.SpotLight(0xffffff, 100, 10, 0.62, 1);
spotlight.position.set(0, 5, 0);
spotlight.target.position.set(0, 0.5, -5);
scene.add(spotlight.target);
scene.add(spotlight);

const mirror = new Reflector(
    new THREE.CircleGeometry(10),
    {
        color: 0x303030,
        textureWidth: window.InnerWidth,
        textureHeight: window.InnerHeight
    }
)
mirror.position.y = -1.1;
mirror.rotateX(-Math.PI / 2);
scene.add(mirror);

function animate() {
  rootNode.rotation.y += (targetRotation - rootNode.rotation.y) * factor;
  renderer.render( scene, camera );

}
window.addEventListener('resize', () => {
   camera.aspect = window.innerWidth / window.innerHeight
   camera.updateProjectionMatrix();
   renderer.setSize( window.innerWidth, window.innerHeight );

});
function rotate(direction, newIndex) {
    targetRotation += direction * (2 * Math.PI / count);
    if ( direction == -1) {
        currentIndex = ( currentIndex + 1 ) % count;
    }
    else {
        currentIndex = ( currentIndex - 1 + count) % count;
    }
    updateText(currentIndex);
}
function updateText(index) {
    document.getElementById('title').innerText = titles[index];
    document.getElementById('artist').innerText = artists[index];
}
function add_star() {
  const star_geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const star_material = new THREE.MeshBasicMaterial({ color: 0xffffff  });
  const star = new THREE.Mesh(star_geometry, star_material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(500).fill().forEach(add_star);



window.addEventListener('click', (ev) => {
    const raycaster = new THREE.Raycaster();
    const  mouse = new THREE.Vector2(
        (ev.clientX /window.innerWidth ) * 2 - 1,
        -(ev.clientY /window.innerHeight ) * 2 + 1,
    );
    raycaster.setFromCamera(mouse, camera);
    const intersections = raycaster.intersectObject(rootNode, true);
    if (intersections.length > 0) {
        const obj = intersections[0].object;
        const newIndex = obj.userData;
        if (obj.name == 'Left') {
            rotate(-1, newIndex);
        }
        if (obj.name == 'Right') {
            rotate(1, newIndex);
        }

    }
});
document.getElementById('title').innerText = titles[0];
document.getElementById('artist').innerText = artists[0];


