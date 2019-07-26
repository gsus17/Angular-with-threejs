import { AfterViewInit, Component, HostListener } from '@angular/core';
import * as THREE from 'three';
import './js/EnableThreeExamples';
import 'three/examples/js/controls/OrbitControls';
import 'three/examples/js/loaders/ColladaLoader';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements AfterViewInit {

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  private w: any = window;
  public controls: any;

  constructor() {
    console.log(`${SceneComponent.name}::ctor`);
    this.render = this.render.bind(this);
    this.onModelLoadingCompleted = this.onModelLoadingCompleted.bind(this);
  }

  /* LIFECYCLE */
  public ngAfterViewInit() {
    console.log(`${SceneComponent.name}::ngAfterViewInit`);
    this.createScene();
    this.createLight();
    this.createCamera();
    this.startRendering();
    this.addControls();
  }

  /**
   * Create the scene.
   */
  private createScene() {
    console.log(`${SceneComponent.name}::createScene`);
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AxesHelper(100));
    const w: any = window;
    const collada = w.THREE.ColladaLoader;
    const loader = new collada();
    // SRC https://3dwarehouse.sketchup.com/model/u12fe67aa-aa0b-4d43-ac46-f0881c639251/iPhone-6
    loader.load('assets/model/model.dae', this.onModelLoadingCompleted);
  }

  /**
   * Build the light.
   */
  private createLight() {
    console.log(`${SceneComponent.name}::createLight`);
    const iphoneColor = '#FAFAFA';
    const ambientLight = new THREE.AmbientLight('#EEEEEE');
    const hemiLight = new THREE.HemisphereLight(iphoneColor, iphoneColor, 0);
    const light = new THREE.PointLight(iphoneColor, 1, 100);

    hemiLight.position.set(0, 50, 0);
    light.position.set(0, 20, 10);

    this.scene.add(ambientLight);
    this.scene.add(hemiLight);
    this.scene.add(light);
  }

  /**
   * Create camera.
   */
  private createCamera() {
    console.log(`${SceneComponent.name}::createCamera`);
    this.camera = new THREE.PerspectiveCamera(
      15, window.innerWidth / window.innerHeight, 0.1, 1000
    );

    this.camera.position.set(-5, 12, 10);
    this.camera.lookAt(this.scene.position);
  }

  /**
   * Init the render.
   */
  private startRendering() {
    console.log(`${SceneComponent.name}::startRendering`);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
    const component: SceneComponent = this;

    (function render() {
      component.render();
    }());
  }

  /**
   * Add the scene controls.
   */
  private addControls() {
    console.log(`${SceneComponent.name}::addControls`);
    this.controls = new this.w.THREE.OrbitControls(this.camera);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;

    this.controls.addEventListener('change', this.render);
  }

  /**
   * Modeling.
   */
  private onModelLoadingCompleted(collada) {
    console.log(`${SceneComponent.name}::onModelLoadingCompleted`);
    const modelScene = collada.scene;
    this.scene.add(modelScene);
    this.render();
  }

  /**
   * Render.
   */
  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.controls.handleResize();
    this.render();
  }

  @HostListener('document:keypress', ['$event'])
  public onKeyPress(event: KeyboardEvent) {
    console.log('onKeyPress: ' + event.key);
  }
}
